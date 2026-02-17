**Project**
- **Name**: SchooLSys
- **Short**: A lightweight school management API (Node.js + Prisma + Redis).

**Prerequisites**
- **Node**: Install Node.js (14+ recommended).
- **Database**: A PostgreSQL/MySQL-compatible database accessible via `DATABASE_URL`.
- **Redis (optional)**: Used for caching/rate-limits; local Docker compose available at [docker/redis](docker/redis).

**Quick Start**
- **Install dependencies**: `npm install`
- **Prepare env**: create a `.env` file in the project root and set at least `DATABASE_URL` (and `REDIS_URL` if using Redis). See `prisma.config.ts` for other config details.
- **Run migrations**: `npx prisma migrate dev --name init`
- **Seed dev data**: `node scripts/seed.js` (see [scripts/seed.js](scripts/seed.js))
- **Start server**: `node src/server.js` (or use the start script in `package.json` if available)

**Database & Prisma**
- **Schema**: [prisma/schema.prisma](prisma/schema.prisma)
- **Migrations**: [prisma/migrations](prisma/migrations)
- **Prisma client** used in code: [src/db/prisma.js](src/db/prisma.js)

**Useful scripts**
- **Seed DB**: `node scripts/seed.js` — idempotent seeding of users, courses and relations ([scripts/seed.js](scripts/seed.js)).
- **Create DB helper**: `node scripts/create_db.js` ([scripts/create_db.js](scripts/create_db.js)).
- **E2E tests**: `node scripts/e2e.test.js` ([scripts/e2e.test.js](scripts/e2e.test.js)).

**Redis / Docker**
- A Redis setup for local testing is provided under [docker/redis](docker/redis). Use `docker-compose up` inside that folder to start Redis + monitoring stack.

**Development**
- App entrypoints: `src/app.js` and `src/server.js`.
- API routes are under `src/routes` and controllers under `src/controllers`.
- Middleware is in `src/middleware`, services in `src/services`.

**Testing & Troubleshooting**
- If migrations fail, confirm `DATABASE_URL` and check `prisma/migrations` for conflicts.
- If seeding fails, inspect `.env` and the console error. The seeder loads `.env` if present and logs failures.

**Contributing**
- Fork, branch, implement, open PR. Keep changes focused and add tests for new behaviour.

**License**
- Add your license info here.

If you want, I can (1) run the migrations and seeder for you, (2) add a `npm` script to simplify startup, or (3) translate/expand any section further.
