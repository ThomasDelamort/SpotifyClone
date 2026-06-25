<p align="center">
  <img src="./frontend/public/spotify.png" alt="App logo" width="120" height="120" />
</p>

<h1 align="center">Spotify Clone</h1>
<p align="center"><em>The Full-Stack Music Streaming App</em></p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB"  alt=""/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white"  alt=""/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white"  alt=""/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white"  alt=""/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white"  alt=""/>
  <img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white"  alt=""/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white"  alt=""/>
  <img src="https://img.shields.io/badge/Clerk-6C47FF?style=flat-square&logo=clerk&logoColor=white" alt=""/>
  <img src="https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socketdotio&logoColor=white" alt=""/>
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white" alt=""/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt=""/>
</p>

A full-stack music streaming app: browse albums, stream songs through a persistent player with
a queue, search the catalog, see what other listeners are playing in real time, and manage
everything from an admin dashboard.

The project is split into two packages:

- **`frontend/`** — React 19 + TypeScript single-page app (Vite)
- **`backend/`** — Express 5 REST API + Socket.io server (MongoDB)

---

## Features

- **Music playback** — global audio player with a queue, play/pause, next/previous, and **shuffle**. The previous button is context-aware: it restarts the current song if you're more than 3 seconds in, otherwise it jumps to the previous track. Driven by a Zustand store so playback persists across navigation.
- **Browse** — home page with _Featured_, _Made For You_, and _Trending_ sections, plus dedicated album pages.
- **Search** — search songs, albums, and artists from the top bar; typing routes to a results page grouped by type.
- **Artists** — artists are first-class entities with their own records. A song can credit **multiple artists**, so featured/collaborating artists are linked rather than buried in a single text field.
- **Friends Activity** — a real-time sidebar showing which users are online and what they're listening to, powered by Socket.io presence.
- **Authentication** — Clerk handles sign-in (OAuth) on the client; the API validates every protected request against the Clerk session.
- **Admin dashboard** — create and delete songs, albums, and artists, with image/audio uploads stored on Cloudinary, plus catalog stats (total songs, albums, users, artists). Access is gated to a single configured admin email.

> Real-time messaging (1:1 chat) was removed from the app. Socket.io now powers presence and Friends Activity only.

---

## Tech stack

**Frontend**

- React 19, TypeScript, Vite
- Tailwind CSS v4
- Zustand (state), Axios (HTTP), `socket.io-client` (real-time)
- React Router v7
- Clerk (`@clerk/clerk-react`) for auth
- Radix UI / Base UI primitives, Lucide & Phosphor icons, react-hot-toast

**Backend**

- Node.js, Express 5
- MongoDB via Mongoose 9
- Clerk (`@clerk/express`) for auth & admin checks
- Socket.io for real-time presence
- Cloudinary for media storage, `express-fileupload` for uploads
- CORS, dotenv

---

## Project structure

```
backend/
  src/
    controller/    admin, album, artist, auth, search, song, stat, user
    models/        song, album, artist, user
    routes/        admin, album, artist, auth, search, song, stat, user
    middleware/    auth (protectRoute, requireAdmin)
    lib/           db, cloudinary, socket
    seed/          albums.js (songs + albums), artists.js, importLinked.js
    index.js       app entry — Express + HTTP server + Socket.io

frontend/
  src/
    pages/         home, album, admin, search, auth-callback
    layout/        MainLayout + AudioPlayer, PlaybackControls, LeftSideBar, FriendsActivity
    stores/        useAuthStore, useMusicStore, usePlayerStore, useChatStore (presence), useSearchStore
    components/     TopBar (with search), UI primitives, skeletons
    provider/      AuthProvider (wires Clerk token into Axios + boots socket)
    lib/           axios, utils
    types/         shared TypeScript interfaces
```

---

## Prerequisites

