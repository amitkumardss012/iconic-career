# ============================================
# Base
# ============================================
FROM node:22-alpine AS base

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.11.1 --activate


# ============================================
# Dependencies
# ============================================
FROM base AS deps

COPY package.json pnpm-lock.yaml ./

# Prisma schema is required by the postinstall script
COPY prisma ./prisma

RUN pnpm install --frozen-lockfile


# ============================================
# Build
# ============================================
FROM deps AS builder

COPY . .

# Generate Prisma Client explicitly
RUN pnpm prisma generate

# Build TanStack Start
RUN pnpm run build


# ============================================
# Production
# ============================================
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Dependencies
COPY --from=builder /app/node_modules ./node_modules

# Prisma generated client
COPY --from=builder /app/generated ./generated

# TanStack Start production build
COPY --from=builder /app/.output ./.output

COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]