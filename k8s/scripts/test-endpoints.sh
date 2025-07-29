#!/bin/bash

# Script para testar endpoints da Fast Food API
set -e

echo "🧪 Testando endpoints da Fast Food API..."

# Verificar se o kubectl está configurado
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl não encontrado. Por favor, instale o kubectl."
    exit 1
fi

# Verificar se o namespace existe
if ! kubectl get namespace fast-food-api &> /dev/null; then
    echo "❌ Namespace fast-food-api não encontrado."
    echo "Execute o deploy primeiro: ./scripts/deploy.sh"
    exit 1
fi

# Aguardar aplicação estar pronta
echo "⏳ Aguardando aplicação estar pronta..."
kubectl wait --for=condition=ready pod -l app=fast-food-api -n fast-food-api --timeout=300s

# Port forward para acessar a aplicação
echo "🔗 Configurando port forward..."
kubectl port-forward service/fast-food-api-service 8080:80 -n fast-food-api &
PF_PID=$!

# Aguardar port forward estar pronto
sleep 5

# Função para limpar port forward
cleanup() {
    echo "🧹 Limpando port forward..."
    kill $PF_PID 2>/dev/null || true
}

# Registrar cleanup para ser executado no exit
trap cleanup EXIT

echo ""
echo "🧪 Testando endpoints..."
echo ""

# Teste de health check
echo "1. Health Check:"
curl -s http://localhost:8080/health | jq . || echo "Health check falhou"

echo ""
echo "2. Testando endpoints da API:"
echo ""

# Teste de categorias
echo "📋 Categorias:"
curl -s http://localhost:8080/categories | jq . || echo "Falha ao buscar categorias"

echo ""
echo "🍔 Produtos:"
curl -s http://localhost:8080/products | jq . || echo "Falha ao buscar produtos"

echo ""
echo "👥 Clientes:"
curl -s http://localhost:8080/customers | jq . || echo "Falha ao buscar clientes"

echo ""
echo "📦 Pedidos:"
curl -s http://localhost:8080/orders | jq . || echo "Falha ao buscar pedidos"

echo ""
echo "✅ Testes concluídos!"
echo ""
echo "💡 Para testar manualmente:"
echo "curl http://localhost:8080/health"
echo "curl http://localhost:8080/categories"
echo "curl http://localhost:8080/products"