FROM node:16
ENV NODE_ENV=development
WORKDIR /app
COPY package.json .
RUN npm install pm2@latest -g
RUN npm install production
COPY . .
RUN npm run build
RUN pm2 start /app/dist/server.js --name shiphire