**Project**
- **Name**: SchooLSys
- **Short**: A lightweight school management API (Node.js + Prisma + Redis).

**Prerequisites**
- **Node**: Install Node.js (14+ recommended).
- **Database**: A PostgreSQL-compatible database is recommended; provide the connection via `DATABASE_URL`.
- **Redis (optional)**: Used for caching and rate-limit storage. A local setup is provided at [docker/redis](docker/redis).

**Environment variables**
Create a `.env` file in the project root. Minimal variables used by the app (examples / defaults shown):

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/schoolsys?schema=public

# Server
PORT=3000
APP_BASE_URL=http://localhost:3000

# JWT
JWT_SECRET=replace_me_with_a_long_random_string
ACCESS_TTL_MIN=15
REFRESH_TTL_HOURS=24

# Redis (optional)
REDIS_URL=redis://localhost:6379
REDIS_USE_CLUSTER=false

# Mail (Resend)
RESEND_API_KEY=
EMAIL_FROM=no-reply@example.com

# ID cipher secret (optional)
ID_SECRET=
```

You can find additional environment usage in the code (e.g. `JWT_SECRET`, `RESEND_API_KEY`, `REDIS_*`, `RATE_LIMIT_*`).

**Install & Run**
- Install dependencies:

```bash
npm install
```

- Run database migrations (development):

```bash
npx prisma migrate dev --name init
```

- Seed development data (idempotent):

```bash
node scripts/seed.js
```

- Start the server:

```bash
npm run dev      # uses nodemon (hot reload)
npm start        # production style start
```

**package.json scripts**
- `dev`: `nodemon src/server.js` (hot reload in development)
- `start`: `node src/server.js`

If you'd like, I can add scripts such as `migrate`, `seed`, and `test` to `package.json`.

**Database & Prisma**
- **Schema**: [prisma/schema.prisma](prisma/schema.prisma)
- **Migrations**: [prisma/migrations](prisma/migrations)
- **Prisma client** used in code: [src/db/prisma.js](src/db/prisma.js)

**Useful scripts and helpers**
- `node scripts/seed.js` — idempotent seeding of users, courses and relations ([scripts/seed.js](scripts/seed.js)).
- `node scripts/create_db.js` — helper to create the DB if needed ([scripts/create_db.js](scripts/create_db.js)).
- `node scripts/e2e.test.js` — simple end-to-end script ([scripts/e2e.test.js](scripts/e2e.test.js)).

**Redis / Docker**
- A Redis + monitoring setup is provided under [docker/redis](docker/redis). To run Redis locally for development:

```bash
cd docker/redis
docker-compose up
```

Ensure `REDIS_URL` points to the running Redis instance.

**Postman：接口测试（详尽）**
This project contains a dedicated Postman guide at [Postman-Testing.md](Postman-Testing.md). Quick steps below:

- Create a Postman Environment (e.g. `ManagementSys`) and add variables:
  - `baseUrl` = `http://localhost:3000`
  - `accessToken`, `refreshToken`, `userId` — leave blank (populated by Tests)

- Recommended request flow (first-time):
  1. `GET {{baseUrl}}/health` — verify service up
  2. `POST {{baseUrl}}/users` — create test user
  3. `POST {{baseUrl}}/auth/login` — login and save `accessToken`/`refreshToken` via Tests
  4. Call protected endpoints using `Authorization: Bearer {{accessToken}}` (e.g. `GET /users`)
  5. Use `POST /auth/refresh` to renew `accessToken` when needed

- In Postman `Tests` tab, add the provided scripts (see [Postman-Testing.md](Postman-Testing.md)) to save tokens to environment variables automatically.

- Build a Collection (e.g. `ManagementSys`) and use Collection Runner to execute the full flow (create → login → protected calls).

**Troubleshooting**
- 401/Invalid token: ensure `Authorization` header is `Bearer {{accessToken}}` and token not expired.
- 403/Forbidden: check user `role` and ownership rules.
- Migration/connect errors: confirm `DATABASE_URL` and DB accessibility.
