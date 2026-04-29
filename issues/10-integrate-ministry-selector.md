# 10: Integrate Ministry Selector with API

**Status:** completed
**Priority:** high
**Blocked by:** 03, 06
**Blocks:** 13

## Description

Wire up the MinistrySelector component to fetch ministries from the backend on app load, and trigger data fetching when a ministry is selected.

## Acceptance Criteria

- [ ] On app mount, fetch `GET /api/ministries` and populate the dropdown
- [ ] Store selected ministry in App-level state
- [ ] When ministry changes, trigger recipients fetch (issue 11) and clear previous summary
- [ ] Handle loading and error states
- [ ] Show error toast/message if the API is unreachable

## Implementation

- State management in `App.tsx` (useState/useEffect is fine, no need for Redux)
- API call in `src/api.ts`: `fetchMinistries(): Promise<string[]>`
