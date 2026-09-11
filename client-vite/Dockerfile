FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

# Vite requiere exponer el host para ser accesible desde fuera del contenedor
CMD ["npm", "run", "dev", "--", "--host"]