# ========== STAGE 1: Builder ==========
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install ALL dependencies 
RUN npm ci

# Convert next.config.ts to next.config.js
RUN npx tsc next.config.ts --outDir . --module commonjs --target es5 --allowJs false && \
      mv next.config.js next.config.build.js || true

# Copy source
COPY . .

# Build Next.js app
RUN npm run build

# ========== STAGE 2: Production ==========
FROM node:20-alpine AS production

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy package files
COPY package.json package-lock.json ./

# Install ONLY production dependencies
RUN npm ci --only=production

# Copy built app from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts 
COPY --from=builder /app/.next/static ./.next/static

# Create non-root user
RUN addgroup -g 1001 -S nodegroup && \
    adduser -S nodeuser -u 1001 -G nodegroup && \
    chown -R nodeuser:nodegroup /app

# Switch to non-root user
USER nodeuser

# Expose port
EXPOSE 3000

# Start Next.js in production mode
CMD ["npm", "start"]


