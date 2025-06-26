# Use Node 20.19.0 which satisfies vite requirements
FROM node:20.19.0-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.1 --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/
COPY packages/database/package.json packages/database/
COPY packages/shared/package.json packages/shared/
COPY packages/ui/package.json packages/ui/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY . .

# Build the application
RUN pnpm build

# Production stage
FROM node:20.19.0-alpine AS production
RUN corepack enable && corepack prepare pnpm@8.15.1 --activate

WORKDIR /app

# Copy built application
COPY --from=base /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=base /app/apps/web/package.json /app/apps/web/
COPY --from=base /app/apps/web/.next /app/apps/web/.next
COPY --from=base /app/apps/web/public /app/apps/web/public
COPY --from=base /app/packages /app/packages
COPY --from=base /app/node_modules /app/node_modules
COPY --from=base /app/apps/web/node_modules /app/apps/web/node_modules

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]