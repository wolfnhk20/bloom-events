# Smart Event Coordination System

A full-stack web application for managing baby shower and naming ceremony bookings. The system handles the complete event lifecycle: package selection, add-on service configuration, guest management, and cost calculation, with a separate admin interface for platform-wide oversight.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Planned Improvements](#planned-improvements)

---

## Overview

The system is structured around two user roles: end users who create and manage their own event bookings, and administrators who oversee all platform activity. Users progress through a multi-step booking flow that captures event details, selects a service package, adds optional services, and builds a guest list. Costs are calculated dynamically based on the selected package, chosen add-ons, and a configurable per-guest catering rate.

The backend exposes a JWT-authenticated REST API. The frontend is a React SPA that communicates exclusively through this API. Supabase provides both the PostgreSQL database and the authentication layer, including Google OAuth support and row-level security on all tables.

---

## Features

**User-facing**

- Multi-step booking flow covering event details, package selection, service add-ons, and guest list entry
- Three package tiers (Blossom, Bloom, Radiance) with distinct guest capacity limits and service inclusions
- Add-on service selection organized by category: decor, photography, catering, entertainment, and others
- Guest list management with dietary preference tracking and RSVP status
- Real-time cost breakdown calculated from package price, selected services, and per-guest catering rate
- Rule-based package recommendation derived from expected guest count

**Admin-facing**

- Dashboard displaying total events, cumulative revenue, registered user count, and event type distribution
- Full event management with status updates and deletion capability
- CRUD operations for packages and services
- User directory with role assignments and registration metadata

**Authentication**

- Google OAuth via Supabase Auth
- JWT-based session management; tokens issued by Supabase and verified on every protected backend route
- Role-based access control with `USER` and `ADMIN` roles

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Spring Boot 3.2 (Java 17) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Google OAuth + JWT) |
| HTTP Client | Axios |
| Routing | React Router v6 |
| Notifications | React Hot Toast |
| Deployment | Vercel (frontend), Render (backend), Supabase (database) |

---

## Architecture

The frontend communicates with the Spring Boot API over HTTPS using Bearer token authentication. The backend validates each token against the Supabase JWT secret and resolves the requesting user by email and Supabase user ID before processing any protected request. The database layer uses JPA/Hibernate over a direct JDBC connection to Supabase PostgreSQL.

```
Browser (React SPA)
        |
        |  HTTPS + Bearer JWT
        v
Spring Boot REST API
        |
        |  JPA / Hibernate (JDBC)
        v
Supabase PostgreSQL
```

**Authentication flow:** The user signs in via Google through Supabase Auth. Supabase completes the OAuth handshake and returns a signed JWT access token. The frontend stores this token in memory and attaches it as a Bearer header on every API request. The backend decodes and verifies the token on each request using the configured JWT secret.

**Data security:** Row-level security policies are enabled on all Supabase tables, ensuring that even direct database connections are scoped to the authenticated user's identity.

---

## Installation

### Prerequisites

- Node.js 18+
- Java 17+
- Maven 3.8+
- A Supabase project (free tier is sufficient)

### 1. Database Setup

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run `database/schema.sql`. This script creates all tables, defines relationships and indexes, applies RLS policies, and seeds initial package and service data.
3. Navigate to Authentication > Providers > Google and enable it using OAuth 2.0 credentials from the Google Cloud Console.
4. Collect the following from the Supabase dashboard: project URL, anon key, JWT secret, and the PostgreSQL connection string.

### 2. Backend Setup

```bash
cd backend
```

Configure the following environment variables:

```env
SUPABASE_DB_URL=jdbc:postgresql://db.<project-id>.supabase.co:5432/postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=your-db-password
SUPABASE_JWT_SECRET=your-jwt-secret
SUPABASE_URL=https://<project-id>.supabase.co
CORS_ALLOWED_ORIGINS=http://localhost:5173
ADMIN_EMAILS=admin@yourdomain.com
CATERING_PRICE_PER_GUEST=500
```

Start the server:

```bash
mvn spring-boot:run
# API available at http://localhost:8080
```

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env
```

Configure `.env`:

```env
VITE_SUPABASE_URL=https://<project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:8080
VITE_ADMIN_EMAILS=admin@yourdomain.com
```

Install dependencies and start the development server:

```bash
npm install
npm run dev
# App available at http://localhost:5173
```

### 4. Assigning Admin Role

After first sign-in, run the following in the Supabase SQL editor to elevate a user to admin:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```

---

## API Reference

All endpoints are prefixed with `/api`. Protected routes require a valid Bearer JWT in the `Authorization` header. Admin routes additionally require the authenticated user to hold the `ADMIN` role.

### Public Routes

```
GET /api/health
GET /api/packages
GET /api/packages/recommend?guestCount={n}
GET /api/services
```

### User Routes (Bearer token required)

```
GET    /api/events                  List events for the authenticated user
POST   /api/events                  Create a new event booking
GET    /api/events/:id              Retrieve event details
DELETE /api/events/:id              Cancel an event
GET    /api/events/:id/cost         Retrieve itemised cost breakdown
POST   /api/events/:id/guests       Add guests to an event
```

### Admin Routes (ADMIN role required)

```
GET    /api/admin/stats              Platform-wide aggregate statistics
GET    /api/admin/events             All events across all users
PUT    /api/admin/events/:id/status  Update event status
GET    /api/admin/users              All registered users
POST   /api/packages                 Create a package
PUT    /api/packages/:id             Update a package
DELETE /api/packages/:id             Delete a package
POST   /api/services                 Create a service
PUT    /api/services/:id             Update a service
DELETE /api/services/:id             Delete a service
```

---

## Deployment

### Frontend (Vercel)

Connect the repository to Vercel and set the root directory to `frontend`. Add all variables from the frontend `.env` file as environment variables in the Vercel project settings. Vercel detects Vite automatically and configures the build accordingly.

### Backend (Render)

Create a Web Service on Render pointing to the `backend` directory. Set the build command to `mvn clean package -DskipTests` and the start command to `java -jar target/smart-event-api-1.0.0.jar`. Configure all backend environment variables in Render, and set `CORS_ALLOWED_ORIGINS` to the deployed Vercel URL.

### Database (Supabase)

No additional deployment steps are required. Ensure the schema has been applied and that the `SUPABASE_DB_URL` used by Render references the correct project.

After deploying the frontend, add the Vercel callback URL (`https://your-app.vercel.app/auth/callback`) to the allowed redirect URLs under Authentication > URL Configuration in the Supabase dashboard.

---

## Planned Improvements

- **Payment integration:** Deposit collection at booking time via Razorpay or Stripe.
- **Email notifications:** Automated confirmation emails on booking creation and reminders prior to the event date.
- **Guest RSVP portal:** Public, unauthenticated link for guests to confirm attendance and submit dietary preferences.
- **ML-based package recommendations:** Replace the current rule-based recommendation logic with a model trained on historical booking data.
- **Admin calendar view:** Visual calendar for administrators to track upcoming events and identify scheduling conflicts.
- **PDF invoice generation:** Downloadable, per-event cost summaries for users and coordinators.

---

## Summary

The system covers the full lifecycle of an event booking from initial configuration through guest management and cost review. The backend is a Spring Boot REST API with JWT-based auth and role-level access control. The frontend is a React SPA consuming that API. Data is persisted in a Supabase-hosted PostgreSQL instance with row-level security enforced at the database layer. The codebase is structured to accommodate new event types, pricing rules, and service categories without requiring cross-cutting changes.