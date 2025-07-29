# Arquitetura Kubernetes - Fast Food API

## 🏗️ Visão Geral

Esta arquitetura Kubernetes foi projetada para atender todos os requisitos da FASE 2 do Tech Challenge, fornecendo uma solução escalável, segura e de alta disponibilidade para a aplicação Fast Food API.

## 📋 Componentes da Arquitetura

### 1. **Namespace**

- **Arquivo**: `namespace.yaml`
- **Propósito**: Isolamento completo da aplicação
- **Nome**: `fast-food-api`

### 2. **Configurações**

- **ConfigMap**: `configmap.yaml` - Configurações não-sensíveis
- **Secrets**: `secrets.yaml` - Dados sensíveis (base64)
- **Segurança**: Separação clara entre configurações públicas e privadas

### 3. **Banco de Dados**

- **PostgreSQL 16 Alpine**: Container otimizado
- **Persistência**: PersistentVolume (10Gi)
- **Health Checks**: Liveness e Readiness probes
- **Recursos**: 256Mi-512Mi RAM, 250m-500m CPU

### 4. **Aplicação Principal**

- **Node.js 22 Alpine**: Container otimizado
- **Réplicas**: 2-10 (HPA)
- **Health Checks**: HTTP probes em `/health`
- **Recursos**: 256Mi-512Mi RAM, 250m-500m CPU

### 5. **Networking**

- **Services**: ClusterIP para comunicação interna
- **Ingress**: Nginx para acesso externo
- **Network Policies**: Controle granular de tráfego

### 6. **Escalabilidade**

- **HPA**: Auto-scaling baseado em CPU (70%) e memória (80%)
- **Políticas**: Scale-up rápido, scale-down conservador
- **Métricas**: Resource-based scaling

## 🔒 Segurança

### Network Policies

```yaml
# Aplicação só pode acessar PostgreSQL
# PostgreSQL só aceita conexões da aplicação
# Tráfego externo controlado via Ingress
```

### Secrets Management

- Todas as credenciais em Kubernetes Secrets
- Valores codificados em base64
- Acesso restrito por namespace

### Resource Limits

- CPU e memória limitados por pod
- Prevenção de resource exhaustion
- QoS garantido

## 📈 Escalabilidade

### Horizontal Pod Autoscaler

- **Mínimo**: 2 réplicas
- **Máximo**: 10 réplicas
- **CPU Target**: 70%
- **Memory Target**: 80%
- **Stabilization Window**: 60s (up), 300s (down)

### Políticas de Scaling

- **Scale Up**: 50% por minuto
- **Scale Down**: 10% por minuto
- **Prevenção de thrashing**

## 🌐 Acesso Externo

### Ingress Configuration

- **Controller**: Nginx Ingress
- **Host**: `fast-food-api.local`
- **CORS**: Configurado para desenvolvimento
- **SSL**: Preparado para HTTPS

### Service Discovery

- **Internal**: `fast-food-api-service:80`
- **Database**: `postgres-service:5432`
- **DNS**: Kubernetes DNS automático

## 📊 Monitoramento

### Health Checks

- **Liveness**: Detecta pods mortos
- **Readiness**: Detecta pods não prontos
- **Startup**: Detecta inicialização lenta

### Logs

- **Aplicação**: `kubectl logs -f deployment/fast-food-api-deployment`
- **Database**: `kubectl logs -f deployment/postgres-deployment`

### Métricas

- **HPA Status**: `kubectl get hpa`
- **Resource Usage**: `kubectl top pods`

## 🚀 Deploy

### Scripts Automatizados

- **`deploy.sh`**: Deploy completo
- **`build-and-deploy.sh`**: Build + Deploy
- **`cleanup.sh`**: Limpeza completa
- **`test-endpoints.sh`**: Teste de endpoints

### Ambientes

- **Produção**: Configuração padrão
- **Desenvolvimento**: `k8s/overlays/development/`

## ✅ Requisitos Atendidos

### ✅ **Requisitos Funcionais**

- APIs funcionais através do Ingress
- Banco PostgreSQL com persistência
- Aplicação containerizada e orquestrada

### ✅ **Escalabilidade (HPA)**

- Auto-scaling baseado em CPU (70%) e memória (80%)
- 2-10 réplicas conforme demanda
- Políticas de scale-up/down configuradas

### ✅ **Manifestos no GitHub**

- Todos os arquivos YAML organizados
- Scripts de deploy e limpeza
- Documentação completa

### ✅ **Segurança**

- ConfigMap para configurações não-sensíveis
- Secrets para dados sensíveis (base64)
- Network Policies para isolamento
- Namespace dedicado

### ✅ **Boas Práticas**

- Deployments com health checks
- Services para exposição
- Ingress para acesso externo
- PersistentVolume para dados
- Resource limits e requests

## 🛠️ Tecnologias Utilizadas

- **Kubernetes**: v1.28+ (última versão estável)
- **Docker**: Containerização
- **PostgreSQL**: 16 Alpine
- **Node.js**: 22 Alpine
- **Nginx Ingress**: Controller
- **Kustomize**: Gerenciamento de configurações

## 📝 Próximos Passos

1. **Configurar Secrets** com valores reais
2. **Instalar Ingress Controller** se necessário
3. **Instalar Metrics Server** se necessário
4. **Configurar SSL/TLS** para produção
5. **Implementar monitoring** (Prometheus/Grafana)
6. **Configurar backup** do banco de dados

## 🐛 Troubleshooting

### Problemas Comuns

- **Pod não inicia**: Verificar logs e eventos
- **Banco não conecta**: Verificar Network Policies
- **Ingress não funciona**: Verificar Ingress Controller
- **HPA não escala**: Verificar Metrics Server

### Comandos Úteis

```bash
# Status geral
kubectl get all -n fast-food-api

# Logs da aplicação
kubectl logs -f deployment/fast-food-api-deployment -n fast-food-api

# Descrição de recursos
kubectl describe pod <pod-name> -n fast-food-api

# Teste de conectividade
kubectl exec -it <pod-name> -n fast-food-api -- nc -zv postgres-service 5432
```
