# Study-Hub Publication

Production-ready educational publishing website: React + Vite frontend, Node/Express + MongoDB backend, in an npm-workspaces monorepo (`client` + `server`).

## Features

- **Landing page** at `/` — standalone premium page (glass morphism, light theme, Framer Motion animations). "Explore" leads into the main site at `/home`. Admin Login sits top-right in the landing navbar.
- **Main website** at `/home` — hero slider, book catalogue with search/categories, book details, contact, FAQ, about, media, seller information, and a public **Announcements** page (`/announcements`) showing published announcements from the admin panel (drafts stay hidden).
- **Multiple cover images per book** — books store an `images` array; the first image is the main cover (legacy `image` field stays mirrored for backward compatibility). Book details shows a Swiper slider when a book has more than one image.
- **Admin panel** at `/admin` — dashboard, books CRUD, inventory, announcements, enquiries, WhatsApp leads, activity logs, settings, admin user management with role hierarchy (`subadmin` < `superadmin` < `developer`).
- **Dynamic contact email** — the landing page Email buttons open the visitor's default mail client (`mailto:`) addressed to the publication email configured in Admin → Settings. Change the email in settings and every Email button updates automatically; buttons hide when no email is configured.

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
| `MONGODB_URI` | yes | MongoDB connection string (Atlas or local) |
| `JWT_SECRET` | yes in production | Secret for signing admin JWTs. The server refuses to start in production without it. |
| `PORT` | no (5000) | API port |
| `CLIENT_URL` | no | Public site origin, used for CORS and email links |
| `ADMIN_URL` | no | Additional allowed CORS origin |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | yes | SMTP credentials for contact/subscriber emails. Server startup verifies the connection. |
| `ADMIN_EMAIL` | no | Recipient for contact-form notifications (falls back to `SMTP_USER`) |
| `NODE_ENV` | production only | Set to `production` on the host — enables HSTS and strict JWT secret enforcement |

Never commit `server/.env`. It is listed in `.gitignore`; if a copy was ever committed or shared, rotate the SMTP password and `JWT_SECRET`.

### Client (build-time)

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_BASE_URL` | production | Full API base, e.g. `https://api.example.com/api`. Defaults to `http://localhost:5000/api`. |

## Admin usage

- Log in at `/admin/login`. First account: `npm run seed:admin` creates a developer user (change its password immediately via Admin → Users).
- **Books → Add/Edit**: paste cover image URLs into the single textarea — one URL per line or comma-separated. Duplicates, blanks, and invalid URLs are removed automatically; the first URL becomes the main cover shown on cards and lists.
- **Settings** (developer role): publication name, tagline, contact details, WhatsApp number, and social links (Facebook, Instagram). Email and social buttons across the landing page and main site read these values live; leave a field empty to hide its button/icon.

## Security notes

- Admin JWTs expire after 7 days; login is rate-limited (10 attempts / 15 min per IP).
- Public form endpoints (contact, enquiries, WhatsApp leads) are rate-limited and field-whitelisted.
- Search queries are regex-escaped server-side; request bodies are capped at 200 kB.
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

Not used. Book images are external URLs pasted by the admin (any HTTPS image host works, including Cloudinary URLs) — no upload pipeline or Cloudinary credentials exist in this project.

## Architecture

See `CLAUDE.md` for a concise architecture overview (routing, API clients, role model, image conventions).
