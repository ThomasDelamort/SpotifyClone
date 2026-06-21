FROM node:22-alpine
WORKDIR /app

# install deps first for better layer caching
COPY package*.json ./
RUN npm install

COPY ../../Users/User/Downloads/files .

EXPOSE 5000

# default (production-style) start; compose overrides this with `npm run dev` for hot reload
CMD ["node", "src/index.js"]
