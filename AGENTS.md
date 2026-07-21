# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

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

Server requires `server/.env` with: `PORT`, `MONGODB_URI`, `CLIENT_URL`, `ADMIN_URL`, `JWT_SECRET`. Startup fails hard if the MongoDB connection fails (see `server/src/index.js` `startServer`).

## Architecture

### One SPA, two surfaces

The client is a single React app containing both the public site and the admin panel. Public pages live in `client/src/pages/` with shared chrome in `client/src/components/PublicLayout.jsx`; the admin panel lives entirely under `client/src/admin/` (own pages, components, hooks, `styles.css`, and API client). Routing for both is in `client/src/routes/AppRoutes.jsx` — admin routes sit under `/admin` behind `ProtectedRoute`, which enforces a minimum role (panel-wide `subadmin`; `/admin/settings` requires `developer`).

`/` is a standalone, lazy-loaded landing page (`client/src/pages/LandingPage.jsx` + `landing.css`, all classes `lp-` prefixed) outside `PublicLayout`; the site homepage lives at `/home`. Internal "home" links must point to `/home`, not `/`. The landing page is deliberately minimal: hero (three admin-uploaded floating images, see below) → Featured Books (only books with the `isFeatured` flag, centered flex layout) → About with stats (catalogue count, unique authors, admin-entered Total Readers) → a "More" button to `/home`.

### Branding

The logo is one asset: `client/public/logo.png`, rendered everywhere via `client/src/components/BrandLogo.jsx` (public navbar, landing nav, admin sidebar/login) and referenced directly as the favicon (`client/index.html`) and browser-notification icon. Replace that one file to rebrand. The company tagline comes from `settings.tagline` and renders under the publication name (`.brand-tagline` class); the admin panel hardcodes it (no SettingsContext there). The shared email block is `client/src/components/ContactEmail.jsx` (Contact Us + Write For Us; `chip` prop renders the pill variant).

### Book cover images

Books support multiple cover images: `images` (array) with legacy `image` kept mirrored to `images[0]`. Never read `book.image` directly in the client — use `getBookImages`/`getBookCover` from `client/src/utils/bookImages.js`. Server-side, all book API responses pass through `withImages` and admin create/update payloads through `normalizeBookImagesInput` (both in `server/src/utils/bookImages.js`), which parses newline/comma-separated URL input, dedupes, and drops invalid URLs. Old single-`image` documents work unchanged.

**Public cover rendering** (admin panel deliberately excluded — it shows raw stored URLs): render covers by spreading `getCoverImageProps(url, sizes?)` from `client/src/utils/bookImages.js` into the `<img>`. For Cloudinary-hosted URLs it returns `src` + responsive `srcSet` (250/350/400/600w variants, `c_limit,q_auto,f_auto` — fit, never crop, never upscale) + a `sizes` string defaulting to the card grid's real widths; any other host passes through as plain `{ src }`. The stored URL is never modified — transformation happens only at render time (`optimizeCloudinaryUrl`). Card image containers are a fixed 2:3 `aspect-ratio` (`.book-cover-wrap` in `styles.css`; landing uses `.lp-book-cover` at 3:4): landscape images fill via `object-fit: cover` center-crop, while portrait images are flagged at load by the shared `onLoad={markPortraitImage}` handler (adds `.cover-portrait`) and switch to `object-fit: contain` so the full cover always shows. All four public render sites use this trio: `BookCard.jsx` (home sections + Books page), `LandingPage.jsx`, `BookDetailsPage.jsx` (own `sizes` for its 340px column).

Author names on public pages render inside the `.author-chip` pill (`styles.css`); wrap the name in a `<span className="author-chip">` inside the existing text element (chip inherits font size from context) and skip rendering entirely when `book.author` is empty — null-author books exist.

### Book model specifics

- Required fields: `title`, `author`, `description`, `category`, `image`, `price`. `isbn` and `rating` are optional (`rating` defaults to 0).
- `isbn` has a **sparse** unique index; empty-string ISBNs must never be stored — the admin book controller deletes an empty `isbn` on create and `$unset`s it on update.
- `bookId` is an internal auto-increment number assigned by a `pre("save")` hook using the `Counter` model (`server/src/models/Counter.js`). It is stripped from every API response by `withImages` — never expose or display it. Bulk inserts skip save hooks, which is why `seed.js` uses `Book.create()`, not `insertMany()`.
- `isFeatured` (boolean) is the admin-controlled "Featured" flag, independent of `isBestSeller`; it alone decides what appears in the landing page Featured Books section.

### Two API clients

- `client/src/services/api.js` — public, unauthenticated endpoints
- `client/src/admin/services/api.js` — admin endpoints; wraps `fetch` with a Bearer token from `localStorage` key `sh_token`, and on any 401 clears the token and hard-redirects to `/admin/login`

The API base URL is centralized in `client/src/config.js` (exports `API_BASE_URL`): `VITE_API_BASE_URL` when set, otherwise a dev-only localhost fallback (production logs a console error if unset). All client code — both API clients, `AuthContext`, SSE notifications, WhatsApp lead beacon — imports from there; never hardcode an API URL.

### Server layering

