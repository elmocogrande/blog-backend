FROM node:20

WORKDIR /app

# Copy package files and install dependencies to leverage Docker cache
COPY package-lock.json package.json ./
RUN npm ci --only=production

# Copy the rest of the application source code
COPY . .

CMD ["npm", "start"]