FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY ../../Users/User/Downloads/files/mnt/user-data/outputs/containerize/frontend .

EXPOSE 3000

# vite dev server, bound to all interfaces so the host can reach it
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
