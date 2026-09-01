import type { Express } from "express";
import { insertUTMCampaignSchema, updateUTMCampaignSchema } from "@shared/schema";
import type { DigitalToolsStorage } from "../digitalToolsStorage";

type UTMStorage = Pick<
  DigitalToolsStorage,
  | "getAllUTMCampaigns"
  | "getUTMCampaign"
  | "getUTMCampaignByShortCode"
  | "createUTMCampaign"
  | "updateUTMCampaign"
  | "deleteUTMCampaign"
  | "incrementVisitCount"
  | "createUTMVisit"
  | "getUTMVisitAnalytics"
>;

export function registerUTMCampaignRoutes(app: Express, storage: UTMStorage): void {
  app.get("/api/utm-campaigns", async (req, res) => {
    try {
      const campaigns = await storage.getAllUTMCampaigns();
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching UTM campaigns:", error);
      res.status(500).json({ error: "Failed to fetch UTM campaigns" });
    }
  });

  app.get("/api/utm-campaigns/:id", async (req, res) => {
    try {
      const campaign = await storage.getUTMCampaign(req.params.id);
      if (!campaign) {
        return res.status(404).json({ error: "UTM campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      console.error("Error fetching UTM campaign:", error);
      res.status(500).json({ error: "Failed to fetch UTM campaign" });
    }
  });

  app.post("/api/utm-campaigns", async (req, res) => {
    try {
      const validatedData = insertUTMCampaignSchema.parse(req.body);
      const campaign = await storage.createUTMCampaign(validatedData);
      res.status(201).json(campaign);
    } catch (error) {
      console.error("Error creating UTM campaign:", error);
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid input data" });
      }
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorCode = (error as any)?.code;
      if (
        (errorMessage.includes('duplicate key value') && errorMessage.includes('short_code')) ||
        (errorMessage.includes('UNIQUE constraint failed') && errorMessage.includes('short_code')) ||
        (errorCode === 'SQLITE_CONSTRAINT' && errorMessage.includes('short_code'))
      ) {
        return res.status(409).json({ error: "A campaign with this short code already exists. Please choose a different short code." });
      }
      res.status(500).json({ error: "Failed to create UTM campaign" });
    }
  });

  app.patch("/api/utm-campaigns/:id", async (req, res) => {
    try {
      const validatedData = updateUTMCampaignSchema.parse(req.body);
      const campaign = await storage.updateUTMCampaign(req.params.id, validatedData);
      if (!campaign) {
        return res.status(404).json({ error: "UTM campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      console.error("Error updating UTM campaign:", error);
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid input data" });
      }
      res.status(500).json({ error: "Failed to update UTM campaign" });
    }
  });

  app.delete("/api/utm-campaigns/:id", async (req, res) => {
    try {
      const success = await storage.deleteUTMCampaign(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "UTM campaign not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting UTM campaign:", error);
      res.status(500).json({ error: "Failed to delete UTM campaign" });
    }
  });

  app.get("/api/utm-campaigns/:id/analytics", async (req, res) => {
    try {
      let days = 30;
      if (req.query.days) {
        const parsedDays = parseInt(req.query.days as string);
        if (isNaN(parsedDays) || parsedDays < 1 || parsedDays > 365) {
          return res.status(400).json({ error: "Invalid days parameter. Must be between 1 and 365." });
        }
        days = parsedDays;
      }
      const analytics = await storage.getUTMVisitAnalytics(req.params.id, days);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching visit analytics:", error);
      res.status(500).json({ error: "Failed to fetch visit analytics" });
    }
  });

  app.get("/c/:shortCode", async (req, res) => {
    try {
      const campaign = await storage.getUTMCampaignByShortCode(req.params.shortCode);
      if (!campaign) {
        return res.status(404).send("UTM campaign not found");
      }

      Promise.all([
        storage.createUTMVisit({ utmCampaignId: campaign.id }),
        storage.incrementVisitCount(campaign.id)
      ]).catch(err => {
        console.error("Error recording visit:", err);
      });

      res.redirect(campaign.fullUrl);
    } catch (error) {
      console.error("Error processing UTM redirect:", error);
      res.status(500).send("Internal server error");
    }
  });
}