# ----------- Base image -----------
    FROM node:20-alpine

    # Create app directory
    WORKDIR /app
    
    # Copy dependency files first (for caching)
    COPY package*.json ./
    
    # Install only production dependencies
    RUN npm install --production
    
    # Copy source code
    COPY src ./src
    
    # Expose app port
    EXPOSE 5000
    
    # Run app
    CMD ["node", "src/server.js"]
    