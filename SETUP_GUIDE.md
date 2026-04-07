# Smart Event Coordination System
## Complete Setup & Deployment Guide

---

## Project Structure

```
smart-event/
├── frontend/                    # React (Vite) app
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── Navbar.jsx
│   │   │   └── admin/
│   │   │       └── AdminLayout.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── lib/
│   │   │   ├── supabase.js
│   │   │   └── api.js
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── AuthCallback.jsx
│   │   │   ├── BookingPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminEvents.jsx
│   │   │       ├── AdminPackages.jsx
│   │   │       ├── AdminServices.jsx
│   │   │       └── AdminUsers.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── .env.example
│
├── backend/                     # Spring Boot API
│   ├── src/main/java/com/smartevent/
│   │   ├── SmartEventApplication.java
│   │   ├── config/
│   │   │   ├── SecurityConfig.java
│   │   │   └── JwtAuthFilter.java
│   │   ├── controller/
│   │   │   └── Controllers.java
│   │   ├── service/
│   │   │   ├── Services.java
│   │   │   └── CostCalculationService.java
│   │   ├── repository/
│   │   │   └── Repositories.java
│   │   ├── model/
│   │   │   ├── User.java
│   │   │   ├── Package.java
│   │   │   ├── Service.java
│   │   │   ├── Event.java
│   │   │   ├── EventService.java
│   │   │   └── Guest.java
│   │   ├── dto/
│   │   │   └── Dtos.java
│   │   └── exception/
│   │       └── GlobalExceptionHandler.java
│   ├── src/main/resources/
│   │   └── application.yml
│   ├── pom.xml
│   └── .env.example
│
└── database/
    └── schema.sql
```

---

## Step 1 — Supabase Setup

### 1.1 Create a Supabase Project
1. Go to https://supabase.com and sign in
2. Click **New Project**
3. Choose your organization, set a name (e.g. `smart-event`), set a strong database password
4. Select your region (closest to your users) → **Create Project**

### 1.2 Run the Database Schema
1. In your Supabase project, go to **SQL Editor**
2. Click **New Query**
3. Paste the entire contents of `database/schema.sql`
4. Click **Run** — all tables, indexes, RLS policies, and sample data will be created

### 1.3 Configure Google OAuth
1. Go to **Authentication → Providers → Google**
2. Enable Google provider
3. Create Google OAuth credentials at https://console.cloud.google.com:
   - Create a new project or use existing
   - Enable **Google+ API**
   - Create **OAuth 2.0 Client ID** (Web application)
   - Add Authorized redirect URIs:
     - `https://your-project-id.supabase.co/auth/v1/callback`
     - `http://localhost:5173/auth/callback` (for development)
4. Copy **Client ID** and **Client Secret** back into Supabase Google provider settings

### 1.4 Collect Supabase Credentials
From **Settings → API**:
- `Project URL` → `VITE_SUPABASE_URL` and `SUPABASE_URL`
- `anon public` key → `VITE_SUPABASE_ANON_KEY`
- `JWT Secret` → `SUPABASE_JWT_SECRET`

From **Settings → Database → Connection string (URI)**:
- Copy the URI → replace `[YOUR-PASSWORD]` with your DB password → `SUPABASE_DB_URL`

### 1.5 Set Admin User
After first login, run this in Supabase SQL Editor to promote your account:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```

---

## Step 2 — Local Development Setup

### 2.1 Frontend

```bash
cd frontend
cp .env.example .env
# Fill in .env with your Supabase values
npm install
npm run dev
# Runs on http://localhost:5173
```

### 2.2 Backend

Requirements: Java 17+, Maven 3.8+

```bash
cd backend

# Set environment variables (PowerShell)
$env:SUPABASE_DB_URL="jdbc:postgresql://db.xxxx.supabase.co:5432/postgres"
$env:SUPABASE_DB_USER="postgres"
$env:SUPABASE_DB_PASSWORD="your-password"
$env:SUPABASE_JWT_SECRET="your-jwt-secret"
$env:SUPABASE_URL="https://xxxx.supabase.co"
$env:CORS_ALLOWED_ORIGINS="http://localhost:5173"
$env:ADMIN_EMAILS="admin@yourdomain.com"

# Or use a .env file with your IDE

mvn spring-boot:run
# Runs on http://localhost:8080
```

---

## Step 3 — Frontend Deployment (Vercel)

### 3.1 Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/smart-event.git
git push -u origin main
```

### 3.2 Deploy on Vercel
1. Go to https://vercel.com → **New Project**
2. Import your GitHub repository
3. Set **Root Directory** to `frontend`
4. Set **Framework Preset** to `Vite`
5. Add Environment Variables:

| Variable | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJ...` |
| `VITE_API_URL` | `https://your-backend.onrender.com` |
| `VITE_ADMIN_EMAILS` | `admin@yourdomain.com` |

6. Click **Deploy**
7. Note your Vercel URL (e.g. `https://smart-event.vercel.app`)

### 3.3 Update Supabase redirect URLs
In Supabase → Authentication → URL Configuration:
- Add `https://smart-event.vercel.app/auth/callback` to **Redirect URLs**

---

