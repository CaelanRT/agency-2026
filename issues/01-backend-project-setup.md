# 01: Backend Project Setup

**Status:** completed
**Priority:** high
**Blocked by:** none
**Blocks:** 03, 04, 05

## Description

Initialize the Express + TypeScript backend project in a `backend/` directory at the repo root.

## Acceptance Criteria

- [ ] `backend/` directory with `package.json` (type: module)
- [ ] TypeScript configured (`tsconfig.json`)
- [ ] Express server in `backend/src/index.ts` listening on port 3001
- [ ] PostgreSQL connection pool initialized (`pg`)
- [ ] CORS enabled for `http://localhost:5174` (Vite dev server)
- [ ] `npm run dev` script using `tsx` or `ts-node` for hot reload
- [ ] `.env` support for `DATABASE_URL` env var
- [ ] Health check endpoint: `GET /api/health` returns `{ status: "ok" }`

## Dependencies (npm)

- express
- pg
- cors
- dotenv
- tsx (dev)
- typescript (dev)
- @types/express (dev)
- @types/cors (dev)
- @types/pg (dev)

## Notes

- The PostgreSQL connection string is provided via `DATABASE_URL` environment variable
- Database is hosted on Render (PostgreSQL)
