#!/bin/bash

# Script para limpeza da aplicação Fast Food API no Kubernetes
set -e

echo "🧹 Iniciando limpeza da Fast Food API..."

# Deletar todos os recursos do namespace
echo "🗑️ Deletando recursos..."
kubectl delete namespace fast-food-api --ignore-not-found=true

# Deletar PersistentVolume (fora do namespace)
echo "🗑️ Deletando PersistentVolume..."
kubectl delete pv postgres-pv --ignore-not-found=true

echo "✅ Limpeza concluída!" 