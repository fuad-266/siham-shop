# Deployment Guide — Alora Abayas

This guide provides step-by-step instructions for deploying the Alora Abayas project. The backend is designed for **Render**, and the frontend for **Vercel**.

---

## 1. Backend Deployment (Render)

### Prerequisites
- A Render account.
- A Supabase project (for PostgreSQL and Authentication).

### Deployment Steps
1. **Create a New Web Service:**
   - Connect your GitHub repository.
   - Select the `backend` directory as the **Root Directory**.
2. **Configure Build & Start:**
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:prod` (points to `node dist/src/main`)
3. **Environment Variables:**
   Add the following variables in the Render Dashboard (**Environment** tab):

| Variable | Description | Example/Value |
| :--- | :--- | :--- |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Listening port | `3001` (Render will manage this automatically if not set) |
| `DATABASE_URL` | Prisma direct connection | `postgresql://...` (Use connection pooling URL) |
| `DIRECT_URL` | Prisma direct connection | `postgresql://...` (Use direct connection URL) |
| `SUPABASE_URL` | Supabase API URL | From Supabase Project Settings |
| `SUPABASE_ANON_KEY` | Supabase Public Key | From Supabase Project Settings |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Admin Key | From Supabase Project Settings |
| `SUPABASE_JWT_SECRET` | JWT Secret | From Supabase Project Settings |
| `FRONTEND_URL` | URL of the frontend | `https://your-frontend.vercel.app` |
| `THROTTLE_TTL` | Rate limit window | `60000` |
| `THROTTLE_LIMIT` | Rate limit count | `100` |

4. **Database Migrations:**
   Ensure the first build runs migrations. You can modify the Build Command to:
   `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`

---

## 2. Frontend Deployment (Vercel)

### Prerequisites
- A Vercel account.
- Backend URL (from Render deployment).

### Deployment Steps
1. **Import Project:**
   - Connect your GitHub repository.
   - Set the `frontend` directory as the **Root Directory**.
2. **Framework Preset:**
   - Vercel should automatically detect **Next.js**.
3. **Environment Variables:**
   Add the following variables in the Vercel Dashboard:

| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Your Render Backend URL + `/api` (e.g., `https://api.render.com/api`) |
| `NEXT_PUBLIC_SUPABASE_URL` | From Supabase Project Settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Supabase Project Settings |

4. **Deploy:**
   - Click **Deploy**. Vercel will build and host your Next.js application.

---

## 3. Post-Deployment Checklist
- [ ] Update `FRONTEND_URL` in Render with the final Vercel URL.
- [ ] Update `NEXT_PUBLIC_API_URL` in Vercel with the final Render URL.
- [ ] Verify CORS settings on the backend allow the Vercel production domain.
- [ ] Check Supabase "Allow Origins" in Authentication settings to include both production URLs.
