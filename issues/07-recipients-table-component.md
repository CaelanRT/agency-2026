# 07: Recipients Table Component

**Status:** completed
**Priority:** high
**Blocked by:** 02
**Blocks:** 11

## Description

Create a table component that displays the top 10 recipients for a selected ministry.

## Acceptance Criteria

- [ ] `src/components/RecipientsTable.tsx`
- [ ] Props: `recipients: Recipient[]`, `loading: boolean`
- [ ] Columns: Rank, Recipient, Total Contract Spend, Sole Source Spend, % of Ministry Spend
- [ ] Format currency values (e.g., `$50,000,000` or `$50.0M`)
- [ ] Format percentages (e.g., `62.0%`)
- [ ] Shows loading skeleton or spinner when `loading` is true
- [ ] Shows empty state message when no ministry is selected
- [ ] Clean, readable table styling appropriate for a government dashboard

## Notes

- Highlight rows where sole-source spend is > 50% of total spend (subtle background color) as a visual risk indicator
- Keep formatting consistent and professional
