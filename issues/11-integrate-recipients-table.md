# 11: Integrate Recipients Table + Risk Indicators with API

**Status:** completed
**Priority:** high
**Blocked by:** 04, 07, 08
**Blocks:** 13

## Description

Wire up the RecipientsTable and RiskIndicators components to fetch data from the backend when a ministry is selected.

## Acceptance Criteria

- [ ] When selected ministry changes, fetch `GET /api/recipients?ministry=...`
- [ ] Pass recipients data to RecipientsTable component
- [ ] Pass recipients data + ministry total to RiskIndicators component
- [ ] Handle loading state (show loading in both components during fetch)
- [ ] Handle error state (show error message if fetch fails)
- [ ] Clear data when ministry selection changes (before new data loads)

## Implementation

- API call in `src/api.ts`: `fetchRecipients(ministry: string): Promise<{ recipients: Recipient[], ministry_total: number }>`
- State in `App.tsx`
