# Use a Node.js base image
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install --production

# Copy the entire app directory to the working directory
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the port that the app will listen on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
