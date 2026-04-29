# 23: Open-Ended Investigation Chat Agent

**Status:** open
**Priority:** high
**Blocked by:** 17, 22
**Blocks:** none

## Description

Expand the investigation copilot from a narrow, intent-matched demo flow into a grounded chat-style
agent that can handle broader procurement investigation questions over the existing dataset.

The goal is not to ship a generic chatbot. The goal is to support open-ended investigative queries
while keeping the system read-only, evidence-backed, and constrained to the procurement data that
already powers the dashboard.

## Scope

- Replace the current fixed `detectIntent(...)` routing with an agent orchestration flow
- Preserve the current evidence-backed response structure
- Add support for multi-turn investigation prompts in a chat-like UX
- Keep the first version grounded in backend tools over curated data access
- Do not give the model unrestricted database access

## Acceptance Criteria

- [ ] Backend accepts open-ended investigation questions beyond the current three hardcoded intents
- [ ] Backend uses a planner/tool-calling loop instead of only regex-style intent detection
- [ ] Agent is limited to read-only analysis over allowlisted data sources
- [ ] Agent responses remain grounded in retrieved data and include:
  - `answer`
  - `evidence`
  - `steps`
  - `next_steps`
  - tool calls or retrieved data references used to produce the answer
- [ ] The system supports at least one follow-up question in the same session without losing context
- [ ] Unsupported or underspecified questions return a clear, user-facing explanation instead of a generic failure
- [ ] Timeouts, tool failures, and model failures are surfaced cleanly in both API and UI
- [ ] The implementation includes logging or auditability for agent decisions and tool/query execution

## Backend Requirements

- [ ] Add an orchestration layer that can:
  - interpret the user question
  - choose one or more analysis tools
  - synthesize a grounded final answer
- [ ] Start with curated backend tools rather than direct SQL generation, such as:
  - `get_ministries`
  - `get_risk_scan`
  - `get_recipients(ministry)`
  - `compare_ministries(ministryA, ministryB)`
  - vendor or ministry lookup/search helpers as needed
- [ ] Limit tool-call count and payload size to keep latency bounded
- [ ] Return structured errors for:
  - unsupported question shape
  - missing context
  - no matching ministry/vendor found
  - backend tool failure
  - model failure

## SQL Tooling Follow-On

- [ ] Evaluate a second-phase SQL tool only after curated-tool orchestration is stable
- [ ] If SQL access is added, it must be constrained to:
  - `SELECT`-only queries
  - allowlisted tables or analytics views
  - row limits
  - timeouts
  - validation or parsing before execution
  - execution logging for debugging and review

## Frontend Requirements

- [ ] Evolve the investigation panel into a chat-style interaction model
- [ ] Show submitted question history and returned answers in chronological order
- [ ] Preserve visibility into evidence, steps, and suggested next steps for each answer
- [ ] Display explicit caveats about supported scope while the feature remains partially constrained
- [ ] Support retry and follow-up flows without forcing the user to re-open the panel or lose context

## Non-Goals

- [ ] No unrestricted natural-language-to-SQL against the raw database in the first version
- [ ] No write access or mutation tools
- [ ] No generic web-enabled research agent
- [ ] No unsupported claims that are not grounded in returned procurement data

## Notes

- The best first implementation is “agent over tools,” not “model loose on the database”
- If the SQL phase happens, prefer analytics views over raw tables so the model works with stable,
  documented shapes
- This issue should produce a more capable copilot without weakening the demo’s reliability
