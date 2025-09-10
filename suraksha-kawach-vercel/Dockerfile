# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project files and build
COPY . .
RUN npm run build

# Stage 2: Run optimized production image
FROM node:20-alpine

WORKDIR /app

# Copy necessary files from builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Set environment
ENV NODE_ENV=production
EXPOSE 8080

# Start server on port 8080 (for Cloud Run)
CMD ["npm", "start"]
