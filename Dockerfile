# Usar Node.js LTS
FROM node:20-alpine

# Configurar diretório de trabalho
WORKDIR /app

# Copiar arquivos do projeto
COPY package*.json ./
COPY . .

# Instalar dependências e fazer build
RUN npm install
RUN npm run build

# Instalar e configurar Nginx
RUN apk add --no-cache nginx curl && \
    mkdir -p /run/nginx

# Configurar Nginx para SPA
RUN echo 'server { \
    listen 80; \
    root /app/dist; \
    index index.html; \
    \
    # Gzip \
    gzip on; \
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript; \
    \
    # SPA routing \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    # Health check \
    location /health { \
        access_log off; \
        return 200 "healthy\n"; \
        add_header Content-Type text/plain; \
    } \
}' > /etc/nginx/http.d/default.conf

# Expor porta
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Script de inicialização
COPY <<EOF /start.sh
#!/bin/sh
nginx -g 'daemon off;'
EOF

RUN chmod +x /start.sh

# Comando para iniciar
CMD ["/start.sh"]
