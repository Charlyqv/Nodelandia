FROM node:20-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias primero para aprovechar el caché de Docker
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto de la API
EXPOSE 3000

# Usar el modo watch nativo de Node 20 para recargar en desarrollo (o usar nodemon si lo prefieres)
CMD ["npm", "run", "dev"]