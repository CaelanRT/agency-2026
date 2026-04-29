# 03: GET /api/ministries Endpoint

**Status:** completed
**Priority:** high
**Blocked by:** 01
**Blocks:** 10

## Description

Implement the endpoint that returns a list of distinct ministries from the `ab_contracts` table in PostgreSQL.

## Acceptance Criteria

- [ ] `GET /api/ministries` returns `{ ministries: string[] }`
- [ ] Queries `SELECT DISTINCT ministry FROM ab.ab_contracts ORDER BY ministry`
- [ ] Returns sorted list of ministry names
- [ ] Handles database errors gracefully (500 with error message)

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
