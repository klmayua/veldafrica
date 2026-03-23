# Build stage
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the app
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production stage - nginx
FROM nginx:alpine AS runner

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Next.js files
COPY --from=builder /app/.next /usr/share/nginx/html

# Copy public assets to root level
COPY --from=builder /app/public/partners /usr/share/nginx/html/partners
COPY --from=builder /app/public/favicon.ico /usr/share/nginx/html/favicon.ico
COPY --from=builder /app/public/icon-192.png /usr/share/nginx/html/icon-192.png
COPY --from=builder /app/public/icon-512.png /usr/share/nginx/html/icon-512.png

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
