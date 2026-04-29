# 15: Stretch - Fiscal Year Filter

**Status:** todo
**Priority:** low
**Blocked by:** 13
**Blocks:** none

## Description

Add a fiscal year filter to allow users to narrow spending data by year.

## Acceptance Criteria

- [ ] New endpoint or query param: `GET /api/recipients?ministry=...&fiscal_year=...`
- [ ] Query `display_fiscal_year` column from `ab_contracts`
- [ ] Fetch distinct fiscal years for the dropdown
- [ ] Frontend dropdown beside ministry selector
- [ ] Recipients and summary update when fiscal year changes

## Notes

- Only if core flow is working and there's time
- Uses the `display_fiscal_year` column already in `ab_contracts`
