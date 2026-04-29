# 03: GET /api/ministries Endpoint

**Status:** open
**Priority:** high
**Blocked by:** 01
**Blocks:** 10

## Description

Implement the endpoint that returns a list of distinct ministries from BigQuery `ab_contracts` table.

## Acceptance Criteria

- [ ] `GET /api/ministries` returns `{ ministries: string[] }`
- [ ] Queries `SELECT DISTINCT ministry FROM {dataset}.ab_contracts ORDER BY ministry`
- [ ] Returns sorted list of ministry names
- [ ] Handles BigQuery errors gracefully (500 with error message)

## API Response

```json
{
  "ministries": [
    "Advanced Education",
    "Agriculture and Irrigation",
    "Health",
    ...
  ]
}
```

## File

- `backend/src/routes/ministries.ts` (or inline in index.ts, keep it simple)
