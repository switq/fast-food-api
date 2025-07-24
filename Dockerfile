# Production Dockerfile
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Instalar dependências do sistema necessárias para o Prisma
RUN apk add --no-cache openssl && \
    apk upgrade --no-cache

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar o resto do código
COPY . .

# Build stage (if you have a build step)
RUN npm run build

# Production stage
FROM node:22-alpine AS production

WORKDIR /usr/src/app

# Instalar dependências do sistema necessárias para o Prisma
RUN apk add --no-cache openssl && \
    apk upgrade --no-cache

# Copiar package files
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --only=production && npm cache clean --force

# Copiar código compilado do builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

# Expor a porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
