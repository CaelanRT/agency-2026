# 19: Risk Watchlist Component

**Status:** completed
**Priority:** medium
**Blocked by:** 02
**Blocks:** 20

## Description

Create a component that proactively highlights the highest-risk ministries so the app feels like
it is surfacing what deserves attention, not only waiting for manual filtering.

## Acceptance Criteria

- [ ] `src/components/RiskWatchlist.tsx`
- [ ] Props: ranked ministry risk items, loading boolean, select-ministry handler
- [ ] Shows the top 3-5 ministries from the scan
- [ ] Displays the key metric that drove the alert
- [ ] Each item has a clear "Investigate" or "View ministry" action
- [ ] Loading and empty states are handled cleanly
- [ ] Styling makes this feel like an AI watchlist / triage panel

## Notes

- This is the proactive counterpart to the ministry drill-down flow
- Keep the content concise and scannable
