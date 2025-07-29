#!/bin/bash

# Script para build da imagem Docker e deploy da aplicação Fast Food API
set -e

echo "🔨 Iniciando build e deploy da Fast Food API..."

# Verificar se o Docker está rodando
if ! docker info &> /dev/null; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker."
    exit 1
fi

# Build da imagem Docker
echo "🐳 Fazendo build da imagem Docker..."
docker build -t fast-food-api:latest .

echo "✅ Build concluído!"

# Verificar se o kubectl está configurado
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl não encontrado. Por favor, instale o kubectl."
    exit 1
fi

# Verificar se o cluster está acessível
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Não foi possível conectar ao cluster Kubernetes."
    echo "Certifique-se de que o cluster está rodando e configurado."
    exit 1
fi

echo "✅ Cluster Kubernetes acessível"

# Executar deploy
echo "🚀 Executando deploy..."
cd k8s
./deploy.sh

echo "✅ Build e deploy concluídos com sucesso!"
echo ""
echo "🌐 Para acessar a aplicação:"
echo "1. Adicione 'fast-food-api.local' ao seu /etc/hosts"
echo "2. Acesse: http://fast-food-api.local"
echo ""
echo "📊 Para verificar o status:"
echo "kubectl get all -n fast-food-api" 