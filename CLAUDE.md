# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Study-Hub Publication — educational publishing website. npm-workspaces monorepo with two packages: `client` (React 19 + Vite SPA) and `server` (Express + Mongoose, ESM). No tests or linter are configured.

## Commands

Run from repo root:

- `npm run dev` — starts server (nodemon, :5000) and client (Vite, :5173) concurrently
- `npm run dev --workspace server` / `--workspace client` — start one side only
- `npm run build` — Vite production build of client
- `npm start` — production server (`node src/index.js`)
- `npm run seed` — seed books from `server/src/data/seedBooks.js`
- `npm run seed:admin` — seed admin users
- `node server/src/scripts/testSmtp.js` — verify SMTP config

Server requires `server/.env` with: `PORT`, `MONGODB_URI`, `CLIENT_URL`, `ADMIN_URL`, `JWT_SECRET`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`. Startup fails hard if either the SMTP connection or MongoDB connection fails (see `server/src/index.js` `startServer`).

## Architecture

### One SPA, two surfaces

The client is a single React app containing both the public site and the admin panel. Public pages live in `client/src/pages/` with shared chrome in `client/src/components/PublicLayout.jsx`; the admin panel lives entirely under `client/src/admin/` (own pages, components, hooks, `styles.css`, and API client). Routing for both is in `client/src/routes/AppRoutes.jsx` — admin routes sit under `/admin` behind `ProtectedRoute`, which enforces a minimum role (panel-wide `subadmin`; `/admin/settings` requires `developer`).

`/` is a standalone, lazy-loaded landing page (`client/src/pages/LandingPage.jsx` + `landing.css`, all classes `lp-` prefixed) outside `PublicLayout`; the site homepage lives at `/home`. Internal "home" links must point to `/home`, not `/`.

### Book cover images

Books support multiple cover images: `images` (array) with legacy `image` kept mirrored to `images[0]`. Never read `book.image` directly in the client — use `getBookImages`/`getBookCover` from `client/src/utils/bookImages.js`. Server-side, all book API responses pass through `withImages` and admin create/update payloads through `normalizeBookImagesInput` (both in `server/src/utils/bookImages.js`), which parses newline/comma-separated URL input, dedupes, and drops invalid URLs. Old single-`image` documents work unchanged.

### Two API clients

- `client/src/services/api.js` — public, unauthenticated endpoints
- `client/src/admin/services/api.js` — admin endpoints; wraps `fetch` with a Bearer token from `localStorage` key `sh_token`, and on any 401 clears the token and hard-redirects to `/admin/login`

`VITE_API_BASE_URL` overrides the API base (defaults to `http://localhost:5000/api`).

### Server layering

Standard routes → controllers → Mongoose models. Public routes are mounted individually under `/api/*` (`books`, `announcements` — published only, `enquiries`, `contact`, `whatsapp-leads`, `notifications`, `settings`, `auth`). All admin routes are aggregated in `server/src/routes/admin/index.js`, mounted at `/api/admin`, with JWT `authenticate` middleware applied router-wide — individual admin routes only add role checks where needed. Admin controllers live in `server/src/controllers/admin/`, separate from public controllers that may share the same model (e.g. `bookController.js` exists in both).

### Roles and auth

Role hierarchy (rank order): `subadmin` < `superadmin` < `developer` — defined in `server/src/middleware/roleMiddleware.js` (`requireRole`, `canManageRole`, `preventSelfElevate`) and mirrored client-side in `ProtectedRoute`. JWTs are signed with a 7-day expiry in `authController.js`; the payload is `{ userId, role }`.

### Cross-cutting

- Public write/search endpoints are hardened: user input that reaches Mongo queries must go through `asString`/`escapeRegex` from `server/src/utils/sanitize.js` (bounds strings, blocks NoSQL operator injection, escapes `$regex` metacharacters), and public form/auth routes are rate-limited with `createRateLimiter` from `server/src/middleware/rateLimiter.js` (in-memory fixed-window per IP — per-process only).
- The public site holds an SSE connection to `/api/notifications/stream` (`client/src/services/notifications.js`, opened in `main.jsx`): `books-updated` events trigger live catalogue refresh, `new-book` events fire browser Notifications. Server side lives in `server/src/controllers/notificationController.js`, which also handles email subscriptions.
- Admin actions and auth events are recorded via the `ActivityLog` model (`server/src/utils/activityLogger.js`), surfaced in the admin Activity Logs page.
- Email goes through `server/src/utils/emailService.js` (nodemailer).
- Site-wide editable settings/content are stored in the `Settings` model and exposed publicly via `/api/settings`, consumed client-side through `SettingsContext`.
