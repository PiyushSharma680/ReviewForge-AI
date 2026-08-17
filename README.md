# ReviewForge AI

Enterprise AI-powered code review, security analysis, and engineering telemetry platform.

## 1) What this project includes

ReviewForge AI ships as a full-stack monorepo:

- **Frontend**: Next.js 15 App Router dashboard and auth UI (`/client`)
- **Backend**: Express + TypeScript API with JWT auth, GitHub OAuth flow, queues, and real-time events (`/server`)
- **Data/Infra (local)**: MongoDB + Redis via Docker Compose

## 2) Core capabilities

- AI-assisted code review workflows
- Repository and review analytics dashboards
- Security and quality score visualizations
- JWT-based authentication (register/login/refresh/logout/me)
- GitHub OAuth login flow
- Realtime updates with Socket.IO

## 3) Tech stack

### Frontend (`client/`)
- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Axios + TanStack Query

### Backend (`server/`)
- Node.js + Express
- TypeScript
- MongoDB (Mongoose)
- Redis (ioredis + BullMQ)
- JWT + bcryptjs
- Winston + Morgan

## 4) Repository structure

```text
ReviewForge AI/
├─ client/              # Next.js frontend
├─ server/              # Express backend
├─ docker-compose.yml   # Local full-stack orchestration
└─ README.md
```

## 5) Prerequisites

- Node.js 20+
- npm 10+
- Docker Desktop (required for MongoDB + Redis + compose-based integration checks)

## 6) Environment configuration

### Backend

Copy and edit:

```bash
cp server/.env.example server/.env
```

Required for local startup:
- `MONGODB_URI`
- `REDIS_URL`
- `JWT_SECRET`
- `REFRESH_TOKEN_SECRET`
- `CLIENT_URL`

Required for GitHub OAuth flow:
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `GITHUB_CALLBACK_URL` (default: `http://localhost:5000/api/auth/github/callback`)

Optional AI providers:
- `OPENAI_API_KEY`
- `GEMINI_API_KEY`

### Frontend

Copy and edit:

```bash
cp client/.env.example client/.env.local
```

- `NEXT_PUBLIC_API_URL=http://localhost:5000/api`

## 7) Run locally

### Option A (recommended): full stack with Docker Compose

```bash
docker compose up -d --build
```

Services:
- Frontend: http://localhost:3000
- Backend API base: http://localhost:5000/api
- Health: http://localhost:5000/api/health

### Option B: run frontend/backend manually

Start backend:

```bash
cd server
npm install
npm run build
npm run dev
```

Start frontend in another terminal:

```bash
cd client
npm install
npm run dev
```

> Manual mode still requires MongoDB and Redis running locally.

## 8) Verification checklist (frontend → backend → integration → auth)

### Frontend checks

```bash
cd client
npm run build
```

Expected: successful Next.js production build.

### Backend checks

```bash
cd server
npm run build
```

Expected: successful TypeScript compile.

### Integration checks

1. Open frontend: `http://localhost:3000`
2. Check backend health:
   - `GET http://localhost:5000/api/health`
3. Navigate dashboard pages after auth:
   - `/dashboard`
   - `/dashboard/repos`
   - `/dashboard/review/new`

### Authentication checks

1. Register: `POST /api/auth/register`
2. Login: `POST /api/auth/login`
3. Current user: `GET /api/auth/me` with bearer token
4. Refresh token: `POST /api/auth/refresh`
5. Logout: `POST /api/auth/logout`
6. GitHub OAuth:
   - start from Login page → **Sign In with GitHub**
   - callback route: `/auth/github/callback`

## 9) Production readiness checklist

Before deployment:

- [ ] Replace all secrets and API keys with secure values
- [ ] Never commit `.env` files with real credentials
- [ ] Set `NODE_ENV=production`
- [ ] Restrict CORS `CLIENT_URL` to real frontend domain
- [ ] Use managed MongoDB/Redis with backups and monitoring
- [ ] Enable centralized logs and alerts
- [ ] Use HTTPS and secure reverse proxy (Nginx/Cloud LB)
- [ ] Run build checks in CI (`client build`, `server build`)
- [ ] Add end-to-end smoke tests for auth + dashboard critical paths

## 10) Available scripts

### Frontend (`client/package.json`)
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run type-check`

### Backend (`server/package.json`)
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

## 11) Troubleshooting

- **Docker compose cannot start**: ensure Docker Desktop daemon is running.
- **Backend connection errors** (`ECONNREFUSED 27017/6379`): MongoDB/Redis are not reachable.
- **401 responses**: verify `reviewforge_token` exists in browser localStorage and token is unexpired.
- **GitHub OAuth failure**: verify GitHub OAuth app redirect URI and server env keys.

## License

MIT License © 2026 ReviewForge AI Platform.
