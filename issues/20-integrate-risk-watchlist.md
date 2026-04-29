# 20: Integrate Risk Watchlist with API

**Status:** completed
**Priority:** high
**Blocked by:** 16, 19
**Blocks:** 22

## Description

Wire the RiskWatchlist component to the new risk-scan endpoint so the dashboard can suggest where
the user should look first.

## Acceptance Criteria

- [ ] On app load, fetch `GET /api/risk-scan`
- [ ] Pass ranked results into RiskWatchlist
- [ ] Clicking a watchlist item selects that ministry in the existing workflow
- [ ] Handle loading and error states
- [ ] Keep the watchlist visible alongside the current dashboard flow

## Implementation

- API call in `src/api.ts`: `fetchRiskScan()`
- State in `App.tsx`
