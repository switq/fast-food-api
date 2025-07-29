#!/bin/bash

# Minimal Kubernetes Cleanup Script

set -e

echo "🧹 Cleaning up minimal Fast Food API deployment..."

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed or not in PATH"
    exit 1
fi

# Delete the namespace (this will delete everything in it)
echo "🗑️  Deleting namespace and all resources..."
kubectl delete namespace fast-food-api --ignore-not-found=true

echo "✅ Cleanup completed!"
echo ""
echo "📝 Note: If you have an external PostgreSQL database, it was not affected by this cleanup."