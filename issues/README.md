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
- **13-14**: Polish and stretch goals - blocked by integration
