# Minimal Kubernetes Setup

This is a minimal Kubernetes deployment for the Fast Food API that **excludes PostgreSQL** from the cluster. The database is expected to be an external service.

## 🏗️ Architecture

- **Fast Food API**: Deployed in Kubernetes cluster
- **PostgreSQL**: External service (not in cluster)
- **Namespace**: `fast-food-api` for isolation

## 📋 Prerequisites

- Kubernetes cluster (Minikube, Kind, AKS, EKS, GKE, etc.)
- kubectl configured
- External PostgreSQL database
- Docker (for building the image)

## 🚀 Quick Start

### 1. Update Database Configuration

Edit `base/configmap.yaml` and update the `DATABASE_HOST`:

```yaml
data:
  DATABASE_HOST: "your-external-postgres-host"  # Update this
```

### 2. Deploy

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Deploy the application
./scripts/deploy-minimal.sh
```

### 3. Access the API

```bash
# Port forward to access the service
kubectl port-forward service/fast-food-api-service 8080:80 -n fast-food-api

# Test the API
curl http://localhost:8080/health
```

## 📊 Monitoring

### Check Status

```bash
# Pods
kubectl get pods -n fast-food-api

# Services
kubectl get services -n fast-food-api

# Logs
kubectl logs -f deployment/fast-food-api-deployment -n fast-food-api
```

### Check Database Connection

```bash
# Test database connectivity from a pod
kubectl exec -it $(kubectl get pods -n fast-food-api -l app=fast-food-api -o jsonpath='{.items[0].metadata.name}') -n fast-food-api -- nc -zv your-external-postgres-host 5432
```

### Test Endpoints

```bash
# Run automated tests
./scripts/test-endpoints.sh
```

## 🧹 Cleanup

```bash
./scripts/cleanup-minimal.sh
```

## ⚙️ Configuration

### Environment Variables

The application uses these environment variables:

- `NODE_ENV`: Environment (production)
- `PORT`: Application port (3000)
- `DATABASE_HOST`: External PostgreSQL host
- `DATABASE_PORT`: PostgreSQL port (5432)
- `DATABASE_NAME`: Database name (fastfood)
- `DATABASE_USER`: Database user (from secrets)
- `DATABASE_PASSWORD`: Database password (from secrets)

### Secrets

Sensitive data is stored in Kubernetes Secrets:

- Database credentials
- Mercado Pago API keys
- Webhook secrets

## 🔧 Troubleshooting

### Pod Not Starting

```bash
# Check pod events
kubectl describe pod <pod-name> -n fast-food-api

# Check logs
kubectl logs <pod-name> -n fast-food-api
```

### Database Connection Issues

1. Verify external PostgreSQL is accessible
2. Check database credentials in secrets
3. Verify network connectivity from cluster to database

### Image Issues

```bash
# Rebuild and redeploy
docker build -t fast-food-api:latest .
kubectl rollout restart deployment/fast-food-api-deployment -n fast-food-api
```

## 📝 Notes

- This setup is minimal and doesn't include:
  - Ingress controller
  - Auto-scaling (HPA)
  - Network policies
  - Persistent volumes
  - Monitoring/observability

- For production, consider adding:
  - Ingress for external access
  - HPA for auto-scaling
  - Network policies for security
  - Monitoring and logging
  - SSL/TLS certificates