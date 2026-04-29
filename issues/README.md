# Issues

Local kanban-style issue tracker for Procurement Risk Radar (Alberta MVP).

## Status Key

- `open` - Ready to be picked up
- `in-progress` - Currently being worked on
- `blocked` - Waiting on another issue
- `done` - Completed

## Dependency Layers

Issues are numbered by layer so agents can pick up unblocked work:

- **01-02**: Foundation (backend + frontend setup) - no blockers
- **03-05**: Core backend API endpoints - blocked by 01
- **06-09**: Core frontend components - blocked by 02
- **10-12**: Frontend-backend integration - blocked by respective API + component
- **13**: Core flow QA and polish - blocked by 10-12
- **16-17**: Agentic backend capabilities - blocked by core backend
- **18-19**: Agentic frontend components - blocked by frontend shell
- **20-21**: Agentic frontend-backend integration - blocked by respective backend + component
- **22**: End-to-end agentic flow polish - blocked by 20-21
