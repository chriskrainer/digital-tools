import {
  qrCodes,
  scans,
  type InsertQRCode,
  type InsertScan,
  type QRCode,
  type Scan,
  type UpdateQRCode,
} from "@shared/schema";
import { and, count, desc, eq, gte, sql } from "drizzle-orm";
import { db } from "../db";

export class QRCodeRepository {
  async getAll(): Promise<QRCode[]> {
    return db.select().from(qrCodes).orderBy(qrCodes.createdAt);
  }

  async getById(id: string): Promise<QRCode | undefined> {
    const [qrCode] = await db.select().from(qrCodes).where(eq(qrCodes.id, id));
    return qrCode || undefined;
  }

  async getByName(name: string): Promise<QRCode | undefined> {
    const [qrCode] = await db.select().from(qrCodes).where(eq(qrCodes.name, name));
    return qrCode || undefined;
  }

  async create(insertQRCode: InsertQRCode): Promise<QRCode> {
    const [qrCode] = await db
      .insert(qrCodes)
      .values(insertQRCode)
      .returning();
    return qrCode;
  }

  async update(id: string, updateQRCode: UpdateQRCode): Promise<QRCode | undefined> {
    const [qrCode] = await db
      .update(qrCodes)
      .set(updateQRCode)
      .where(eq(qrCodes.id, id))
      .returning();
    return qrCode || undefined;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(qrCodes)
      .where(eq(qrCodes.id, id))
      .returning();
    return result.length > 0;
  }

  async incrementScanCount(id: string): Promise<void> {
    await db
      .update(qrCodes)
      .set({ scanCount: sql`${qrCodes.scanCount} + 1` })
      .where(eq(qrCodes.id, id));
  }

  async createScan(insertScan: InsertScan): Promise<Scan> {
    const [scan] = await db
      .insert(scans)
      .values(insertScan)
      .returning();
    return scan;
  }

  async getScans(qrCodeId: string, fromDate?: Date): Promise<Scan[]> {
    if (fromDate) {
      return db
        .select()
        .from(scans)
        .where(and(eq(scans.qrCodeId, qrCodeId), gte(scans.scannedAt, fromDate)))
        .orderBy(desc(scans.scannedAt));
    }
    return db
      .select()
      .from(scans)
      .where(eq(scans.qrCodeId, qrCodeId))
      .orderBy(desc(scans.scannedAt));
  }

  async getScanAnalytics(qrCodeId: string, days: number = 30): Promise<{ date: string; count: number }[]> {
    const safeDays = !isNaN(days) && days > 0 && days <= 365 ? days : 30;

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - safeDays);

    const scanData = await db
      .select({
        date: sql<string>`DATE(${scans.scannedAt})`,
        count: count(),
      })
      .from(scans)
      .where(and(eq(scans.qrCodeId, qrCodeId), gte(scans.scannedAt, fromDate)))
      .groupBy(sql`DATE(${scans.scannedAt})`)
      .orderBy(sql`DATE(${scans.scannedAt})`);

    return scanData.map(row => ({
      date: row.date,
      count: Number(row.count),
    }));
  }
}