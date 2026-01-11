# ================================================================
# Multi-stage Dockerfile optimizado para producción
# Build React app con Vite + Nginx optimizado
# ================================================================

# ================================================================
# Etapa 1: Builder - Compilar aplicación React
# ================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Variables de entorno para el build
ARG VITE_API_URL=https://api.smartsolutionfl.com/api
ENV VITE_API_URL=$VITE_API_URL \
    CYPRESS_INSTALL_BINARY=0 \
    DISABLE_AWS_SDK=true \
    NODE_ENV=production

# Instalar dependencias del sistema
RUN apk add --no-cache python3 make g++

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci --ignore-scripts

# Copiar código fuente
COPY . .

# Build de producción
RUN npm run build

# Verificar que el build se generó correctamente
RUN ls -la /app/dist

# ================================================================
# Etapa 2: Production - Nginx optimizado
# ================================================================
FROM nginx:alpine

# Instalar curl para healthcheck
RUN apk add --no-cache curl

# Copiar build de la aplicación
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Crear usuario nginx si no existe y ajustar permisos
RUN chown -R nginx:nginx /usr/share/nginx/html \
    && chmod -R 755 /usr/share/nginx/html

# Exponer puertos
EXPOSE 80 443

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]