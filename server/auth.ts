import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import {
  clearLoginFailures,
  getLoginBlock,
  recordLoginFailure,
} from "./repositories/authRateLimitRepository";

const AUTH_COOKIE = "digital-tools-session";
const SESSION_DURATION_SECONDS = 8 * 60 * 60;

function getCookie(req: Request, name: string): string | undefined {
  const cookies = req.headers.cookie?.split(";") ?? [];
  for (const cookie of cookies) {
    const [cookieName, ...valueParts] = cookie.trim().split("=");
    if (cookieName === name) {
      return decodeURIComponent(valueParts.join("="));
    }
  }
  return undefined;
}

function safeEqual(left: string, right: string): boolean {
  const leftDigest = createHash("sha256").update(left).digest();
  const rightDigest = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftDigest, rightDigest);
}

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET must be configured when DTC_ACCESS_PASSWORD is enabled");
  }
  return secret;
}

function signExpiration(expiresAt: string): string {
  return createHmac("sha256", getSessionSecret()).update(expiresAt).digest("base64url");
}

function createSessionToken(): string {
  const expiresAt = String(Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS);
  return `${expiresAt}.${signExpiration(expiresAt)}`;
}

function getRateLimitKey(req: Request): string {
  return createHmac("sha256", getSessionSecret())
    .update(req.ip || req.socket.remoteAddress || "unknown")
    .digest("hex");
}

function secondsUntil(date: Date): number {
  return Math.max(1, Math.ceil((date.getTime() - Date.now()) / 1000));
}

function hasValidSession(req: Request): boolean {
  if (!process.env.DTC_ACCESS_PASSWORD) {
    return true;
  }

  const token = getCookie(req, AUTH_COOKIE);
  if (!token) {
    return false;
  }

  const [expiresAt, signature] = token.split(".");
  if (!expiresAt || !signature || Number(expiresAt) <= Math.floor(Date.now() / 1000)) {
    return false;
  }

  return safeEqual(signature, signExpiration(expiresAt));
}

export function registerAuthRoutes(app: import("express").Express): void {
  app.get("/api/auth/check", (req, res) => {
    res.json({
      passwordRequired: Boolean(process.env.DTC_ACCESS_PASSWORD),
      authenticated: hasValidSession(req),
    });
  });

  app.post("/api/auth/verify-password", async (req, res) => {
    const correctPassword = process.env.DTC_ACCESS_PASSWORD;
    const suppliedPassword = typeof req.body?.password === "string" ? req.body.password : "";

    if (correctPassword) {
      const rateLimitKey = getRateLimitKey(req);

      try {
        const existingBlock = await getLoginBlock(rateLimitKey);
        if (existingBlock) {
          res.setHeader("Retry-After", String(secondsUntil(existingBlock)));
          return res.status(429).json({ success: false, error: "Too many attempts" });
        }

        if (!safeEqual(suppliedPassword, correctPassword)) {
          const blockedUntil = await recordLoginFailure(rateLimitKey);
          if (blockedUntil) {
            res.setHeader("Retry-After", String(secondsUntil(blockedUntil)));
            return res.status(429).json({ success: false, error: "Too many attempts" });
          }
          return res.status(401).json({ success: false, error: "Invalid password" });
        }

        await clearLoginFailures(rateLimitKey);
      } catch (error) {
        console.error("Authentication rate limiter failed:", error);
        return res.status(503).json({ success: false, error: "Authentication unavailable" });
      }
    }

    if (correctPassword) {
      res.cookie(AUTH_COOKIE, createSessionToken(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_DURATION_SECONDS * 1000,
        path: "/",
      });
    }

    return res.json({ success: true });
  });

  app.post("/api/auth/logout", (_req, res) => {
    res.clearCookie(AUTH_COOKIE, { path: "/" });
    res.status(204).send();
  });
}

export function requireAuthenticatedSession(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (hasValidSession(req)) {
    next();
    return;
  }

  res.status(401).json({ error: "Authentication required" });
}