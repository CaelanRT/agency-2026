# 17: POST /api/investigate Agent Endpoint

**Status:** completed
**Priority:** high
**Blocked by:** 05, 16
**Blocks:** 21

## Description

Implement an investigation endpoint that accepts a natural-language question, chooses the
relevant procurement data to inspect, and returns an evidence-backed answer plus suggested next
steps.

## Acceptance Criteria

- [ ] `POST /api/investigate` accepts `{ query: string }`
- [ ] Supports at least these investigation intents:
  - overall risk ranking across ministries
  - compare two ministries
  - explain why a ministry looks risky
- [ ] Uses live data from internal backend functions/endpoints, not hardcoded examples
- [ ] Returns:
  - `answer`
  - `evidence` string array
  - `steps` string array
  - `next_steps` string array
- [ ] Uses OpenAI to synthesize the final answer in a grounded, factual tone
- [ ] Handles unsupported queries and API failures gracefully

## API Response

```json
{
  "answer": "Education appears to present the strongest concentration risk...",
  "evidence": [
    "Education has the highest top-vendor share at 62.0%",
    "Health has higher sole-source reliance but lower concentration"
  ],
  "steps": [
    "Loaded ministry risk scan",
    "Compared concentration and sole-source metrics"
  ],
  "next_steps": [
    "Review Education over time",
    "Inspect the top vendor in Health"
  ]
}
```

## Notes

- Keep the first version deterministic and narrow rather than pretending to support open-ended research
- The agent should feel useful because it can inspect multiple ministries, not because it sounds conversational
