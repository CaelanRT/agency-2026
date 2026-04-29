# 01: Backend Project Setup

**Status:** open
**Priority:** high
**Blocked by:** none
**Blocks:** 03, 04, 05

## Description

Initialize the Express + TypeScript backend project in a `backend/` directory at the repo root.

## Acceptance Criteria

- [ ] `backend/` directory with `package.json` (type: module)
- [ ] TypeScript configured (`tsconfig.json`)
- [ ] Express server in `backend/src/index.ts` listening on port 3001
- [ ] BigQuery client initialized (`@google-cloud/bigquery`)
- [ ] CORS enabled for `http://localhost:5173` (Vite dev server)
- [ ] `npm run dev` script using `tsx` or `ts-node` for hot reload
- [ ] `.env` support for `GCP_PROJECT_ID` and `BQ_DATASET` env vars
- [ ] Health check endpoint: `GET /api/health` returns `{ status: "ok" }`

## Dependencies (npm)

- express
- @google-cloud/bigquery
- cors
- dotenv
- tsx (dev)
- typescript (dev)
- @types/express (dev)
- @types/cors (dev)

## Notes

- The GCP project and dataset will be provided via environment variables
- BigQuery auth should use Application Default Credentials (ADC)
