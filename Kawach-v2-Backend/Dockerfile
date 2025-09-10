# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Temporarily set NODE_ENV to development to install dev dependencies
ENV NODE_ENV=development
RUN npm ci

# Copy the rest of the application code and run the build script
COPY . .
RUN npm run build

# Stage 2: Create a lightweight production image
FROM node:18-alpine

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Expose port 8080 for the application
EXPOSE 8080


# Start the Node.js application
CMD ["node", "dist/index.js"]
