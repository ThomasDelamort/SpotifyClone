# syntax=docker/dockerfile:1
#
# Backend image — a pure JSON API (Express + Socket.io). It does NOT serve the
# SPA; the frontend image (nginx) owns static files and proxies /api + /socket.io
# here. Two targets:
#   target: dev   -> nodemon, full devDependencies, source bind-mounted by compose
#   target: prod  -> production deps only, non-root, healthchecked

# ---------- base ----------
FROM node:22-alpine AS base
WORKDIR /app
# tini reaps zombies and forwards SIGTERM, so `docker compose stop` is instant
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]
EXPOSE 5000

# ---------- production dependencies ----------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ---------- dev ----------
FROM base AS dev
ENV NODE_ENV=development
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# compose overrides this with `-L` (polling) so hot reload works over bind mounts
CMD ["npm", "run", "dev"]

# ---------- prod ----------
FROM base AS prod
ENV NODE_ENV=production
# --chown on COPY, not a `RUN chown -R` afterwards: the latter would rewrite
# every file into a second layer and roughly double the image size.
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json package-lock.json ./
COPY --chown=node:node src ./src
# express-fileupload buffers uploads through /app/tmp before pushing to Cloudinary
RUN install -d -o node -g node /app/tmp
USER node
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||5000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "src/index.js"]
