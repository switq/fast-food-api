#!/bin/bash

# Script para testar os endpoints da aplicação Fast Food API
set -e

echo "🧪 Testando endpoints da Fast Food API..."

# Aguardar um pouco para garantir que a aplicação está pronta
sleep 10

# Obter o IP do ingress
INGRESS_IP=$(kubectl get ingress fast-food-api-ingress -n fast-food-api -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "localhost")

# Se não conseguir obter o IP, usar localhost
if [ -z "$INGRESS_IP" ] || [ "$INGRESS_IP" = "localhost" ]; then
    BASE_URL="http://fast-food-api.local"
else
    BASE_URL="http://$INGRESS_IP"
fi

echo "🌐 Testando endpoints em: $BASE_URL"

# Testar health check
echo "✅ Testando health check..."
curl -f "$BASE_URL/health" || echo "❌ Health check falhou"

# Testar API docs
echo "📚 Testando API docs..."
curl -f "$BASE_URL/api-docs" || echo "❌ API docs falhou"

# Testar categorias
echo "📂 Testando endpoint de categorias..."
curl -f "$BASE_URL/api/categories" || echo "❌ Categorias falhou"

# Testar produtos
echo "🍔 Testando endpoint de produtos..."
curl -f "$BASE_URL/api/products" || echo "❌ Produtos falhou"

# Testar clientes
echo "👥 Testando endpoint de clientes..."
curl -f "$BASE_URL/api/customers" || echo "❌ Clientes falhou"

# Testar pedidos
echo "📋 Testando endpoint de pedidos..."
curl -f "$BASE_URL/api/orders" || echo "❌ Pedidos falhou"

echo "✅ Testes concluídos!"
echo ""
echo "📊 Status dos pods:"
kubectl get pods -n fast-food-api

echo ""
echo "📈 Status do HPA:"
kubectl get hpa -n fast-food-api 