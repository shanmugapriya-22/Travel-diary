# Use Node.js 20 image
FROM node:20

# Set the working directory inside the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json . 

# Install the dependencies
RUN npm install

# Copy the rest of the files from your project into the container
COPY . .

# Expose the port that Vite will run on
EXPOSE 5173

# Start the Vite development server
CMD ["npm", "run", "dev"]
