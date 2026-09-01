import { sql } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const qrCodes = pgTable("qr_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  qrNumber: serial("qr_number").notNull(),
  name: text("name").notNull(),
  redirectUrl: text("redirect_url").notNull(),
  description: text("description"),
  scanCount: integer("scan_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  dotStyle: text("dot_style").notNull().default("square"),
  cornerStyle: text("corner_style").notNull().default("square"),
  foregroundColor: text("foreground_color").notNull().default("#000000"),
  backgroundColor: text("background_color").notNull().default("#ffffff"),
});

export const scans = pgTable("scans", {
  id: serial("id").primaryKey(),
  qrCodeId: varchar("qr_code_id")
    .notNull()
    .references(() => qrCodes.id, { onDelete: "cascade" }),
  scannedAt: timestamp("scanned_at").notNull().defaultNow(),
});

export const insertQRCodeSchema = createInsertSchema(qrCodes).omit({
  id: true,
  qrNumber: true,
  scanCount: true,
  createdAt: true,
});

export const updateQRCodeSchema = insertQRCodeSchema.partial();

export const insertScanSchema = createInsertSchema(scans).omit({
  id: true,
  scannedAt: true,
});

export type InsertQRCode = z.infer<typeof insertQRCodeSchema>;
export type UpdateQRCode = z.infer<typeof updateQRCodeSchema>;
export type QRCode = typeof qrCodes.$inferSelect;
export type Scan = typeof scans.$inferSelect;
export type InsertScan = z.infer<typeof insertScanSchema>;

export const utmCampaigns = pgTable("utm_campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  shortCode: text("short_code").notNull().unique(),
  name: text("name").notNull(),
  baseUrl: text("base_url").notNull(),
  source: text("source").notNull(),
  medium: text("medium").notNull(),
  campaign: text("campaign").notNull(),
  term: text("term"),
  content: text("content"),
  fullUrl: text("full_url").notNull(),
  visitCount: integer("visit_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const utmVisits = pgTable("utm_visits", {
  id: serial("id").primaryKey(),
  utmCampaignId: varchar("utm_campaign_id")
    .notNull()
    .references(() => utmCampaigns.id, { onDelete: "cascade" }),
  visitedAt: timestamp("visited_at").notNull().defaultNow(),
});

export const insertUTMCampaignSchema = createInsertSchema(utmCampaigns)
  .omit({
    id: true,
    fullUrl: true,
    visitCount: true,
    createdAt: true,
  })
  .extend({
    shortCode: z
      .string()
      .min(3, "Short code must be at least 3 characters")
      .max(20, "Short code must be 20 characters or less")
      .regex(
        /^[a-zA-Z0-9-_]+$/,
        "Short code can only contain letters, numbers, hyphens, and underscores",
      )
      .transform((value) => value.toLowerCase()),
  });

export const updateUTMCampaignSchema = createInsertSchema(utmCampaigns)
  .omit({
    id: true,
    shortCode: true,
    fullUrl: true,
    visitCount: true,
    createdAt: true,
  })
  .partial();

export const insertUTMVisitSchema = createInsertSchema(utmVisits).omit({
  id: true,
  visitedAt: true,
});

export type InsertUTMCampaign = z.infer<typeof insertUTMCampaignSchema>;
export type UpdateUTMCampaign = z.infer<typeof updateUTMCampaignSchema>;
export type UTMCampaign = typeof utmCampaigns.$inferSelect;
export type UTMVisit = typeof utmVisits.$inferSelect;
export type InsertUTMVisit = z.infer<typeof insertUTMVisitSchema>;