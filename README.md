# Study-Hub Publication

Production-ready educational publishing website: React + Vite frontend, Node/Express + MongoDB backend, in an npm-workspaces monorepo (`client` + `server`).

## Features

- **Landing page** at `/` — standalone premium page (glass morphism, light theme, Framer Motion animations): hero with three admin-uploaded floating images, Featured Books (admin-picked via the "Featured" checkbox, centered layout), About with live stats (titles, unique authors, admin-entered Total Readers), and a "More" button into the main site at `/home`. Admin Login sits top-right in the landing navbar.
- **Main website** at `/home` — hero slider, book catalogue with search/categories, book details, contact, FAQ, about, media, seller information, and a public **Announcements** page (`/announcements`) showing published announcements from the admin panel (drafts stay hidden).
- **Multiple cover images per book** — books store an `images` array; the first image is the main cover (legacy `image` field stays mirrored for backward compatibility). Book details shows a Swiper slider when a book has more than one image.
- **Admin panel** at `/admin` — dashboard, books CRUD, inventory, announcements, enquiries, WhatsApp leads, activity logs, Landing Page controls (readers counter + hero image uploads), settings, admin user management with role hierarchy (`subadmin` < `superadmin` < `developer`).
- **Centralized branding** — the logo lives in one file (`client/public/logo.png`, also the favicon); swap it to rebrand the whole site. The tagline under the publication name comes from Admin → Settings.
- **Dynamic contact email** — the landing page Email buttons open the visitor's default mail client (`mailto:`) addressed to the publication email configured in Admin → Settings. Change the email in settings and every Email button updates automatically; buttons hide when no email is configured.
- **Live updates & new-book alerts** — the site keeps a Server-Sent Events connection open: the catalogue refreshes automatically when books change, and visitors who granted browser-notification permission get an alert when a new book is published. Visitors can also subscribe by email for release notifications.

## Run locally

