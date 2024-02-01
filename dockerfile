# Use the official Node.js v20 image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json ./

RUN npm install -g npm@latest

# RUN npm config set registry https://registry.npmjs.org/

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port on which the NestJS application will run
EXPOSE 3000

# Command to run the NestJS application
CMD ["npm", "start"]
