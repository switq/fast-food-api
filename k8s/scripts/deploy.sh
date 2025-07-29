#!/bin/bash

# Script para deploy da aplicação Fast Food API no Kubernetes
# PostgreSQL é externo - não é deployado no cluster
set -e

echo "🚀 Iniciando deploy da Fast Food API no Kubernetes..."

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

# Build da imagem Docker
echo "🔨 Buildando imagem Docker..."
docker build -t fast-food-api:latest .

# Aplicar base
echo "📦 Aplicando recursos base..."
kubectl apply -k base/

# Aplicar networking
echo "🌐 Configurando networking..."
kubectl apply -f networking/network-policy.yaml
kubectl apply -f networking/ingress.yaml

# Aplicar scaling
echo "📈 Configurando auto-scaling..."
kubectl apply -f scaling/hpa.yaml

# Aguardar aplicação estar pronta
echo "⏳ Aguardando aplicação estar pronta..."
kubectl wait --for=condition=ready pod -l app=fast-food-api -n fast-food-api --timeout=300s

echo "✅ Deploy concluído com sucesso!"
echo ""
echo "📊 Status dos recursos:"
kubectl get all -n fast-food-api

echo ""
echo "🌐 Para acessar a aplicação:"
echo "1. Adicione 'fast-food-api.local' ao seu /etc/hosts"
echo "2. Acesse: http://fast-food-api.local"
echo ""
echo "📈 Para verificar o HPA:"
echo "kubectl get hpa -n fast-food-api"
echo ""
echo "📝 Para ver logs:"
echo "kubectl logs -f deployment/fast-food-api-deployment -n fast-food-api"
echo ""
echo "⚠️  IMPORTANTE: Certifique-se de que o DATABASE_HOST no configmap.yaml"
echo "   está configurado com o host do seu PostgreSQL externo."