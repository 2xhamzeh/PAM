# Use the official Node.js image as the base image
FROM node:22 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose port 8081
EXPOSE 8081

# Command to run the application using Vite's preview mode
CMD ["npm", "run", "preview", "--", "--port", "8081", "--host"]
