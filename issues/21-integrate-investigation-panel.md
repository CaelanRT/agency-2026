# 21: Integrate Investigation Panel with Agent API

**Status:** completed
**Priority:** high
**Blocked by:** 17, 18
**Blocks:** 22

## Description

Wire the InvestigationPanel component to the new backend agent endpoint so users can ask the app
to investigate procurement risk questions in natural language.

## Acceptance Criteria

- [ ] Submitting the panel calls `POST /api/investigate`
- [ ] Canned prompts populate and submit cleanly
- [ ] Display the returned answer, evidence, steps, and next steps
- [ ] Handle loading and error states gracefully
- [ ] Preserve the current dashboard view while adding the investigation workflow

## Implementation

- API call in `src/api.ts`: `runInvestigation(query: string)`
- State in `App.tsx`
