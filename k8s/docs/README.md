# Fast Food API - Kubernetes Deployment

Este diretório contém todos os manifestos Kubernetes necessários para deployar a aplicação Fast Food API em um cluster Kubernetes.

## 📋 Pré-requisitos

- Kubernetes cluster (Minikube, Kind, AKS, EKS, GKE, etc.)
- kubectl configurado
- Ingress Controller (nginx-ingress)
- Helm (opcional, para instalar ingress controller)
- **PostgreSQL externo** (não deployado no cluster)

## 🏗️ Arquitetura

A arquitetura inclui:

- **Namespace**: `fast-food-api` para isolamento
- **PostgreSQL**: Banco de dados externo (não no cluster)
- **Fast Food API**: Aplicação principal com múltiplas réplicas
- **HPA**: Auto-scaling baseado em CPU e memória
- **Ingress**: Acesso externo com nginx
- **Network Policies**: Segurança de rede
- **ConfigMap/Secrets**: Configurações e dados sensíveis

## 📁 Estrutura de Arquivos

```
k8s/
├── base/                    # Recursos base da aplicação
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secrets.yaml
│   ├── app-deployment.yaml
│   ├── app-service.yaml
│   └── kustomization.yaml
├── networking/              # Componentes de rede
│   ├── network-policy.yaml
│   ├── ingress.yaml
│   └── ingress-controller-setup.yaml
├── scaling/                 # Componentes de escalabilidade
│   ├── hpa.yaml
│   └── metrics-server-setup.yaml
├── scripts/                 # Scripts de deploy e manutenção
│   ├── deploy.sh
│   ├── cleanup.sh
│   ├── deploy-minimal.sh
│   ├── cleanup-minimal.sh
│   └── test-endpoints.sh
├── overlays/                # Configurações por ambiente
│   └── development/
└── docs/                    # Documentação
    ├── README.md
    ├── MINIMAL_README.md
    └── ARCHITECTURE.md
```

## 🚀 Deploy

### 1. Configurar Banco de Dados Externo

Antes do deploy, configure o banco PostgreSQL externo e atualize o `base/configmap.yaml`:

```yaml
data:
  DATABASE_HOST: "seu-host-postgres-externo"  # Atualizar aqui
```

### 2. Preparar Secrets

Atualize o arquivo `base/secrets.yaml` com suas credenciais:

```bash
# Codificar valores em base64
echo -n "sua-senha-aqui" | base64
```

### 3. Executar Deploy

```bash
# Dar permissão de execução
chmod +x scripts/*.sh

# Deploy completo
./scripts/deploy.sh

# Ou deploy mínimo
./scripts/deploy-minimal.sh
```

### 4. Verificar Status

```bash
kubectl get all -n fast-food-api
kubectl get hpa -n fast-food-api
```

## ⚙️ Configurações

### Variáveis de Ambiente

As configurações estão distribuídas entre:

- **ConfigMap**: Configurações não-sensíveis
- **Secrets**: Dados sensíveis (senhas, tokens)

### Recursos

- **CPU**: 250m-500m por pod
- **Memória**: 256Mi-512Mi por pod
- **Storage**: Não aplicável (banco externo)

### Auto-scaling

- **Mínimo**: 2 réplicas
- **Máximo**: 10 réplicas
- **CPU**: 70% de utilização
- **Memória**: 80% de utilização

## 🌐 Acesso

### Local (Minikube/Kind)

```bash
# Adicionar ao /etc/hosts
echo "127.0.0.1 fast-food-api.local" | sudo tee -a /etc/hosts

# Acessar
curl http://fast-food-api.local
```

### Cloud (AKS/EKS/GKE)

```bash
# Obter IP do ingress
kubectl get ingress -n fast-food-api

# Acessar via IP público
curl http://<IP-DO-INGRESS>
```

## 📊 Monitoramento

### Check Status

```bash
# Pods
kubectl get pods -n fast-food-api

# Services
kubectl get services -n fast-food-api

# Logs
kubectl logs -f deployment/fast-food-api-deployment -n fast-food-api
```

### Testar Endpoints

```bash
# Executar testes automatizados
./scripts/test-endpoints.sh
```

## 🧹 Limpeza

```bash
# Limpeza completa
./scripts/cleanup.sh

# Ou limpeza mínima
./scripts/cleanup-minimal.sh
```

## 🔒 Segurança

### Network Policies

- Aplicação pode acessar banco externo
- Tráfego externo controlado via Ingress
- Conexões de saída permitidas para banco externo

### Secrets

- Todas as credenciais em Kubernetes Secrets
- Valores codificados em base64
- Acesso restrito por namespace

## 🐛 Troubleshooting

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

## 📝 Notas

- A aplicação usa Node.js 22 Alpine
- PostgreSQL é externo (não no cluster)
- Nginx Ingress Controller
- Auto-scaling baseado em métricas de recursos
- Banco de dados gerenciado externamente

## 🚀 Setup Mínimo

Para um setup mais simples, use os scripts mínimos:

```bash
# Deploy mínimo (sem ingress, HPA, etc.)
./scripts/deploy-minimal.sh

# Testar endpoints
./scripts/test-endpoints.sh
```