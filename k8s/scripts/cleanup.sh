#!/bin/bash

# Script para limpeza da aplicação Fast Food API no Kubernetes
# PostgreSQL é externo - não é afetado pela limpeza
set -e

echo "🧹 Iniciando limpeza da Fast Food API..."

# Deletar todos os recursos do namespace
echo "🗑️ Deletando recursos..."
kubectl delete namespace fast-food-api --ignore-not-found=true

echo "✅ Limpeza concluída!"
echo ""
echo "📝 Nota: Se você tem um banco PostgreSQL externo, ele não foi afetado por esta limpeza."