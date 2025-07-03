FROM node:18-alpine

WORKDIR /usr/src/app

# Instalar dependências do sistema necessárias para o Prisma
RUN apk add --no-cache openssl

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm install

# Copiar o resto do código
COPY . .

# Expor a porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "dev"]