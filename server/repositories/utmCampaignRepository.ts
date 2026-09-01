import {
  utmCampaigns,
  utmVisits,
  type InsertUTMCampaign,
  type InsertUTMVisit,
  type UTMCampaign,
  type UTMVisit,
  type UpdateUTMCampaign,
} from "@shared/schema";
import { and, count, desc, eq, gte, sql } from "drizzle-orm";
import { db } from "../db";

export class UTMCampaignRepository {
  async getAll(): Promise<UTMCampaign[]> {
    return db.select().from(utmCampaigns).orderBy(utmCampaigns.createdAt);
  }

  async getById(id: string): Promise<UTMCampaign | undefined> {
    const [campaign] = await db.select().from(utmCampaigns).where(eq(utmCampaigns.id, id));
    return campaign || undefined;
  }

  async getByShortCode(shortCode: string): Promise<UTMCampaign | undefined> {
    const [campaign] = await db.select().from(utmCampaigns).where(eq(utmCampaigns.shortCode, shortCode));
    return campaign || undefined;
  }

  async create(insertCampaign: InsertUTMCampaign): Promise<UTMCampaign> {
    const params = new URLSearchParams();
    params.append('utm_source', insertCampaign.source);
    params.append('utm_medium', insertCampaign.medium);
    params.append('utm_campaign', insertCampaign.campaign);
    if (insertCampaign.term) params.append('utm_term', insertCampaign.term);
    if (insertCampaign.content) params.append('utm_content', insertCampaign.content);

    const fullUrl = `${insertCampaign.baseUrl}?${params.toString()}`;

    const [campaign] = await db
      .insert(utmCampaigns)
      .values({ ...insertCampaign, fullUrl })
      .returning();
    return campaign;
  }

  async update(id: string, updateCampaign: UpdateUTMCampaign): Promise<UTMCampaign | undefined> {
    const existing = await this.getById(id);
    if (!existing) return undefined;

    const merged = { ...existing, ...updateCampaign };
    const params = new URLSearchParams();
    params.append('utm_source', merged.source);
    params.append('utm_medium', merged.medium);
    params.append('utm_campaign', merged.campaign);
    if (merged.term) params.append('utm_term', merged.term);
    if (merged.content) params.append('utm_content', merged.content);

    const fullUrl = `${merged.baseUrl}?${params.toString()}`;

    const [campaign] = await db
      .update(utmCampaigns)
      .set({ ...updateCampaign, fullUrl })
      .where(eq(utmCampaigns.id, id))
      .returning();
    return campaign || undefined;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(utmCampaigns)
      .where(eq(utmCampaigns.id, id))
      .returning();
    return result.length > 0;
  }

  async incrementVisitCount(id: string): Promise<void> {
    await db
      .update(utmCampaigns)
      .set({ visitCount: sql`${utmCampaigns.visitCount} + 1` })
      .where(eq(utmCampaigns.id, id));
  }

  async createVisit(insertVisit: InsertUTMVisit): Promise<UTMVisit> {
    const [visit] = await db
      .insert(utmVisits)
      .values(insertVisit)
      .returning();
    return visit;
  }

  async getVisits(campaignId: string, fromDate?: Date): Promise<UTMVisit[]> {
    if (fromDate) {
      return db
        .select()
        .from(utmVisits)
        .where(and(eq(utmVisits.utmCampaignId, campaignId), gte(utmVisits.visitedAt, fromDate)))
        .orderBy(desc(utmVisits.visitedAt));
    }
    return db
      .select()
      .from(utmVisits)
      .where(eq(utmVisits.utmCampaignId, campaignId))
      .orderBy(desc(utmVisits.visitedAt));
  }

  async getVisitAnalytics(campaignId: string, days: number = 30): Promise<{ date: string; count: number }[]> {
    const safeDays = !isNaN(days) && days > 0 && days <= 365 ? days : 30;

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - safeDays);

    const visitData = await db
      .select({
        date: sql<string>`DATE(${utmVisits.visitedAt})`,
        count: count(),
      })
      .from(utmVisits)
      .where(and(eq(utmVisits.utmCampaignId, campaignId), gte(utmVisits.visitedAt, fromDate)))
      .groupBy(sql`DATE(${utmVisits.visitedAt})`)
      .orderBy(sql`DATE(${utmVisits.visitedAt})`);

    return visitData.map(row => ({
      date: row.date,
      count: Number(row.count),
    }));
  }
}