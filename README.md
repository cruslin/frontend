# Frontend + Backend Setup

This repository now contains:

- `src/` - the Next.js frontend
- `backend/` - the NestJS API that the frontend already targets

The frontend API client defaults to `http://localhost:4000/api`, and the backend is already configured to allow `http://localhost:3000` through `FRONTEND_URL`.

## Local Development

1. Install frontend dependencies:

```bash
npm install
```

2. Install backend dependencies:

```bash
npm run backend:install
```

3. Create local env files:

```bash
copy .env.local.example .env.local
copy backend\.env.example backend\.env
```

4. Update `backend/.env` with a working `DATABASE_URL` and any optional service keys you need.

5. Run the backend in one terminal:

```bash
npm run backend:dev
```

6. Run the frontend in another terminal:

```bash
npm run dev
```

Frontend: `http://localhost:3000`  
Backend: `http://localhost:4000/api`

## Backend Scripts

- `npm run backend:install`
- `npm run backend:dev`
- `npm run backend:start`
- `npm run backend:build`
- `npm run backend:test`
