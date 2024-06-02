# Stage 1: Build stage
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Stage 2: Production
FROM node:18

RUN apt-get update && apt-get install -y ffmpeg

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app ./

EXPOSE 3000

# Install ts-node globally for running TypeScript files
RUN npm install -g ts-node

CMD ["ts-node", "src/index.ts"]