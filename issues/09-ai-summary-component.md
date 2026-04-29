# 09: AI Summary Display Component

**Status:** todo
**Priority:** high
**Blocked by:** 02
**Blocks:** 12

## Description

Create a component that displays the AI-generated risk summary with a "Generate Insight" trigger.

## Acceptance Criteria

- [ ] `src/components/AISummary.tsx`
- [ ] Props: `ministry: string | null`, `onGenerate: () => void`, `summary: string | null`, `loading: boolean`
- [ ] Shows a "Generate Insight" button when a ministry is selected but no summary loaded
- [ ] Shows a loading state (spinner + "Analyzing procurement data...") while generating
- [ ] Renders the summary text in a styled card/panel
- [ ] Visually distinct section (e.g., light background, icon, "AI Insight" label)
- [ ] Hidden or shows prompt text when no ministry is selected

## Notes

- The button-triggered approach is good for the demo flow (select ministry -> see data -> click generate -> see AI insight)
- Consider auto-generating when ministry changes as a stretch alternative
