# WebMitra.Tech MERN Monorepo

Production-ready MERN monorepo for **WebMitra.Tech**:
- Public website (`/`, `/services`, `/projects`, `/about`, `/team`, `/pricing`, `/contact`, `/privacy`)
- Admin CMS (`/admin/*`) with role-based auth (`ADMIN`, `EDITOR`)
- Express + MongoDB API with validation, security middleware, audit logs, and rate limits

## Stack

### Backend (`server`)
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT access + refresh auth
- `httpOnly` refresh cookies + CSRF token protection
- Zod validation
- Helmet, CORS, sanitize, XSS clean, rate limiting
- Resend transactional email API
- Cloudinary upload with local fallback

### Frontend (`web`)
- React + TypeScript + Vite
- Tailwind + shadcn-style UI
- React Router
- React Hook Form + Zod
- TanStack Query
- Sonner toast notifications

## Project Structure

- `server`: API, models, controllers, routes, seed
- `web`: public site + admin panel
- `.env.example`: optional root convenience variables
- `server/.env.example`: backend environment template
- `web/.env.example`: frontend environment template

## 1. Local Setup

```bash
npm install
```

Copy env templates:

```bash
copy .env.example .env
copy server\.env.example server\.env
copy web\.env.example web\.env
```

## 2. What To Put In Env (Step-by-step)

### `server/.env` (required first)

1. `MONGO_URI`
Where to get:
- MongoDB Atlas -> Database -> Connect -> Drivers -> connection string

2. `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
Where to get:
- Generate strong random secrets (minimum 16 chars, recommended 48+)

3. `CLIENT_ORIGIN`
Where to get:
- Your web app URL (local: `http://localhost:5173`, production: `https://webmitra.tech`)

4. `ADMIN_SEED_EMAIL`, `ADMIN_SEED_PASSWORD`
Where to get:
- Your chosen admin login credentials

5. `RESEND_API_KEY`, `MAIL_FROM`, `MAIL_TO` (recommended)
Where to get:
- Resend dashboard -> API Keys

6. `CLOUDINARY_*` (recommended for production uploads)
Where to get:
- Cloudinary dashboard -> API Environment Variables

7. Optional cookie/domain values
- `COOKIE_DOMAIN` only when using subdomain cookie sharing

### `web/.env` (required)

1. `VITE_API_BASE_URL`
Value:
- Local: `http://localhost:5000/api`
- Production: `https://api.your-domain.com/api` (or your deployed API URL)

2. `VITE_WHATSAPP_NUMBER`
Value:
- Your company WhatsApp number without `+`

## 3. Seed Data + Admin Login

Run seed once:

```bash
npm run seed
```

Seed creates:
- Site settings
- Services
- Projects
- Team + board
- Collaborations
- Pricing (Silver/Gold/Diamond)
- Testimonials
- Admin user from `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD`

Run app:

```bash
npm run dev
```

- Web: `http://localhost:5173`
- API: `http://localhost:5000/api`
- Admin login: `/admin/login`

## 4. Where To Add Business Data (CMS Flow)

After login to admin:

1. `Admin -> Settings`
- Company profile, phone/email/address, socials, logo, homepage banner

2. `Admin -> Services`
- Add/edit service content, icon, order, featured, SEO metadata

3. `Admin -> Projects`
- Add/edit projects, thumbnails/gallery, links, tags, SEO metadata

4. `Admin -> Team` and `Admin -> Board`
- Member details, photos, socials, portfolio URLs

5. `Admin -> Collaborations`
- Partner logos and links

6. `Admin -> Pricing`
- Silver/Gold/Diamond plans and CTA links

7. `Admin -> Testimonials`
- Manage submitted testimonials (public can now submit feedback without login)

8. `Admin -> Inquiries`
- Review contact submissions and update status

### Image Upload Editor (Admin)

- All admin image upload fields now open an editor before upload.
- You can crop, zoom, rotate, choose aspect ratio, then upload.
- You can also click `Edit current` to re-edit an already uploaded image URL (if image source allows fetch/CORS).
- Logo uploads automatically apply background removal flow.

## 5. Production Go-live Checklist

1. Set `NODE_ENV=production` in `server/.env`
2. Deploy MongoDB (Atlas)
3. Deploy API and set all server env values
4. Run server build/start:
   - `npm run build -w server`
   - `npm run start -w server`
5. Deploy web app and set:
   - `VITE_API_BASE_URL` to deployed API base URL
6. Update server `CLIENT_ORIGIN` to your final web domain
7. Use HTTPS for both web and API
8. Configure Resend and send a test inquiry
9. Configure Cloudinary and test image upload in admin
10. Run final checks:
   - `npm run lint`
   - `npm run build`
   - test admin login
   - test public contact/testimonial forms

## 6. Security Notes

- Access token: sent in `Authorization` header
- Refresh token: secure `httpOnly` cookie
- CSRF: double-submit token on protected write routes
- Login/contact/testimonial submission endpoints: rate limited
- Failed attempts: logged in `FailedAttempt` collection

## 7. Code Quality / Unused Code Policy

- TypeScript now enforces:
  - `noUnusedLocals: true`
  - `noUnusedParameters: true`
- This prevents shipping unused variables/parameters in future commits.

## 8. Build Commands

```bash
npm run lint
npm run build
```

## Default Company Seed Values

- Company: WebMitra.Tech
- Domain: `webmitra.tech`
- Location: Butwal, Nepal
- Phone: `+977 9869672736`
- Email: `webmitra3@gmail.com`
