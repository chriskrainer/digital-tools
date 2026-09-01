import type { Express, Request } from "express";
import QRCode from "qrcode";
import { createCanvas } from "canvas";
import { insertQRCodeSchema, updateQRCodeSchema } from "@shared/schema";
import type { DigitalToolsStorage } from "../digitalToolsStorage";

type QRCodeStorage = Pick<
  DigitalToolsStorage,
  | "getAllQRCodes"
  | "getQRCode"
  | "createQRCode"
  | "updateQRCode"
  | "deleteQRCode"
  | "incrementScanCount"
  | "createScan"
  | "getScanAnalytics"
>;

function getBaseUrl(req: Request): string {
  const host = req.get('x-forwarded-host') || req.get('host') || 'localhost';
  const proto = host.includes('replit') ? 'https' : (req.get('x-forwarded-proto') || req.protocol);
  return `${proto}://${host}`;
}

export function registerQRCodeRoutes(app: Express, storage: QRCodeStorage): void {
  app.get("/api/qrcodes", async (req, res) => {
    try {
      const qrcodes = await storage.getAllQRCodes();
      res.json(qrcodes);
    } catch (error) {
      console.error("Error fetching QR codes:", error);
      res.status(500).json({ error: "Failed to fetch QR codes" });
    }
  });

  app.get("/api/qrcodes/:id", async (req, res) => {
    try {
      const qrcode = await storage.getQRCode(req.params.id);
      if (!qrcode) {
        return res.status(404).json({ error: "QR code not found" });
      }
      res.json(qrcode);
    } catch (error) {
      console.error("Error fetching QR code:", error);
      res.status(500).json({ error: "Failed to fetch QR code" });
    }
  });

  app.post("/api/qrcodes", async (req, res) => {
    try {
      const validatedData = insertQRCodeSchema.parse(req.body);
      const qrcode = await storage.createQRCode(validatedData);
      res.status(201).json(qrcode);
    } catch (error) {
      console.error("Error creating QR code:", error);
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid input data" });
      }
      res.status(500).json({ error: "Failed to create QR code" });
    }
  });

  app.patch("/api/qrcodes/:id", async (req, res) => {
    try {
      const validatedData = updateQRCodeSchema.parse(req.body);
      const qrcode = await storage.updateQRCode(req.params.id, validatedData);
      if (!qrcode) {
        return res.status(404).json({ error: "QR code not found" });
      }
      res.json(qrcode);
    } catch (error) {
      console.error("Error updating QR code:", error);
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid input data" });
      }
      res.status(500).json({ error: "Failed to update QR code" });
    }
  });

  app.delete("/api/qrcodes/:id", async (req, res) => {
    try {
      const success = await storage.deleteQRCode(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "QR code not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting QR code:", error);
      res.status(500).json({ error: "Failed to delete QR code" });
    }
  });

  app.get("/api/qrcodes/:id/image", async (req, res) => {
    try {
      const qrcode = await storage.getQRCode(req.params.id);
      if (!qrcode) {
        return res.status(404).json({ error: "QR code not found" });
      }

      const redirectUrl = `${getBaseUrl(req)}/r/${qrcode.id}`;
      const dotStyle = qrcode.dotStyle || "square";
      const cornerStyle = qrcode.cornerStyle || "square";
      const foregroundColor = qrcode.foregroundColor || "#000000";
      const backgroundColor = qrcode.backgroundColor || "#ffffff";
      const qrSize = 512;
      const textHeight = 60;
      const margin = 20;
      const canvas = createCanvas(qrSize, qrSize + textHeight);
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, qrSize, qrSize + textHeight);

      const qrMatrix = await QRCode.create(redirectUrl, { errorCorrectionLevel: 'M' });
      const moduleCount = qrMatrix.modules.size;
      const moduleSize = (qrSize - margin * 2) / moduleCount;
      ctx.fillStyle = foregroundColor;

      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (qrMatrix.modules.get(row, col)) {
            const x = margin + col * moduleSize;
            const y = margin + row * moduleSize;
            const isFinderPattern =
              (row < 7 && col < 7) ||
              (row < 7 && col >= moduleCount - 7) ||
              (row >= moduleCount - 7 && col < 7);

            if (isFinderPattern) {
              if (cornerStyle === "dot" || cornerStyle === "extra-rounded") {
                ctx.beginPath();
                ctx.arc(x + moduleSize / 2, y + moduleSize / 2, moduleSize / 2, 0, Math.PI * 2);
                ctx.fill();
              } else {
                ctx.fillRect(x, y, moduleSize, moduleSize);
              }
            } else {
              switch (dotStyle) {
                case "dots":
                  ctx.beginPath();
                  ctx.arc(x + moduleSize / 2, y + moduleSize / 2, moduleSize * 0.4, 0, Math.PI * 2);
                  ctx.fill();
                  break;
                case "rounded": {
                  const radius = moduleSize * 0.3;
                  ctx.beginPath();
                  ctx.moveTo(x + radius, y);
                  ctx.lineTo(x + moduleSize - radius, y);
                  ctx.quadraticCurveTo(x + moduleSize, y, x + moduleSize, y + radius);
                  ctx.lineTo(x + moduleSize, y + moduleSize - radius);
                  ctx.quadraticCurveTo(x + moduleSize, y + moduleSize, x + moduleSize - radius, y + moduleSize);
                  ctx.lineTo(x + radius, y + moduleSize);
                  ctx.quadraticCurveTo(x, y + moduleSize, x, y + moduleSize - radius);
                  ctx.lineTo(x, y + radius);
                  ctx.quadraticCurveTo(x, y, x + radius, y);
                  ctx.fill();
                  break;
                }
                case "classy":
                case "classy-rounded":
                  ctx.beginPath();
                  ctx.arc(x + moduleSize / 2, y + moduleSize / 2, moduleSize / 2, 0, Math.PI * 2);
                  ctx.fill();
                  break;
                case "extra-rounded":
                  ctx.beginPath();
                  ctx.arc(x + moduleSize / 2, y + moduleSize / 2, moduleSize * 0.45, 0, Math.PI * 2);
                  ctx.fill();
                  break;
                default:
                  ctx.fillRect(x, y, moduleSize, moduleSize);
              }
            }
          }
        }
      }

      ctx.fillStyle = foregroundColor;
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`#${qrcode.qrNumber}`, qrSize / 2, qrSize + textHeight / 2);

      const finalImage = canvas.toDataURL();
      res.json({ image: finalImage });
    } catch (error) {
      console.error("Error generating QR code image:", error);
      res.status(500).json({ error: "Failed to generate QR code image" });
    }
  });

  app.get("/api/qrcodes/:id/analytics", async (req, res) => {
    try {
      let days = 30;
      if (req.query.days) {
        const parsedDays = parseInt(req.query.days as string);
        if (isNaN(parsedDays) || parsedDays < 1 || parsedDays > 365) {
          return res.status(400).json({ error: "Invalid days parameter. Must be between 1 and 365." });
        }
        days = parsedDays;
      }
      const analytics = await storage.getScanAnalytics(req.params.id, days);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching scan analytics:", error);
      res.status(500).json({ error: "Failed to fetch scan analytics" });
    }
  });

  app.get("/r/:id", async (req, res) => {
    try {
      const qrcode = await storage.getQRCode(req.params.id);
      if (!qrcode) {
        return res.status(404).send("QR code not found");
      }

      Promise.all([
        storage.createScan({ qrCodeId: req.params.id }),
        storage.incrementScanCount(req.params.id)
      ]).catch(err => {
        console.error("Error recording scan:", err);
      });

      res.redirect(qrcode.redirectUrl);
    } catch (error) {
      console.error("Error processing redirect:", error);
      res.status(500).send("Internal server error");
    }
  });
}