1. Create `server/.env` (see [Environment variables](#environment-variables)).
2. Install dependencies (repo root): `npm install`
3. (Optional) Seed sample books: `npm run seed`
4. (Optional) Seed the first developer admin account: `npm run seed:admin`
5. Start frontend + backend together: `npm run dev`

Frontend: `http://localhost:5173` — Backend API: `http://localhost:5000`

Other commands:

- `npm run build` — production build of the client (output in `client/dist/`)
- `npm start` — production server
- `node server/src/scripts/testSmtp.js` — verify SMTP configuration

## Environment variables

### Server (`server/.env`)

| Variable | Required | Description |
| --- | --- | --- |
| `MONGODB_URI` | yes (production fails to start without it; dev falls back to local MongoDB) | MongoDB connection string (Atlas or local) |
| `JWT_SECRET` | yes in production | Secret for signing admin JWTs. The server refuses to start in production without it. |
| `PORT` | no (5000) | API port |
| `CLIENT_URL` | yes in production (server refuses to start without it); dev defaults to `http://localhost:5173` | Public site origin, used for CORS and email links |
| `ADMIN_URL` | no | Additional allowed CORS origin, only if the admin panel is hosted on a separate origin |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | yes | SMTP credentials for contact/subscriber emails. Server startup verifies the connection. |
| `ADMIN_EMAIL` | no | Recipient for contact-form notifications (falls back to `SMTP_USER`) |
| `NODE_ENV` | production only | Set to `production` on the host — enables HSTS and strict JWT secret enforcement |

Never commit `server/.env`. It is listed in `.gitignore`; if a copy was ever committed or shared, rotate the SMTP password and `JWT_SECRET`.

### Client (build-time)

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_BASE_URL` | yes in production (a missing value logs a clear console error and API requests fail) | Full API base, e.g. `https://api.example.com/api`. Dev-only default: `http://localhost:5000/api`. Centralized in `client/src/config.js` — the only place a URL fallback exists. |

## Admin usage

- Log in at `/admin/login`. First account: `npm run seed:admin` creates a developer user (change its password immediately via Admin → Users).
- **Books → Add/Edit**: required fields are Title, Author, Description, Category, Price, and at least one cover image URL; ISBN, Rating, and Stock are optional. Paste cover image URLs into the single textarea — one URL per line or comma-separated. Duplicates, blanks, and invalid URLs are removed automatically; the first URL becomes the main cover shown on cards and lists. The **Featured** checkbox (independent of Best Seller) controls which books appear in the landing page Featured Books section.
- **Landing Page**: enter the "Total Readers" figure shown in the landing page stats as free text (e.g. `1500+`, `1 Lakh+`); leave empty to hide the stat. Upload the three hero floating images (Image 1–3) — JPG, JPEG, PNG, or WEBP up to 10 MB; each upload is automatically converted to optimized WEBP and replaces the previous image for that slot. Available to every admin role.
- **Settings** (developer role): publication name, tagline, contact details, WhatsApp number, and social links (Facebook, Instagram, YouTube). Email and social buttons across the landing page and main site read these values live; leave a field empty to hide its button/icon. YouTube appears everywhere other social icons do except the top contact ribbon.

## Security notes

- Admin JWTs expire after 7 days; login is rate-limited (10 attempts / 15 min per IP).
- Public form endpoints (contact, enquiries, WhatsApp leads) are rate-limited and field-whitelisted.
- Search queries are regex-escaped server-side; JSON request bodies are capped at 200 kB (landing hero image uploads: multipart, 10 MB cap, image mimetypes only, admin JWT required).
- Baseline security headers are set on every API response (nosniff, frame deny, referrer policy; HSTS in production).

## Deployment

### MongoDB Atlas

1. Create a cluster and a database user (least-privilege, `readWrite` on the app database).
2. Network access: allow your host's outbound IPs (Render: add `0.0.0.0/0` or Render's IP ranges, since Render IPs vary).
3. Use the SRV connection string as `MONGODB_URI`.

### Render (or similar)

**Backend — Web Service**

- Root directory: `server` (or repo root with build/start commands below)
- Build: `npm install`
- Start: `npm start` (repo root) or `node src/index.js` (from `server/`)
- Environment: set every server variable above, including `NODE_ENV=production` and `CLIENT_URL=https://<your-domain>`
- Note: startup fails fast if MongoDB or SMTP is unreachable — check logs on first deploy.

**Frontend — Static Site**

- Build: `npm install && npm run build`
- Publish directory: `client/dist`
- Environment: `VITE_API_BASE_URL=https://<backend-host>/api`
- SPA rewrite rule required: `/*` → `/index.html` (the app uses client-side routing: `/`, `/home`, `/books/:id`, `/admin/...`).

### GoDaddy domain

1. In GoDaddy DNS, add a `CNAME` record for `www` pointing to your static-site host (e.g. `<site>.onrender.com`); for the apex/root domain use GoDaddy forwarding to `www`, or an `A`/`ALIAS` record per your host's instructions.
2. Add the custom domain in the hosting dashboard so TLS certificates are issued.
3. Update `CLIENT_URL` on the backend to the final `https://` domain (CORS depends on it).

### Cloudinary

No account or credentials required. Book images are external URLs pasted by the admin (any HTTPS image host works). When a pasted URL happens to be a Cloudinary delivery URL, the public site automatically rewrites it at render time into optimized variants — `c_limit` (fit, never crop/upscale), `q_auto`, `f_auto`, plus a responsive `srcset` (250–600px widths) so each device downloads only the size it needs. The URL stored in MongoDB is never changed; non-Cloudinary URLs render as-is. The only upload pipeline is the landing page hero images, which are converted to WEBP (sharp) and stored in MongoDB — deliberately DB-backed so they survive redeploys on hosts with ephemeral filesystems (e.g. Render).

## Architecture

See `CLAUDE.md` for a concise architecture overview (routing, API clients, role model, image conventions).
