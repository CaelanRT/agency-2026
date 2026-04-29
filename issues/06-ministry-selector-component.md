# 06: Ministry Selector Dropdown Component

**Status:** todo
**Priority:** high
**Blocked by:** 02
**Blocks:** 10

## Description

Create a reusable dropdown component that displays the list of ministries and lets the user select one.

## Acceptance Criteria

- [ ] `src/components/MinistrySelector.tsx`
- [ ] Props: `ministries: string[]`, `selected: string | null`, `onSelect: (ministry: string) => void`, `loading: boolean`
- [ ] Renders a `<select>` dropdown with a default "Select a ministry..." placeholder
- [ ] Shows loading state when `loading` is true
- [ ] Styled to match the app's design system
- [ ] Placed in the header/top area of the app layout

## Notes

- Keep it simple - a styled `<select>` is fine, no need for a custom combobox
