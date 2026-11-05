# Airbnb Stays — .NET + Angular

A full-stack rewrite of the original Next.js Airbnb clone using an ASP.NET Core Web API and an Angular single-page application.

## Stack

- **Backend:** ASP.NET Core 8, Entity Framework Core, SQLite, JWT authentication
- **Frontend:** Angular 22, standalone components, signals, reactive HTTP services
- **Map:** OpenStreetMap embed
- **Images:** external image URLs instead of Cloudinary uploads

## Features

- Email/password registration and login with JWT
- Browse and filter stays by category, country, guests, rooms, bathrooms, and dates
- Listing details with host, amenities, map, availability, and booking
- Favorites with instant optimistic UI updates
- Trips and reservation cancellation
- Host dashboard for properties and guest reservations
- Multi-step "Airbnb your home" listing flow
- Seeded demo data and responsive layouts

## Project structure

```text
backend/                     ASP.NET Core Web API
  Controllers/               Auth, listings, favorites, reservations
  Data/                      EF Core context and seed data
  Dtos/                      Request and response contracts
  Models/                    User, Listing, Reservation, Favorite
  Services/                  JWT, current-user helper, mappings
frontend/                    Angular application
  src/app/components/        Navbar, cards, modals, map, shared UI
  src/app/core/              Services, models, guards, helpers
  src/app/pages/             Home, listing details, trips, favorites, host pages
```

## Running locally

Prerequisites: .NET 8 SDK, Node.js 20.19+ (or newer), and npm.

### 1. Start the API

```bash
dotnet run --project backend --urls http://localhost:5269
```

The SQLite database is created at `backend/airbnb.db` on first start and seeded automatically. Swagger is available at `http://localhost:5269/swagger`.

### 2. Start the Angular app

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:4200`. The Angular dev server proxies `/api` requests to `http://localhost:5269` using `frontend/proxy.conf.json`.

## Demo account

```text
Email:    demo@airbnb.dev
Password: password123
```

Two additional seeded hosts use `host@airbnb.dev` and `ana@airbnb.dev`, both with password `password123`.

To reset the seeded data, stop the API and delete `backend/airbnb.db`.

## API overview

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Create an account and return a JWT |
| POST | `/api/auth/login` | Log in and return a JWT |
| GET | `/api/auth/me` | Current user, including favorite IDs |
| GET | `/api/listings` | List and filter listings |
| GET | `/api/listings/{id}` | Listing with host details |
| POST | `/api/listings` | Create a listing (authenticated) |
| DELETE | `/api/listings/{id}` | Delete an owned listing |
| GET | `/api/favorites` | Current user's favorite listings |
| POST | `/api/favorites/{listingId}` | Add a favorite |
| DELETE | `/api/favorites/{listingId}` | Remove a favorite |
| GET | `/api/reservations` | Filter by `listingId`, `userId`, or `authorId` |
| POST | `/api/reservations` | Create a reservation with server-side price and overlap checks |
| DELETE | `/api/reservations/{id}` | Cancel a reservation as guest or host |

## Configuration

Backend settings live in `backend/appsettings.json`. In production, override the development JWT key and connection string with environment variables:

```bash
export ConnectionStrings__Default="Data Source=/data/airbnb.db"
export Jwt__Key="replace-with-a-long-random-production-secret"
```

CORS origins are configured in `Cors:AllowedOrigins`; add the deployed frontend origin there if it is not served through the same origin or reverse proxy.

## Verification

```bash
dotnet build Airbnb.sln
cd frontend
npm run build
npm test -- --watch=false
```

## Migration notes

- NextAuth social providers were replaced with the credentials flow backed by JWT.
- Cloudinary uploads were replaced with validated image URLs.
- Prisma was replaced with EF Core and SQLite models.
- `react-date-range` was replaced with native date inputs, while the API enforces date and overlap validation.
- Favorite IDs are stored in a relational `Favorites` table rather than a serialized user column.
