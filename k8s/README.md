# Fast Food API - Kubernetes Deployment

Este diretório contém todos os manifestos Kubernetes necessários para deployar a aplicação Fast Food API em um cluster Kubernetes.

## 📋 Pré-requisitos

- Kubernetes cluster (Minikube, Kind, AKS, EKS, GKE, etc.)
- kubectl configurado
- Ingress Controller (nginx-ingress)
- Helm (opcional, para instalar ingress controller)

## 🏗️ Arquitetura

A arquitetura inclui:

- **Namespace**: `fast-food-api` para isolamento
- **PostgreSQL**: Banco de dados com persistência
- **Fast Food API**: Aplicação principal com múltiplas réplicas
- **HPA**: Auto-scaling baseado em CPU e memória
- **Ingress**: Acesso externo com nginx
- **Network Policies**: Segurança de rede
- **ConfigMap/Secrets**: Configurações e dados sensíveis

## 🚀 Deploy

### 1. Preparar Secrets

Antes do deploy, atualize o arquivo `secrets.yaml` com suas credenciais:

```bash
# Codificar valores em base64
echo -n "sua-senha-aqui" | base64
```

### 2. Executar Deploy

```bash
# Dar permissão de execução
chmod +x deploy.sh

# Executar deploy
./deploy.sh
```

### 3. Verificar Status

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
- **Storage**: 10Gi para PostgreSQL

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

### Logs

```bash
# Logs da aplicação
kubectl logs -f deployment/fast-food-api-deployment -n fast-food-api

# Logs do PostgreSQL
kubectl logs -f deployment/postgres-deployment -n fast-food-api
```

### Métricas

```bash
# Status do HPA
kubectl get hpa -n fast-food-api

# Descrição detalhada
kubectl describe hpa fast-food-api-hpa -n fast-food-api
```

## 🧹 Limpeza

```bash
# Dar permissão de execução
chmod +x cleanup.sh

# Executar limpeza
./cleanup.sh
```

## 🔒 Segurança

### Network Policies

- Aplicação só pode acessar PostgreSQL
- PostgreSQL só aceita conexões da aplicação
- Tráfego externo controlado via Ingress

### Secrets

- Todas as credenciais em Kubernetes Secrets
- Valores codificados em base64
- Acesso restrito por namespace

## 🐛 Troubleshooting

### Pod não inicia

```bash
# Verificar eventos
kubectl describe pod <pod-name> -n fast-food-api

# Verificar logs
kubectl logs <pod-name> -n fast-food-api
```

### Banco não conecta

```bash
# Verificar se PostgreSQL está rodando
kubectl get pods -l app=postgres -n fast-food-api

# Testar conexão
kubectl exec -it <app-pod> -n fast-food-api -- nc -zv postgres-service 5432
```

### Ingress não funciona

```bash
# Verificar se ingress controller está instalado
kubectl get pods -n ingress-nginx

# Verificar ingress
kubectl describe ingress fast-food-api-ingress -n fast-food-api
```

## 📝 Notas

- A aplicação usa Node.js 22 Alpine
- PostgreSQL 16 Alpine
- Nginx Ingress Controller
- Auto-scaling baseado em métricas de recursos
- Persistência de dados via PersistentVolume
