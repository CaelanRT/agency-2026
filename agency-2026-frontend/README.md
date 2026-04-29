# Procurement Risk Radar Frontend

Vite + React frontend for the Alberta procurement risk demo.

## Environment

Create a local `.env` file from `.env.example`:

```bash
VITE_API_BASE_URL=http://localhost:3001
```

For production, set `VITE_API_BASE_URL` to your deployed backend URL, for example:

```bash
VITE_API_BASE_URL=https://your-api.onrender.com
```

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Vite in this repo requires Node `20.19+` or `22.12+`.

## Deployment

- Frontend: Vercel
- Backend: Render web service
- Database: Render Postgres

Set `VITE_API_BASE_URL` in Vercel to your Render backend URL.
