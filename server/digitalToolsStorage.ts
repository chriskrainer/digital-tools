import type {
  InsertQRCode,
  InsertScan,
  InsertUTMCampaign,
  InsertUTMVisit,
  QRCode,
  Scan,
  UTMCampaign,
  UTMVisit,
  UpdateQRCode,
  UpdateUTMCampaign,
} from "@shared/schema";
import { QRCodeRepository } from "./repositories/qrCodeRepository";
import { UTMCampaignRepository } from "./repositories/utmCampaignRepository";

export interface DigitalToolsStorage {
  getAllQRCodes(): Promise<QRCode[]>;
  getQRCode(id: string): Promise<QRCode | undefined>;
  createQRCode(qrCode: InsertQRCode): Promise<QRCode>;
  updateQRCode(id: string, qrCode: UpdateQRCode): Promise<QRCode | undefined>;
  deleteQRCode(id: string): Promise<boolean>;
  incrementScanCount(id: string): Promise<void>;
  createScan(scan: InsertScan): Promise<Scan>;
  getScanAnalytics(qrCodeId: string, days?: number): Promise<{ date: string; count: number }[]>;

  getAllUTMCampaigns(): Promise<UTMCampaign[]>;
  getUTMCampaign(id: string): Promise<UTMCampaign | undefined>;
  getUTMCampaignByShortCode(shortCode: string): Promise<UTMCampaign | undefined>;
  createUTMCampaign(campaign: InsertUTMCampaign): Promise<UTMCampaign>;
  updateUTMCampaign(id: string, campaign: UpdateUTMCampaign): Promise<UTMCampaign | undefined>;
  deleteUTMCampaign(id: string): Promise<boolean>;
  incrementVisitCount(id: string): Promise<void>;
  createUTMVisit(visit: InsertUTMVisit): Promise<UTMVisit>;
  getUTMVisitAnalytics(campaignId: string, days?: number): Promise<{ date: string; count: number }[]>;
}

class DatabaseDigitalToolsStorage implements DigitalToolsStorage {
  private readonly qrCodes = new QRCodeRepository();
  private readonly utmCampaigns = new UTMCampaignRepository();

  getAllQRCodes() {
    return this.qrCodes.getAll();
  }

  getQRCode(id: string) {
    return this.qrCodes.getById(id);
  }

  createQRCode(qrCode: InsertQRCode) {
    return this.qrCodes.create(qrCode);
  }

  updateQRCode(id: string, qrCode: UpdateQRCode) {
    return this.qrCodes.update(id, qrCode);
  }

  deleteQRCode(id: string) {
    return this.qrCodes.delete(id);
  }

  incrementScanCount(id: string) {
    return this.qrCodes.incrementScanCount(id);
  }

  createScan(scan: InsertScan) {
    return this.qrCodes.createScan(scan);
  }

  getScanAnalytics(qrCodeId: string, days?: number) {
    return this.qrCodes.getScanAnalytics(qrCodeId, days);
  }

  getAllUTMCampaigns() {
    return this.utmCampaigns.getAll();
  }

  getUTMCampaign(id: string) {
    return this.utmCampaigns.getById(id);
  }

  getUTMCampaignByShortCode(shortCode: string) {
    return this.utmCampaigns.getByShortCode(shortCode);
  }

  createUTMCampaign(campaign: InsertUTMCampaign) {
    return this.utmCampaigns.create(campaign);
  }

  updateUTMCampaign(id: string, campaign: UpdateUTMCampaign) {
    return this.utmCampaigns.update(id, campaign);
  }

  deleteUTMCampaign(id: string) {
    return this.utmCampaigns.delete(id);
  }

  incrementVisitCount(id: string) {
    return this.utmCampaigns.incrementVisitCount(id);
  }

  createUTMVisit(visit: InsertUTMVisit) {
    return this.utmCampaigns.createVisit(visit);
  }

  getUTMVisitAnalytics(campaignId: string, days?: number) {
    return this.utmCampaigns.getVisitAnalytics(campaignId, days);
  }
}

export const digitalToolsStorage: DigitalToolsStorage = new DatabaseDigitalToolsStorage();