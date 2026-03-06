FROM node:18-slim
WORKDIR /app
COPY package*.json ./

# Forzamos la compilación limpia para Linux
RUN npm install

COPY . .
EXPOSE 3000
CMD ["node", "server.js"]