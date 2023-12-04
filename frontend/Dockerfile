# Use an official Node.js runtime as a base image
FROM node

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the remaining application code to the working directory
COPY . .

# Expose the port that your frontend application will run on
EXPOSE 3000

# Define the command to run your application
CMD ["npm", "start"]


LABEL authors="vicky"
