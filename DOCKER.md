# Running with Docker

The frontend and backend are **fully separate images and containers**. The
backend is a pure JSON API; it never serves static files. Everything runs the
same on Windows 11, macOS (Intel + Apple Silicon), and Linux.

| | Dev stack (`docker-compose.yml`) | Prod stack (`docker-compose.prod.yml`) |
| --- | --- | --- |
| Frontend | vite dev server + HMR, `:3000` | nginx serving the built SPA, `:8080` |
| Backend | nodemon, `:5000` (published) | `node src/index.js`, internal only |
| Browser → API | direct to `localhost:5000`, allowed by CORS | same-origin via nginx proxy, no CORS |
| Database | Atlas, or bundled Mongo via profile | Atlas, or bundled Mongo via profile |

In production nginx is the only public entry point:

```
browser :8080 ──▶ [frontend: nginx] ──┬── /            → built SPA (with SPA fallback)
                                      ├── /api/*       → [backend:5000]
                                      └── /socket.io/* → [backend:5000] (websocket)
                                                              │
                                                              ▼
                                                      MongoDB (Atlas or [mongo:27017])
```

Because the browser sees one origin, `frontend/src/lib/axios.ts` and
`useChatStore.ts` keep using relative `/api` and `/` URLs — no API-host config.

## 1. Prerequisites

| OS | What to install |
| --- | --- |
| Windows 11 | Docker Desktop (WSL2 backend) |
| macOS (Intel or Apple Silicon) | Docker Desktop |
| Linux | `docker` + the Compose plugin. Arch: `sudo pacman -S docker docker-compose`, then `sudo systemctl enable --now docker` and `sudo usermod -aG docker $USER` (re-login). |

Confirm with `docker compose version` (needs Compose v2.20+ for `required: false`).

## 2. Development

```bash
cp backend/.env.example  backend/.env       # fill in your keys
cp frontend/.env.example frontend/.env.local

docker compose up --build
```

- Frontend: http://localhost:3000
- Backend:  http://localhost:5000 (health check: `/api/health`)

Source is bind-mounted, so hot reload works both ways: nodemon restarts the API,
vite pushes HMR updates to the browser.

Stop with `Ctrl+C`, then `docker compose down` to remove containers.

## 3. Production

```bash
cp .env.docker.example .env                 # fill in your keys
docker compose -f docker-compose.prod.yml up --build
```

Open http://localhost:8080. The backend is not published to the host — add a
`ports:` entry to the `backend` service if you need to hit the API directly.

`VITE_CLERK_PUBLISHABLE_KEY` is inlined into the bundle at **build** time, so
changing it requires `up --build`, not just a restart.

## 4. Database

`backend/.env` currently points at MongoDB Atlas, so no database container runs
by default. To use a local MongoDB instead, enable the `local-db` profile:

```bash
docker compose --profile local-db up --build
```

...and set `MONGODB_URI=mongodb://mongo:27017/spotify-clone` in `backend/.env`
(dev) or the repo-root `.env` (prod).

> **MongoDB 5+ requires a CPU with AVX.** On older hardware the container dies
> with exit code 132. Set `MONGO_TAG=4.4` in the repo-root `.env` to use the
> last release that runs without AVX.

Seeding (bundled Mongo only):

```bash
docker compose exec backend npm run seed:albums
docker compose exec backend npm run backfill:artists
```

## 5. Image layout

Both Dockerfiles are multi-stage with named targets, so dev and prod build from
one file per service:

- `backend/Dockerfile` — `dev` (nodemon + devDependencies) and `prod`
  (production deps only, runs as the non-root `node` user, `HEALTHCHECK` on
  `/api/health`, `tini` as PID 1 for fast shutdown).
- `frontend/Dockerfile` — `dev` (vite), `build` (`tsc -b && vite build`), and
  `prod` (nginx + `frontend/nginx.conf`).

`frontend/nginx.conf` handles the SPA fallback, websocket upgrade headers,
gzip, and immutable caching for fingerprinted `/assets/`. It resolves the
backend through Docker's internal DNS per-request, so nginx still boots when the
backend is down and follows the backend's IP across restarts.

## Notes

- **Hot reload** uses polling (nodemon `-L`, `VITE_USE_POLLING=true`), required
  on Windows/macOS bind mounts and harmless on Linux.
- **`node_modules`** live in named volumes so host and container installs never
  collide. After changing dependencies: `docker compose up --build --force-recreate`,
  or `docker compose down -v` to drop the volumes entirely.
- **Secrets** stay out of images — every `.env` is listed in the per-service
  `.dockerignore`, and prod config is injected at runtime via compose.
- **Ports busy?** Set `WEB_PORT` / `API_PORT` in the repo-root `.env`.
- **Apple Silicon:** images are multi-arch and run natively on arm64. If a
  dependency lacks arm64 builds, add `platform: linux/amd64` to that service.
