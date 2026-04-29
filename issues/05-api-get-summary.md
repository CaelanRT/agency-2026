# 05: GET /api/summary Endpoint (AI Layer)

**Status:** open
**Priority:** high
**Blocked by:** 01
**Blocks:** 12

## Description

Implement the AI summary endpoint that generates a plain-English risk summary for a selected ministry using Claude API (or OpenAI).

## Acceptance Criteria

- [ ] `GET /api/summary?ministry=Health` returns an AI-generated risk summary
- [ ] Internally calls the recipients logic (or `/api/recipients`) to get data
- [ ] Constructs a prompt with: top vendor, total spend, vendor share %, sole source totals
- [ ] Calls Claude API (preferred) or OpenAI API to generate a 2-3 sentence summary
- [ ] Returns 400 if `ministry` query param is missing
- [ ] Handles AI API errors gracefully
- [ ] Add `ANTHROPIC_API_KEY` (or `OPENAI_API_KEY`) to `.env` config

## API Response

```json
{
  "summary": "Spending in Health is concentrated among a small number of vendors. The top vendor accounts for 62% of total contract value, with significant reliance on sole-source contracts, which may indicate reduced competition."
}
```

## Prompt Design

The prompt should:
- Only summarize the data provided (no hallucination)
- Be neutral and factual in tone
- Mention concentration risk and sole-source reliance
- Be 2-4 sentences max

## Dependencies (npm)

- `@anthropic-ai/sdk` or `openai`

## Notes

- This is the "wow factor" for the demo - make it work reliably
- Keep the prompt simple and data-grounded
