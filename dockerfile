# ============================================
# Base
# ============================================
FROM node:22-alpine AS base

WORKDIR /app


# ============================================
# Dependencies
# ============================================
FROM base AS deps

COPY package.json package-lock.json ./

RUN npm ci


# ============================================
# Build
# ============================================
FROM deps AS builder

COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TanStack Start
RUN npm run build


# ============================================
# Production
# ============================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

COPY package.json package-lock.json ./

# Production dependencies only
RUN npm ci --omit=dev

# Prisma generated client
COPY --from=builder /app/generated ./generated

# TanStack Start production build
COPY --from=builder /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]