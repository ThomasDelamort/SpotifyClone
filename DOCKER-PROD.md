# Production Docker

An optimized, single-image deployment: the Vite frontend is built to static files
and served by the Express backend, so the whole app runs behind **one port (5000)** —
API, SPA, and Socket.io all same-origin. A `mongo:7` container holds the data.

## 1. Configure

Copy the env template to a root `.env` (docker compose reads it automatically):

```
cp .env.docker.example .env
```

Fill in your Clerk keys, admin email, and Cloudinary values. Note the Clerk publishable
key appears twice on purpose — once as `VITE_CLERK_PUBLISHABLE_KEY` (baked into the SPA at
build time) and once as `CLERK_PUBLISHABLE_KEY` (used by the API at runtime). They're the
same value. You do **not** set `MONGODB_URI` — the compose file points the app at the
bundled Mongo automatically.

## 2. Build & run

From the repo root:

```
docker compose -f docker-compose.prod.yml up --build
```

Open **http://localhost:5000**. Stop with `Ctrl+C`; `docker compose -f docker-compose.prod.yml down`
removes the containers (add `-v` to also wipe the database volume).

## 3. Seed the database (optional)

The bundled Mongo starts empty. Run any seed inside the running app container:

```
docker compose -f docker-compose.prod.yml exec app node src/seed/albums.js
docker compose -f docker-compose.prod.yml exec app node src/seed/upAllNight.js
docker compose -f docker-compose.prod.yml exec app npm run backfill:artists
```

Data persists in the `mongo-data` volume across restarts.

## Notes

- **Rebuild after code changes.** This is a production image (no hot reload) — re-run with
  `--build` to pick up edits.
- **Changed the Clerk key?** It's compiled into the frontend, so rebuild (`--build`) for it
  to take effect; a plain restart won't.
- **Accessing at localhost:5000 is what makes it work out of the box.** The frontend's API and
  socket URLs point at `http://localhost:5000`, which is same-origin when you open the app on
  port 5000. To deploy on a real domain, make those URLs relative (`/api` and same-origin for
  the socket) and update the CORS origins in `index.js` / `lib/socket.js` — ask and I'll wire
  that env-driven.
- **Images are multi-arch** (`node:22-alpine`, `mongo:7`), so this builds natively on Apple
  Silicon too.
