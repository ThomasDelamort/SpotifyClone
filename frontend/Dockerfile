# syntax=docker/dockerfile:1
#
# Frontend image. Two targets:
#   target: dev   -> vite dev server + HMR on :3000, source bind-mounted by compose
#   target: prod  -> nginx on :80 serving the built SPA and reverse-proxying
#                    /api + /socket.io to the backend container (single origin,
#                    so no CORS and no API-URL config in the app code)

# ---------- base ----------
FROM node:22-alpine AS base
WORKDIR /app

# ---------- dev ----------
FROM base AS dev
ENV NODE_ENV=development
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ---------- build ----------
# No NODE_ENV=production here: `npm run build` is `tsc -b && vite build`, which
# needs the devDependencies.
FROM base AS build
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Vite inlines env vars at BUILD time, so the Clerk key must be present now.
# main.tsx throws "Missing Publishable Key" at runtime if this is empty.
ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
RUN npm run build

# ---------- prod ----------
FROM nginx:1.29-alpine AS prod
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -qO- http://127.0.0.1/healthz || exit 1
