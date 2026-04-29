# 16: GET /api/risk-scan Endpoint

**Status:** completed
**Priority:** high
**Blocked by:** 04
**Blocks:** 17, 20

## Description

Implement an endpoint that scans across ministries and returns ranked procurement risk metrics
so the app can proactively surface where a user should investigate first.

## Acceptance Criteria

- [ ] `GET /api/risk-scan` returns a list of ministries with computed risk metrics
- [ ] Each result includes:
  - `ministry`
  - `top_vendor_share`
  - `top_3_share`
  - `sole_source_share`
  - `total_spend`
  - `risk_score`
- [ ] Results are sorted highest-to-lowest by `risk_score`
- [ ] Reuses or shares logic with existing recipients/risk calculations where practical
- [ ] Handles database errors gracefully

## API Response

```json
{
  "ministries": [
    {
      "ministry": "Education",
      "top_vendor_share": 0.62,
      "top_3_share": 0.81,
      "sole_source_share": 0.44,
      "total_spend": 80000000,
      "risk_score": 0.57
    }
  ]
}
```

## Notes

- Keep scoring simple and explainable
- This endpoint is the backbone for proactive agent recommendations
