# 02: Frontend App Shell and Cleanup

**Status:** completed
**Priority:** high
**Blocked by:** none
**Blocks:** 06, 07, 08, 09

## Description

Replace the Vite boilerplate in `agency-2026-frontend/` with the Procurement Risk Radar app shell layout.

## Acceptance Criteria

- [ ] Remove Vite boilerplate from `App.tsx`, `App.css`, `index.css`
- [ ] Set page title to "Procurement Risk Radar" in `index.html`
- [ ] Create base layout: header with app title, main content area, summary sidebar/footer
- [ ] Set up a clean design system (CSS variables for colors, spacing, typography)
- [ ] Government-appropriate color palette (blues, grays, professional look)
- [ ] Add an API utility module (`src/api.ts`) with a `BASE_URL` constant pointing to `http://localhost:3001`
- [ ] Add shared TypeScript types in `src/types.ts`:
  - `Ministry` (string)
  - `Recipient` ({ recipient: string, total_spend: number, sole_source_spend: number, share: number })
  - `SummaryResponse` ({ summary: string })

## Notes

- Keep it clean and minimal - this is a government analytics tool, not a consumer app
- Responsive is nice-to-have but not critical for the demo
