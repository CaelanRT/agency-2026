# 12: Integrate AI Summary with API

**Status:** todo
**Priority:** high
**Blocked by:** 05, 09
**Blocks:** 13

## Description

Wire up the AISummary component to fetch the AI-generated summary from the backend.

## Acceptance Criteria

- [ ] "Generate Insight" button calls `GET /api/summary?ministry=...`
- [ ] Show loading state while AI generates the response
- [ ] Display the returned summary text
- [ ] Clear summary when ministry selection changes
- [ ] Handle errors gracefully (show friendly error message)

## Implementation

- API call in `src/api.ts`: `fetchSummary(ministry: string): Promise<string>`
- State in `App.tsx`
