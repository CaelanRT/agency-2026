# 18: Investigation Panel Component

**Status:** completed
**Priority:** high
**Blocked by:** 02
**Blocks:** 21

## Description

Create a dedicated frontend component for running an AI-guided procurement investigation from a
natural-language prompt.

## Acceptance Criteria

- [ ] `src/components/InvestigationPanel.tsx`
- [ ] Props support:
  - current query string
  - loading boolean
  - current result object or `null`
  - submit handler
  - canned prompt handler
- [ ] Includes a text input or textarea with submit action
- [ ] Includes 3-5 curated example prompts for the demo
- [ ] Shows loading state while the investigation runs
- [ ] Renders sections for answer, evidence, steps, and next steps
- [ ] Styled to feel like a distinct "investigation workspace" rather than another summary card

## Notes

- The canned prompts should steer the user toward the supported investigation types
- This should be demo-friendly and legible in one glance
