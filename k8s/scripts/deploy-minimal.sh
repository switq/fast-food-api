#!/bin/bash

# Minimal Kubernetes Deployment Script
# This script deploys only the Fast Food API without PostgreSQL

set -e

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🚀 Deploying minimal Fast Food API to Kubernetes..."

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed or not in PATH"
    exit 1
fi

# Check if we can connect to a cluster
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Cannot connect to Kubernetes cluster"
    echo "Please ensure you have a cluster running and kubectl is configured"
    exit 1
fi

echo "📋 Current cluster context:"
kubectl config current-context

# Build the Docker image from project root
echo "🔨 Building Docker image..."
cd "$PROJECT_ROOT"
docker build -t fast-food-api:latest .

# Apply the base resources from k8s directory
echo "📦 Applying base resources..."
cd "$SCRIPT_DIR/.."
kubectl apply -k base/

# Wait for deployment to be ready
echo "⏳ Waiting for deployment to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/fast-food-api-deployment -n fast-food-api

# Show status
echo "📊 Deployment status:"
kubectl get pods -n fast-food-api
kubectl get services -n fast-food-api

echo ""
echo "✅ Minimal deployment completed!"
echo ""
echo "📝 Next steps:"
echo "1. Update DATABASE_HOST in base/configmap.yaml with your external PostgreSQL host"
echo "2. Apply the updated configuration: kubectl apply -k base/"
echo "3. Access the API: kubectl port-forward service/fast-food-api-service 8080:80 -n fast-food-api"
echo ""
echo "🔍 To check logs:"
echo "kubectl logs -f deployment/fast-food-api-deployment -n fast-food-api"