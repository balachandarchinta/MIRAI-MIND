# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy configuration and source files required for compiling the project
COPY package*.json tsconfig.json vite.config.ts server.ts index.html ./
COPY src/ ./src/

# Install dependencies (including devDependencies)
RUN npm ci

# Compile the Vite client app and bundle the Express server into dist/
RUN NODE_ENV=production npm run build

# Stage 2: Run the application
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

# Set runtime environment
ENV NODE_ENV=production

# Copy compiled assets and server bundle from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/package-lock.json ./package-lock.json

# Install only production-level dependencies to minimize image size
RUN npm ci --omit=dev

# Expose standard port documentation
EXPOSE 8080

# Start the bundled production server
CMD ["npm", "run", "start"]
