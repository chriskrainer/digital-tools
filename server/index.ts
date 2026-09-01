import dotenv from "dotenv";
import { existsSync } from "fs";

if (existsSync(".env.local")) {
  dotenv.config({ path: ".env.local", override: true });
} else if (existsSync(".env")) {
  dotenv.config({ override: true });
}

import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import { registerRoutes } from "./digitalToolsRoutes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Security headers middleware
const isDevelopment = app.get("env") === "development";

const cspDirectives: Record<string, string[]> = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'"],
  styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  imgSrc: ["'self'", "data:", "blob:"],
  connectSrc: ["'self'", "https://*.replit.app", "https://*.replit.dev", "wss://*.replit.dev"],
  fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
  objectSrc: ["'none'"],
  frameAncestors: ["'self'", "https://*.replit.com", "https://*.replit.dev", "https://*.replit.app"],
};

app.use(helmet({
  contentSecurityPolicy: {
    directives: cspDirectives,
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  // Disable X-Frame-Options as we use CSP frame-ancestors instead
  frameguard: false,
  // HSTS: Only enable preload in production if the domain has valid HTTPS
  hsts: isDevelopment
    ? {
        maxAge: 0,
        includeSubDomains: false,
        preload: false,
      }
    : {
        maxAge: 63072000,
        includeSubDomains: true,
        preload: false,
      },
}));

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  limit: '50mb',
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Some clients base64-encode their JSON request body to avoid Replit's edge
// web-application-firewall inspecting (and 403-blocking) HTML/rich-text content.
// Decode it transparently here so route handlers see the original payload.
// See client/src/lib/wafSafeFetch.ts.
app.use((req, _res, next) => {
  try {
    if (
      req.headers["x-payload-encoding"] === "base64" &&
      req.body &&
      typeof (req.body as any).__encb64 === "string"
    ) {
      const decoded = Buffer.from((req.body as any).__encb64, "base64").toString("utf8");
      req.body = JSON.parse(decoded);
    }
  } catch {
    // Leave the body untouched if decoding fails.
  }
  next();
});

// Cache hardening: after each republish, the built JS/CSS files get new hashed
// names. If a browser holds a stale cached copy of the HTML shell (or loads the
// page mid-deploy), it will request asset files that no longer exist and render
// a blank page. Force HTML/navigation responses to always revalidate, while
// hashed /assets files may be cached forever (their names change on rebuild).
app.use((req, res, next) => {
  if (req.path.startsWith("/assets/")) {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  } else if (!req.path.startsWith("/api/")) {
    const hasExtension = /\.[a-zA-Z0-9]+$/.test(req.path);
    if (!hasExtension || req.path.endsWith(".html")) {
      res.setHeader("Cache-Control", "no-cache, must-revalidate");
    }
  }
  next();
});

// Prevent search engines from indexing the entire site. The X-Robots-Tag
// header is the authoritative deindex signal and is applied to every response
// (pages, assets, downloads). It does not affect link-unfurl bots, which read
// Open Graph tags regardless of this header.
app.use((_req, res, next) => {
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
  next();
});

// robots.txt: we intentionally do NOT block crawling here. The authoritative
// "keep out of search" mechanism is the global X-Robots-Tag: noindex header
// (plus the meta robots tag). A blanket "Disallow: /" would stop crawlers from
// ever fetching the pages, which means they could never see the noindex signal
// and already-known URLs could linger in the index. Allowing the crawl lets
// search engines read noindex and drop the pages. Allowing the crawl also keeps
// messaging-app link-unfurl previews working.
app.get("/robots.txt", (_req, res) => {
  res.type("text/plain").send(
    [
      "# This site is intentionally kept out of search results via the",
      "# X-Robots-Tag: noindex header (and meta robots tag) on every page.",
      "# Crawling is allowed so search engines can read and honor noindex.",
      "User-agent: *",
      "Allow: /",
      "",
    ].join("\n"),
  );
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "API endpoint not found" });
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
