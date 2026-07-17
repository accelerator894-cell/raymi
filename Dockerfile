# --------构建阶段--------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN ./node_modules/.bin/vite build && \
./node_modules/.bin/esbuild api/boot.ts --platform=node --bundle --format=esm --outdir=dist

# --------运行阶段--------
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# 拷贝构建产物与数据库脚本
COPY --from=builder /app/dist ./dist
COPY db ./db
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/trpc/ping > /dev/null || exit 1

CMD ["./docker-entrypoint.sh"]
