# 08: Risk Indicators Component

**Status:** completed
**Priority:** medium
**Blocked by:** 02
**Blocks:** 11

## Description

Create a component that displays computed risk metrics as cards/badges above or beside the table.

## Acceptance Criteria

- [ ] `src/components/RiskIndicators.tsx`
- [ ] Props: `recipients: Recipient[]`, `ministryTotal: number`, `loading: boolean`
- [ ] Displays:
  - Top vendor share (% of total ministry spend)
  - Top 3 vendors combined share
  - Total sole-source proportion (sole source total / ministry total)
- [ ] Each metric shown as a card with label + value
- [ ] Color-coded severity: green (< 30%), yellow (30-50%), red (> 50%)
- [ ] Shows placeholder/empty state when no data

## Notes

- These are simple computed values from the recipients data - no extra API call needed
- This adds visual polish and makes the risk story immediately obvious
