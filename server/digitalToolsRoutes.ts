import type { Express } from "express";
import { createServer, type Server } from "http";
import { digitalToolsStorage } from "./digitalToolsStorage";
import { registerQRCodeRoutes } from "./routes/qrCodeRoutes";
import { registerUTMCampaignRoutes } from "./routes/utmCampaignRoutes";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/auth/verify-password", (req, res) => {
    const { password } = req.body;
    const correctPassword = process.env.DTC_ACCESS_PASSWORD;

    if (!correctPassword || password === correctPassword) {
      return res.json({ success: true });
    }

    return res.status(401).json({ success: false, error: "Invalid password" });
  });

  app.get("/api/auth/check", (_req, res) => {
    res.json({ passwordRequired: Boolean(process.env.DTC_ACCESS_PASSWORD) });
  });

  registerQRCodeRoutes(app, digitalToolsStorage);
  registerUTMCampaignRoutes(app, digitalToolsStorage);

  const httpServer = createServer(app);
  httpServer.timeout = 300000;
  httpServer.keepAliveTimeout = 120000;
  httpServer.headersTimeout = 310000;

  return httpServer;
}