- Node.js 18+ and npm
- A MongoDB database (local or Atlas)
- A [Clerk](https://clerk.com) application (publishable + secret keys)
- A [Cloudinary](https://cloudinary.com) account (for admin uploads)
- _(Optional)_ Docker + Docker Compose, for the containerized setup

---

## Environment variables

`.env` files are git-ignored, so a fresh clone won't include them — copy the provided
`.env.example` in each package and fill in your values.

**`backend/.env`**

| Variable                | Description                                              |
| ----------------------- | -------------------------------------------------------- |
| `PORT`                  | Port the API listens on (e.g. `5000`)                    |
| `MONGODB_URI`           | MongoDB connection string                                |
| `ADMIN_EMAIL`           | Email of the user granted admin access                   |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key                                    |
| `CLERK_SECRET_KEY`      | Clerk secret key                                         |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name                                    |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                                       |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret                                    |
| `NODE_ENV`              | `development` or `production` (controls error verbosity) |

**`frontend/.env`**

| Variable                     | Description                                           |
| ---------------------------- | ----------------------------------------------------- |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (same Clerk app as the backend) |

> **Heads up on the Clerk keys:**
>
> - The **backend needs both** `CLERK_PUBLISHABLE_KEY` _and_ `CLERK_SECRET_KEY`. Missing the
>   publishable key makes the Clerk middleware throw, and **every** API route returns `500`.
> - On the **frontend**, the variable **must** start with `VITE_` — Vite ignores any env var
>   without that prefix, so a bare `CLERK_PUBLISHABLE_KEY` won't be picked up.
> - The publishable key (`pk_...`) is the **same value** in both files, just under different
>   names. Only the secret key (`sk_...`) must be kept private.

---

## Getting started

Run the backend and frontend in two terminals.

**1. Backend**

```bash
cd backend
npm install
cp .env.example .env   # then fill it in
npm run dev            # nodemon on src/index.js
```

The API serves from `http://localhost:<PORT>` (the frontend expects `5000`).

**2. Frontend**

```bash
cd frontend
npm install
cp .env.example .env   # then fill it in
npm run dev            # Vite dev server on http://localhost:3000
```

The dev server is fixed to port **3000**, which matches the CORS and Socket.io origin the
backend allows. The Axios client points at `http://localhost:5000/api`, so keep the backend
on port `5000` in development (or update `frontend/src/lib/axios.ts` and the origins in
`backend/src/index.js` and `backend/src/lib/socket.js` together).

> Vite reads `.env` **only at startup** — after editing it, stop and restart `npm run dev`.
> Note that `.env.local` (and `.env.development`) **override** `.env` in Vite, so a stale or
> empty value there will win over a correct `.env`.

**3. Seed the database (optional)**

```bash
cd backend
npm run seed:albums      # inserts sample songs and albums
npm run backfill:artists # creates Artist records and links songs/albums to them
```

> `seed/albums.js` populates both songs and albums. The `seed:songs` script listed in
> `package.json` has no matching file, so use `seed:albums` for sample data.

---

## Run with Docker

A development stack (hot-reloading backend + frontend, and an optional local MongoDB) is
provided and works the same on Windows, macOS, and Linux. From the repo root:

```bash
docker compose up --build
```

Frontend → `http://localhost:3000`, backend → `http://localhost:5000`. The same `backend/.env`
and `frontend/.env` are used. See **`DOCKER.md`** for per-OS prerequisites, choosing between the
bundled MongoDB and Atlas, and seeding inside the container.

---

## npm scripts

**Backend**

| Script                     | Action                                      |
| -------------------------- | ------------------------------------------- |
| `npm run dev`              | Start the API with nodemon                  |
| `npm run seed:albums`      | Seed sample songs + albums                  |
| `npm run backfill:artists` | Create Artist records and link songs/albums |

**Frontend**

| Script            | Action                                |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Start the Vite dev server (port 3000) |
| `npm run build`   | Type-check and build for production   |
| `npm run preview` | Preview the production build          |
| `npm run lint`    | Run ESLint                            |

---

## API reference

All routes are prefixed with `/api`. Auth column: **Public**, **Auth** (signed-in Clerk user),
or **Admin** (signed-in user whose email matches `ADMIN_EMAIL`).

| Method   | Endpoint                   | Auth   | Description                                             |
| -------- | -------------------------- | ------ | ------------------------------------------------------- |
| `POST`   | `/auth/callback`           | Public | Create the Mongo user record after Clerk sign-in        |
| `GET`    | `/users`                   | Auth   | List all users except the caller (for Friends Activity) |
| `GET`    | `/songs`                   | Admin  | All songs                                               |
| `GET`    | `/songs/featured`          | Public | 6 random songs                                          |
| `GET`    | `/songs/made-for-you`      | Public | 4 random songs                                          |
| `GET`    | `/songs/trending`          | Public | 4 random songs                                          |
| `GET`    | `/albums`                  | Public | All albums                                              |
| `GET`    | `/albums/:albumId`         | Public | One album with its songs populated                      |
| `GET`    | `/artists`                 | Public | All artists                                             |
| `GET`    | `/artists/:artistId`       | Public | One artist with their songs and albums                  |
| `GET`    | `/search?q=`               | Public | Search songs, albums, and artists by query              |
| `GET`    | `/stats`                   | Admin  | Catalog totals (songs, albums, users, artists)          |
| `GET`    | `/admin/check`             | Admin  | Verify the caller is an admin                           |
| `POST`   | `/admin/songs`             | Admin  | Create a song (multipart: `audioFile`, `imageFile`)     |
| `DELETE` | `/admin/songs/:id`         | Admin  | Delete a song                                           |
| `POST`   | `/admin/albums`            | Admin  | Create an album (multipart: `imageFile`)                |
| `DELETE` | `/admin/albums/:id`        | Admin  | Delete an album and its songs                           |
| `POST`   | `/admin/artists`           | Admin  | Create an artist                                        |
| `DELETE` | `/admin/artists/:artistId` | Admin  | Delete an artist                                        |

A song's `artist` field is an **array of names**, with an optional matching array of
`artistId` references to Artist records. Albums keep a single `artist` string with an optional
`artistId`.

### Socket.io events

Presence is exchanged over Socket.io (`backend/src/lib/socket.js`).

- **Client → server:** `user_connected` (userId), `update_activity` (`{ userId, activity }`)
- **Server → client:** `users_online`, `activities`, `user_connected`, `user_disconnected`, `activity_updated`

---

## Troubleshooting

**Every API call returns `500` with `"Publishable key is missing"`** — `backend/.env` is
missing `CLERK_PUBLISHABLE_KEY`. The backend's Clerk middleware needs **both** the publishable
and secret keys; add the `pk_...` value (the same one the frontend uses) and restart.

**Blank screen, or `"Publishable key is missing"` shown in the UI** — `frontend/.env` is
missing `VITE_CLERK_PUBLISHABLE_KEY`, or the variable name lacks the `VITE_` prefix. Fix it and
**restart the dev server** (Vite only reads env at startup).

**Edited `.env` but nothing changed** — restart the dev server. Also check for a `.env.local`
in the same folder: in Vite it overrides `.env`, so an empty/placeholder value there wins.

**`MONGODB_URI undefined` / "uri must be a string"** — the key is missing or misspelled in
`backend/.env`. The code reads exactly `MONGODB_URI`.

**MongoDB `bad auth : authentication failed` (Atlas error 8000)** — wrong DB password, a
leftover `<password>` placeholder, or special characters that aren't URL-encoded. Easiest fix:
set an alphanumeric password in Atlas → Database Access, then paste it into the connection
string.

**MongoDB TLS handshake error / `SSL alert number 80`** — a network issue reaching Atlas.
Add your current machine's IP under Atlas → Network Access, or test on another network
(e.g. a phone hotspot) to confirm.

**`mongo:27017` won't resolve** — that hostname only works **inside** Docker Compose. Running
natively, use `mongodb://127.0.0.1:27017/...` (local) or your Atlas string.

**Docker: `permission denied` on the daemon socket** — add your user to the `docker` group
(`sudo usermod -aG docker $USER`, then log out/in, or `newgrp docker` for the current shell),
or prefix commands with `sudo`.

---

## Roadmap

Completed:

- ✅ **Artist model** — `artist` promoted to a first-class entity, with songs supporting multiple artists.
- ✅ **Search** — across songs, albums, and artists, from the top bar.
- ✅ **Player upgrades** — shuffle, and a previous button that restarts the current song before skipping back.

Planned, in suggested build order:

1. **Admin add-flow redesign** — including a UI for creating artists.
2. **Left sidebar redesign.**
3. **User playlists** — create playlists and add songs.
4. **Now-playing right sidebar** — a Spotify-style panel for the current song.
5. **Artist page** — a `/artists/:id` page so artist results in search become clickable.

---

## Credits

This project was built by following **Codesistency**'s (Burak Orkmez) full tutorial,
**"Advanced Spotify Clone: Build & Deploy a MERN Stack Spotify Application with React.js"** —
the code here closely follows the video step by step. Full credit for the original design and
implementation goes to the author.

- Tutorial video: https://youtu.be/4sbklcQ0EXc
- Channel: [Codesistency](https://www.youtube.com/@codesistency)
- Original source code: [github.com/burakorkmez/realtime-spotify-clone](https://github.com/burakorkmez/realtime-spotify-clone)

Changes made on top of the original are my own — removing the real-time chat feature, the
artist model with multi-artist support, search, the player upgrades (shuffle + smart previous),
Docker containerization, and the remaining roadmap items.

---

## License

ISC (see `backend/package.json`).
