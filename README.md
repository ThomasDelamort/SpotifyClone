<p align="center">
  <img src="./frontend/public/spotify.png" alt="App logo" width="120" height="120" />
</p>

<h1 align="center">Spotify Clone</h1>
<p align="center"><em>Full-Stack Music Streaming App</em></p>

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
</p>


The project is split into two packages:

- **`frontend/`** — React 19 + TypeScript single-page app (Vite)
- **`backend/`** — Express 5 REST API + Socket.io server (MongoDB)

---

## Features

- **Music playback** — global audio player with a queue, play/pause, and next/previous controls, driven by a Zustand store so playback persists across page navigation.
- **Browse** — home page with *Featured*, *Made For You*, and *Trending* sections, plus dedicated album pages.
- **Friends Activity** — a real-time sidebar showing which users are online and what they're currently listening to, powered by Socket.io presence.
- **Authentication** — Clerk handles sign-in (OAuth) on the client; the API validates every protected request against the Clerk session.
- **Admin dashboard** — create and delete songs and albums, with image/audio uploads stored on Cloudinary, plus catalog stats (total songs, albums, users, artists). Access is gated to a single configured admin email.

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
    controller/    admin, album, auth, song, stat, user
    models/        song, album, user
    routes/        admin, album, auth, song, stat, user
    middleware/    auth (protectRoute, requireAdmin)
    lib/           db, cloudinary, socket
    seed/          albums.js (seeds songs + albums)
    index.js       app entry — Express + HTTP server + Socket.io

frontend/
  src/
    pages/         home, album, admin, auth-callback
    layout/        MainLayout + AudioPlayer, PlaybackControls, LeftSideBar, FriendsActivity
    stores/        useAuthStore, useMusicStore, usePlayerStore, useChatStore (presence)
    components/     TopBar, UI primitives, skeletons
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

---

## Environment variables

**`backend/.env`**

| Variable | Description |
| --- | --- |
| `PORT` | Port the API listens on (e.g. `5000`) |
| `MONGODB_URI` | MongoDB connection string |
| `ADMIN_EMAIL` | Email of the user granted admin access |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `NODE_ENV` | `development` or `production` (controls error verbosity) |

**`frontend/.env`**

| Variable | Description |
| --- | --- |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (same app as the backend) |

---

## Getting started

Run the backend and frontend in two terminals.

**1. Backend**

```bash
cd backend
npm install
npm run dev          # nodemon on src/index.js
```

The API serves from `http://localhost:<PORT>` (the frontend expects `5000`).

**2. Frontend**

```bash
cd frontend
npm install
npm run dev          # Vite dev server on http://localhost:3000
```

The dev server is fixed to port **3000**, which matches the CORS and Socket.io origin the
backend allows. The Axios client points at `http://localhost:5000/api`, so keep the backend
on port `5000` in development (or update `frontend/src/lib/axios.ts` and the origins in
`backend/src/index.js` and `backend/src/lib/socket.js` together).

**3. Seed the database (optional)**

```bash
cd backend
npm run seed:albums  # inserts sample songs and albums
```

> `seed/albums.js` populates both songs and albums. The `seed:songs` script listed in
> `package.json` has no matching file, so use `seed:albums` for sample data.

---

## npm scripts

**Backend**

| Script | Action |
| --- | --- |
| `npm run dev` | Start the API with nodemon |
| `npm run seed:albums` | Seed sample songs + albums |

**Frontend**

| Script | Action |
| --- | --- |
| `npm run dev` | Start the Vite dev server (port 3000) |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

---

## API reference

All routes are prefixed with `/api`. Auth column: **Public**, **Auth** (signed-in Clerk user),
or **Admin** (signed-in user whose email matches `ADMIN_EMAIL`).

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/callback` | Public | Create the Mongo user record after Clerk sign-in |
| `GET` | `/users` | Auth | List all users except the caller (for Friends Activity) |
| `GET` | `/songs` | Admin | All songs |
| `GET` | `/songs/featured` | Public | 6 random songs |
| `GET` | `/songs/made-for-you` | Public | 4 random songs |
| `GET` | `/songs/trending` | Public | 4 random songs |
| `GET` | `/albums` | Public | All albums |
| `GET` | `/albums/:albumId` | Public | One album with its songs populated |
| `GET` | `/stats` | Admin | Catalog totals (songs, albums, users, artists) |
| `GET` | `/admin/check` | Admin | Verify the caller is an admin |
| `POST` | `/admin/songs` | Admin | Create a song (multipart: `audioFile`, `imageFile`) |
| `DELETE` | `/admin/songs/:id` | Admin | Delete a song |
| `POST` | `/admin/albums` | Admin | Create an album (multipart: `imageFile`) |
| `DELETE` | `/admin/albums/:id` | Admin | Delete an album and its songs |

### Socket.io events

Presence is exchanged over Socket.io (`backend/src/lib/socket.js`).

- **Client → server:** `user_connected` (userId), `update_activity` (`{ userId, activity }`)
- **Server → client:** `users_online`, `activities`, `user_connected`, `user_disconnected`, `activity_updated`

---

## Roadmap

Planned work, in suggested build order:

1. **Artist model** — promote `artist` from a string field to a first-class entity (prerequisite for the items below).
2. **Search** — across songs, artists, and albums.
3. **Admin add-flow redesign** — including creating artists.
4. **Left sidebar redesign.**
5. **User playlists** — create playlists and add songs.
6. **Player upgrades** — shuffle, and a back-button that restarts the current song before skipping to the previous track.

---

## Credits

This project was built by following **Codesistency**'s (Burak Orkmez) full tutorial,
**"Advanced Spotify Clone: Build & Deploy a MERN Stack Spotify Application with React.js"** —
the code here closely follows the video step by step. Full credit for the original design and
implementation goes to the author.

- Tutorial video: https://youtu.be/4sbklcQ0EXc
- Channel: [Codesistency](https://www.youtube.com/@codesistency)
- Original source code: [github.com/burakorkmez/realtime-spotify-clone](https://github.com/burakorkmez/realtime-spotify-clone)

Changes made on top of the original (e.g. removing the real-time chat feature, and the roadmap
items above) are my own.

---

## License

ISC (see `backend/package.json`).