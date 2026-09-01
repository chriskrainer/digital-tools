import type { Express } from "express";
import { createServer, type Server } from "http";
import { registerAuthRoutes, requireAuthenticatedSession } from "./auth";
import { digitalToolsStorage } from "./digitalToolsStorage";
import { registerQRCodeRoutes } from "./routes/qrCodeRoutes";
import { registerUTMCampaignRoutes } from "./routes/utmCampaignRoutes";

export async function registerRoutes(app: Express): Promise<Server> {
  registerAuthRoutes(app);

  app.use("/api/qrcodes", requireAuthenticatedSession);
  app.use("/api/utm-campaigns", requireAuthenticatedSession);
  registerQRCodeRoutes(app, digitalToolsStorage);
  registerUTMCampaignRoutes(app, digitalToolsStorage);

  const httpServer = createServer(app);
  httpServer.timeout = 300000;
  httpServer.keepAliveTimeout = 120000;
  httpServer.headersTimeout = 310000;

  return httpServer;
}