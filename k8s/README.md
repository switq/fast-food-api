# Fast Food API - Kubernetes Deployment

Configurações Kubernetes para deploy da Fast Food API em produção.

## 📁 Arquivos

```
k8s/
├── kubernetes.yaml          # Configuração principal
├── network-policies.yaml    # Políticas de segurança
└── README.md               # Esta documentação
```

## 🚀 Deploy

### Pré-requisitos
- Cluster Kubernetes configurado
- `kubectl` instalado
- Ingress Controller (nginx-ingress)

### 1. Configurar Banco Externo

Edite `kubernetes.yaml` e atualize o ConfigMap:

```yaml
DATABASE_HOST: "seu-banco-externo.com"
DATABASE_PORT: "5432"
DATABASE_NAME: "fastfood"
```

### 2. Deploy

```bash
# Deploy principal
kubectl apply -f k8s/kubernetes.yaml

# Políticas de rede (opcional)
kubectl apply -f k8s/network-policies.yaml
```

## 🔧 Configurações

### Recursos
- **Replicas**: 2-10 (auto-scaling)
- **CPU**: 250m/500m (request/limit)
- **Memory**: 256Mi/512Mi (request/limit)

### Auto-scaling
- **CPU**: 70% threshold
- **Memory**: 80% threshold
- **Scale**: 100% up, 10% down (60s intervals)

## 🔒 Segurança

- Execução como usuário não-root (UID 1000)
- ReadOnly root filesystem
- Network policies para isolamento
- Secrets para credenciais sensíveis

## 📊 Health Checks

- **Liveness**: `/health` a cada 10s
- **Readiness**: `/health` a cada 5s
- **Timeout**: 5s/3s

## 🌐 Acesso

```bash
# URLs
API: http://fast-food-api.local
Swagger: http://fast-food-api.local/api-docs

# Port forward (dev)
kubectl port-forward -n fast-food-api service/fast-food-api-service 3000:80
```

## 🛠️ Comandos Úteis

### Status
```bash
kubectl get pods -n fast-food-api
kubectl get services -n fast-food-api
kubectl logs -n fast-food-api deployment/fast-food-api -f
```

### Troubleshooting
```bash
kubectl describe pod -n fast-food-api <pod-name>
kubectl exec -it -n fast-food-api <pod-name> -- /bin/sh
```

### Scaling
```bash
kubectl scale deployment fast-food-api -n fast-food-api --replicas=3
kubectl get hpa -n fast-food-api
```

## 🔄 Atualizações

```bash
# Rolling update
kubectl set image deployment/fast-food-api fast-food-api=fast-food-api:v2 -n fast-food-api
kubectl rollout status deployment/fast-food-api -n fast-food-api

# Rollback
kubectl rollout undo deployment/fast-food-api -n fast-food-api
```

## 🗑️ Limpeza

```bash
kubectl delete -f k8s/kubernetes.yaml
kubectl delete -f k8s/network-policies.yaml
kubectl delete namespace fast-food-api
```

## 📝 Notas

1. **Banco Externo**: Configure corretamente o host no ConfigMap
2. **Secrets**: Use Vault/AWS Secrets Manager em produção
3. **Ingress**: Configure SSL/TLS para produção
4. **Logs**: Considere ELK Stack para logs centralizados 