## Step 4 — Backend Deployment (Render)

### 4.1 Create a Render Account
Go to https://render.com and sign up

### 4.2 Create Web Service
1. Click **New → Web Service**
2. Connect your GitHub repository
3. Set these options:

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Runtime | `Java` |
| Build Command | `mvn clean package -DskipTests` |
| Start Command | `java -jar target/smart-event-api-1.0.0.jar` |
| Instance Type | Free (or Starter for production) |

4. Add Environment Variables (same as `.env.example`):
   - `SUPABASE_DB_URL`
   - `SUPABASE_DB_USER`
   - `SUPABASE_DB_PASSWORD`
   - `SUPABASE_JWT_SECRET`
   - `SUPABASE_URL`
   - `CORS_ALLOWED_ORIGINS` → `https://smart-event.vercel.app`
   - `ADMIN_EMAILS`
   - `CATERING_PRICE_PER_GUEST` → `500`

5. Click **Create Web Service**
6. Note your Render URL (e.g. `https://smart-event-api.onrender.com`)

### 4.3 Alternative: Deploy on Railway
1. Go to https://railway.app
2. **New Project → Deploy from GitHub**
3. Select your repo, set root to `backend`
4. Add the same environment variables
5. Railway auto-detects Maven and deploys

---

## Step 5 — Post-Deployment Checklist

- [ ] Frontend loads at your Vercel URL
- [ ] Google sign-in redirects correctly
- [ ] After login, dashboard loads
- [ ] `/book` page shows packages and services from DB
- [ ] Can complete a booking
- [ ] Admin panel accessible at `/admin` with admin account
- [ ] Admin stats display correctly
- [ ] CRUD for packages and services works
- [ ] Health check: `https://your-backend.onrender.com/api/health` returns `{"status":"UP"}`

---

## API Endpoint Reference

### Public Endpoints (no auth required)
```
GET  /api/health              — Health check
GET  /api/packages            — List all packages
GET  /api/packages/:id        — Get package by ID
GET  /api/packages/recommend?guestCount=50  — Package recommendation
GET  /api/services            — List all services
```

### Protected Endpoints (requires Bearer token)
```
GET    /api/events            — Get user's events
POST   /api/events            — Create event
GET    /api/events/:id        — Get event by ID
PUT    /api/events/:id        — Update event
DELETE /api/events/:id        — Delete event
GET    /api/events/:id/cost   — Cost breakdown

GET    /api/events/:id/guests      — List guests
POST   /api/events/:id/guests      — Add guest
POST   /api/events/:id/guests/bulk — Add guests in bulk
DELETE /api/events/:id/guests/:gid — Remove guest
```

### Admin Endpoints (requires ADMIN role)
```
GET  /api/admin/stats                     — Dashboard stats
GET  /api/admin/events                    — All events
PUT  /api/admin/events/:id/status         — Update event status
DELETE /api/admin/events/:id             — Delete event
GET  /api/admin/users                     — All users
POST /api/packages                        — Create package
PUT  /api/packages/:id                    — Update package
DELETE /api/packages/:id                  — Delete package
POST /api/services                        — Create service
PUT  /api/services/:id                    — Update service
DELETE /api/services/:id                  — Delete service
```

---

## Business Logic Summary

### Cost Calculation
```
Total = Package Base Price
      + Sum(Selected Service Prices)
      + (Guest Count × ₹500 catering/guest)
```

### Package Recommendation Engine
```
≤ 30 guests  → Blossom (₹15,000 base)
31–75 guests → Bloom   (₹35,000 base) ← most popular
> 75 guests  → Radiance (₹65,000 base)
```

### Role-Based Access
```
USER  → Can book, view own events, manage own guests
ADMIN → All USER permissions + admin panel, all events, CRUD packages/services
```

---

## Tech Stack Summary

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS + Framer Motion |
| Auth | Supabase Auth (Google OAuth) |
| Frontend API | Axios |
| Backend | Spring Boot 3.2 (Java 17) |
| Security | JWT (Supabase tokens) + Spring Security |
| Database | Supabase (PostgreSQL) |
| ORM | Spring Data JPA (Hibernate) |
| Frontend Deploy | Vercel |
| Backend Deploy | Render / Railway |
| DB Deploy | Supabase (managed) |

---

## Common Issues & Solutions

**Issue: CORS error on API calls**
→ Make sure `CORS_ALLOWED_ORIGINS` includes your exact frontend URL (no trailing slash)

**Issue: JWT verification fails**
→ Double-check `SUPABASE_JWT_SECRET` — it must be the raw secret from Supabase, not base64-encoded

**Issue: Google OAuth redirect fails**
→ Add your frontend callback URL to both Google Console and Supabase redirect URLs

**Issue: Database connection refused**
→ In Supabase → Settings → Database, enable "Connection pooling" and use the pooler URL

**Issue: Admin routes show 403**
→ Run `UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';` in Supabase SQL Editor
→ Also ensure `ADMIN_EMAILS` env var is set in both frontend and backend

**Issue: Free tier Render backend sleeps**
→ Use a cron job service (e.g. cron-job.org) to ping `/api/health` every 14 minutes to keep alive
