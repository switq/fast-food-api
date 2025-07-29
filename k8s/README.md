# Fast Food API - Kubernetes

Este diretório contém a configuração Kubernetes organizada para a aplicação Fast Food API.

## 📁 Estrutura Organizada

```
k8s/
├── base/                    # Recursos base da aplicação
├── networking/              # Componentes de rede
├── scaling/                 # Componentes de escalabilidade
├── scripts/                 # Scripts de deploy e manutenção
├── overlays/                # Configurações por ambiente
└── docs/                    # Documentação
```

## 🚀 Deploy Rápido

### Setup Mínimo
```bash
# 1. Configurar banco externo em base/configmap.yaml
# 2. Executar deploy mínimo
chmod +x scripts/*.sh
./scripts/deploy-minimal.sh
```

### Setup Completo
```bash
# 1. Configurar banco externo em base/configmap.yaml
# 2. Executar deploy completo
chmod +x scripts/*.sh
./scripts/deploy.sh
```

## 📚 Documentação

- [Documentação Completa](docs/README.md)
- [Setup Mínimo](docs/MINIMAL_README.md)
- [Arquitetura](docs/ARCHITECTURE.md)

## 🧪 Testes

```bash
# Testar endpoints
./scripts/test-endpoints.sh
```

## 🧹 Limpeza

```bash
# Limpeza completa
./scripts/cleanup.sh

# Limpeza mínima
./scripts/cleanup-minimal.sh
```

## 📝 Notas

- PostgreSQL é **externo** (não deployado no cluster)
- Use `base/configmap.yaml` para configurar o host do banco
- Use `base/secrets.yaml` para credenciais sensíveis
