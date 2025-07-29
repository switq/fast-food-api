#!/bin/bash

# Script para deploy da aplicação Fast Food API no Kubernetes
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

# Criar namespace
echo "📦 Criando namespace..."
kubectl apply -f namespace.yaml

# Aplicar ConfigMap e Secrets
echo "🔐 Aplicando ConfigMap e Secrets..."
kubectl apply -f configmap.yaml
kubectl apply -f secrets.yaml

# Deploy do PostgreSQL
echo "🗄️ Deployando PostgreSQL..."
kubectl apply -f postgres-pv.yaml
kubectl apply -f postgres-deployment.yaml
kubectl apply -f postgres-service.yaml

# Aguardar PostgreSQL estar pronto
echo "⏳ Aguardando PostgreSQL estar pronto..."
kubectl wait --for=condition=ready pod -l app=postgres -n fast-food-api --timeout=300s

# Deploy da aplicação
echo "🔄 Deployando aplicação..."
kubectl apply -f app-deployment.yaml
kubectl apply -f app-service.yaml

# Aplicar Ingress
echo "🌐 Configurando Ingress..."
kubectl apply -f ingress.yaml

# Aplicar HPA
echo "📈 Configurando HPA..."
kubectl apply -f hpa.yaml

# Aplicar Network Policies
echo "🔒 Aplicando Network Policies..."
kubectl apply -f network-policy.yaml
kubectl apply -f postgres-network-policy.yaml

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