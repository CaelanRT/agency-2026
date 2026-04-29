# 04: GET /api/recipients Endpoint

**Status:** open
**Priority:** high
**Blocked by:** 01
**Blocks:** 11

## Description

Implement the endpoint that returns top 10 recipients for a given ministry, with contract and sole-source spend merged.

## Acceptance Criteria

- [ ] `GET /api/recipients?ministry=Health` returns top 10 recipients
- [ ] Queries `ab_contracts` for top recipients by total spend for the given ministry
- [ ] Queries `ab_sole_source` for sole-source totals by recipient
- [ ] Joins results in application code on `recipient` field
- [ ] Computes `share` = recipient_total / ministry_total_spend
- [ ] Returns 400 if `ministry` query param is missing
- [ ] Handles BigQuery errors gracefully (500 with error message)
- [ ] Uses parameterized queries (not string interpolation) for SQL safety

## API Response

```json
{
  "recipients": [
    {
      "recipient": "Vendor A",
      "total_spend": 50000000,
      "sole_source_spend": 40000000,
      "share": 0.62
    }
  ],
  "ministry_total": 80000000
}
```

## Key SQL

```sql
-- Top recipients
SELECT recipient, SUM(amount) AS total_spend
FROM `{dataset}.ab_contracts`
WHERE ministry = @ministry
GROUP BY recipient
ORDER BY total_spend DESC
LIMIT 10;

-- Sole source totals for those recipients
SELECT recipient, SUM(amount) AS sole_source_total
FROM `{dataset}.ab_sole_source`
GROUP BY recipient;
```

## Notes

- The join is done in JS, not SQL, because the tables may not have a shared key beyond `recipient`
- `sole_source_spend` defaults to 0 if no match found
