# Use the official Node.js v20 image as the base image
FROM node:20

ENV NODE_ENV production

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

RUN --mount=type=cache,target=/usr/src/app/.npm \
  npm set cache /usr/src/app/.npm && \
  npm ci --only=production

RUN npm ci --only-production

RUN npm install -g npm@latest

RUN npm config set registry https://registry.npmjs.org/

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port on which the NestJS application will run
EXPOSE 3000

USER node

COPY --chown=node:node ./src/ .

# Command to run the NestJS application
CMD ["npm", "start"]
