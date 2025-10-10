# Use a Node image that matches your target (Node 22 LTS)
FROM node:22-alpine AS base

# Set working directory
WORKDIR /usr/src/app

# Copy package files first (for caching)
COPY package.json pnpm-lock.yaml ./

# Install dependencies (pnpm)
RUN npm install -g pnpm \
  && pnpm install --frozen-lockfile

# Copy the rest of the app
COPY . .

# Expose port
EXPOSE 3000

# Default command (development)
CMD ["pnpm", "dev"]