Standard routes → controllers → Mongoose models. Public routes are mounted individually under `/api/*` (`books`, `announcements` — published only, `sellers`, `whatsapp-leads`, `notifications`, `settings`, `auth`). All admin routes are aggregated in `server/src/routes/admin/index.js`, mounted at `/api/admin`, with JWT `authenticate` middleware applied router-wide — individual admin routes only add role checks where needed. Admin controllers live in `server/src/controllers/admin/`, separate from public controllers that may share the same model (e.g. `bookController.js` exists in both).

### Roles and auth

Role hierarchy (rank order): `subadmin` < `superadmin` < `developer` — defined in `server/src/middleware/roleMiddleware.js` (`requireRole`, `canManageRole`, `preventSelfElevate`) and mirrored client-side in `ProtectedRoute`. JWTs are signed with a 7-day expiry in `authController.js`; the payload is `{ userId, role }`.

### Cross-cutting

- Public write/search endpoints are hardened: user input that reaches Mongo queries must go through `asString`/`escapeRegex` from `server/src/utils/sanitize.js` (bounds strings, blocks NoSQL operator injection, escapes `$regex` metacharacters), and public form/auth routes are rate-limited with `createRateLimiter` from `server/src/middleware/rateLimiter.js` (in-memory fixed-window per IP — per-process only).
- The public site holds an SSE connection to `/api/notifications/stream` (`client/src/services/notifications.js`, opened in `main.jsx`): `books-updated` events trigger live catalogue refresh, `new-book` events fire browser Notifications. Server side lives in `server/src/controllers/notificationController.js`, which also handles email subscriptions.
- Admin actions and auth events are recorded via the `ActivityLog` model (`server/src/utils/activityLogger.js`), surfaced in the admin Activity Logs page.
- Seller information is fully dynamic: the `Seller` model stores a GeoJSON `location` point with a 2dsphere index; `GET /api/sellers?lat=&lng=` (and the admin equivalent) orders results by `$geoNear` proximity via shared helpers in `server/src/utils/sellers.js` (payload validation lives there too). Client-side, geocoding/autocomplete goes through Nominatim (`client/src/utils/geocode.js` + `client/src/components/LocationAutocomplete.jsx`, shared by the public Seller Information page and the admin Sellers page) — searches are debounced 450ms to respect Nominatim's 1 req/s policy.
- Site-wide editable settings/content are stored in the `Settings` model (one blob under `key: "publication"`) and exposed publicly via `/api/settings`, consumed client-side through `SettingsContext`. Keys: `publicationName`, `tagline`, `address`, `phone`, `email`, `facebook`, `instagram`, `youtube`, `whatsappNumber`, `readers`. Adding a key means touching four default objects: both server settings controllers, `SettingsContext.jsx`, and the admin Settings form. GET responses merge stored values over defaults; `updateSettings` merges the whitelisted body over the stored blob (so keys saved elsewhere survive).
- `readers` (the landing page "Total Readers" figure, a free-form string like "1 Lakh+") is edited on the admin **Landing Page** page (file still `client/src/admin/pages/Readers.jsx`, route still `/admin/readers`) via `PUT /api/admin/readers` — open to any authenticated admin, while `PUT /api/admin/settings` stays developer-only.
- **Landing hero images** are admin-uploaded, one per slot (1–3), from the same admin Landing Page page. Server: `LandingImage` model stores the optimized WEBP **binary in MongoDB** (deliberate — survives ephemeral-filesystem redeploys; an upsert per slot means old bytes are discarded atomically, never accumulated). Upload via `PUT /api/admin/landing-images/:slot` (multipart field `image`; multer memory storage, 10 MB cap, JPG/JPEG/PNG/WEBP only; sharp converts to WEBP q80, max width 1200 — originals are never stored). Public: `GET /api/landing-images` returns `[{slot, updatedAt}]`, `GET /api/landing-images/:slot` serves the binary with a day-long cache; clients append `?v=<updatedAt>` to bust caches on replacement. There are no static hero assets — `client/src/assets/landing/` was removed; `HeroFloatingBooks` in `LandingPage.jsx` fetches the list at runtime. The admin API `request` wrapper skips the JSON `Content-Type` header for `FormData` bodies.
- **Scroll positioning** is owned by the app, not the browser: an inline script in `client/index.html` sets `history.scrollRestoration = "manual"` — it must stay in the HTML `<head>` (not the JS bundle) because mobile Chrome/Safari perform deferred scroll restoration that can fire before the bundle loads and re-apply a stale offset after render. `client/src/components/ScrollToTop.jsx` (mounted above `<Routes>` in `main.jsx`) then scrolls every route change to the top in a pre-paint `useLayoutEffect`, or to the `location.hash` target element when one exists. Every route — public, landing, admin — scrolls the window (no inner scroll containers); don't reintroduce the `scrollRestoration` assignment into a module side effect or add other `scrollTo`/`focus`-on-mount calls.
- Social icons (Facebook, Instagram, YouTube, WhatsApp, email) render conditionally wherever configured — footer strip, home Quick Contact banner, landing nav/footer. Exception: the top brown contact ribbon (`TopBar.jsx`) shows only phone + WhatsApp; do not add other socials there.
