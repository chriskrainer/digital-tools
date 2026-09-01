# Digital Tools

## Remix Safety Boundary

This workspace is the remixed **Digital Tools** project. Its retained applications are:

- QR Code Manager
- UTM Builder

The Digital Tool Center project from which this workspace was copied must remain untouched and operational.

Until resource isolation is explicitly verified:

- Do not push this workspace to the inherited Digital Tool Center Git remote.
- Do not publish over an existing Digital Tool Center deployment.
- Do not mutate or delete inherited database tables, records, Object Storage objects, or secrets as part of separation work.
- Do not connect this project to `explore.dematic.com` or `discover.dematic.com`.
- Preserve `/r/:id` and `/c/:shortCode` while retained code is separated.
- Use `npm run check:retained` for non-mutating baseline verification.

Database isolation was verified on September 1, 2026. The Digital Tools app uses this
remix's managed Replit PostgreSQL database, whose retained QR and UTM records were
fingerprint-matched to the inherited source before the local source-database override
was removed. Do not reconnect the inherited database or delete its tables or records.

## Overview
Digital Tools contains only the QR Code Manager and UTM Builder retained from the former unified Digital Tool Center.

**Key Capabilities:**
-   **QR Code Manager**: Generates dynamic, trackable QR codes with scan analytics.
-   **UTM Builder**: Creates and manages UTM-parameterized URLs for marketing campaign tracking with custom short codes and visit analytics.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
The platform uses React 18, TypeScript, Vite, and Wouter for routing. UI is built with Shadcn/ui (Radix UI primitives) and Tailwind CSS. It supports dark/light mode and features Inter and JetBrains Mono typography.

### Technical Implementations
The backend is Node.js with Express.js (TypeScript), providing REST APIs for QR codes, QR scans, UTM campaigns, and UTM visits. Security is handled with Helmet middleware. Zod validates API payloads, `qrcode` and `canvas` generate QR images, and short-code redirects record retained-tool analytics.

### System Design Choices
Data is stored in the remix's managed Replit PostgreSQL database and managed with Drizzle ORM. The active schema contains QR codes, QR scans, UTM campaigns, UTM visits, and hashed login-attempt throttling records. When `DTC_ACCESS_PASSWORD` is configured, server-signed HTTP-only sessions protect all QR and UTM management APIs while public redirect routes remain accessible. Failed login attempts are durably limited across deployment instances.

## External Dependencies

### Core Technologies
-   React, Express, Vite, TypeScript

### Database & ORM
-   `@neondatabase/serverless`, `drizzle-orm`, `drizzle-kit`

### UI Components & Styling
-   Retained `@radix-ui/*` primitives, Tailwind CSS, `lucide-react`

### State Management & Validation
-   `@tanstack/react-query`, `wouter`, `zod`

### Utilities & Libraries
-   `qrcode`, `canvas`, `recharts`, `nanoid`, `clsx`, `tailwind-merge`

## Repository Hygiene
The `attached_assets/` directory is ignored by default because it contains chat uploads and reference media. The four logo and instruction images imported by the retained app are intentionally force-tracked so a fresh clone can build successfully.