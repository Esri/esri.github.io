# Stage 1: Build stage
FROM node:14

# Set a working directory
WORKDIR /app

# Clone the Git repository
RUN git clone https://github.com/Esri/esri.github.io .

# Install `serve` globally
RUN npm install -g serve

# Expose port 5000 for the `serve` command
EXPOSE 5000

# Start the `npx serve` command when the container runs
CMD ["npx", "serve", "-s"]
