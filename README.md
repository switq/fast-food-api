# Fast Food API

Uma API REST baseada em TypeScript para um restaurante de fast food usando Express e Prisma.

## Configuração

### Opção 1: Usando Docker (Recomendado)

1. Clone o repositório e navegue até o diretório do projeto:

```bash
git clone <url-do-repositório>
cd fast-food-api
```

2. Inicie a aplicação com Docker Compose:

**Para Desenvolvimento:**

```bash
docker compose --profile dev up --build
```

**Para Produção:**

```bash
docker compose --profile prod up --build
```

Isso iniciará automaticamente o banco de dados PostgreSQL e a aplicação, incluindo o preenchimento do banco com dados de exemplo.

### Opção 2: Kubernetes (Produção/Cloud)

Para deploy em cluster Kubernetes:

1. **Configure o ambiente:**
   - Certifique-se de ter um cluster Kubernetes rodando (minikube, kind, ou cloud)
   - Configure o Docker para usar o registry do cluster

2. **Build e deploy da imagem:**
   ```bash
   # Build da imagem
   docker build -t fast-food-api:latest .
   
   # Se usando minikube
   eval $(minikube docker-env)
   docker build -t fast-food-api:latest .
   
   # Deploy no Kubernetes
   kubectl apply -f k8s/kubernetes.yaml
   ```

3. **Verifique o deploy:**
   ```bash
   # Verificar status dos pods
   kubectl get pods -n fast-food-api
   
   # Verificar serviços
   kubectl get services -n fast-food-api
   
   # Verificar logs
   kubectl logs -f deployment/fast-food-api -n fast-food-api
   ```

4. **Acesse a aplicação:**
   ```bash
   # Port-forward para acesso local
   kubectl port-forward service/fast-food-api-service 3000:80 -n fast-food-api
   
   # Ou use minikube tunnel (se aplicável)
   minikube tunnel
   ```

**Nota:** A implementação atual do Kubernetes é básica e inclui apenas:
- Namespace `fast-food-api`
- Deployment com 1 réplica
- Service ClusterIP na porta 80
- Configuração para PostgreSQL local via `host.minikube.internal`

Para uma implementação mais robusta em produção, considere adicionar:
- ConfigMaps para configurações
- Secrets para dados sensíveis
- Ingress para roteamento externo
- HPA (Horizontal Pod Autoscaler) para escalabilidade
- PersistentVolumeClaims para dados persistentes

### Opção 3: Desenvolvimento Local

1. Instale as dependências:

```bash
npm install
```

2. Configure as variáveis de ambiente:

```bash
cp env.example .env
```

3. Atualize o arquivo `.env` com sua configuração de banco de dados:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/fast_food_db?schema=public"
PORT=3000
NODE_ENV=development
```

4. Inicialize o banco de dados:

```bash
npm run db:push
```

5. Gere o Prisma Client:

```bash
npm run db:generate
```

6. Preencha o banco com dados de exemplo:

```bash
npm run db:seed
```

## Desenvolvimento

### Com Docker

A aplicação reiniciará automaticamente quando você fizer alterações no código.

### Sem Docker

Execute o servidor de desenvolvimento:

```bash
npm run dev
```

## Build

Compile o projeto:

```bash
npm run build
```

Execute o servidor de produção:

```bash
npm start
```

### Perfis Docker

**Desenvolvimento (`--profile dev`):**

- API server na porta 3000
- Prisma Studio na porta 5555
- Hot reload automático
- Banco de dados com dados de exemplo

**Produção (`--profile prod`):**

- API server otimizado na porta 3000
- Build multi-stage para menor tamanho de imagem
- Sem ferramentas de desenvolvimento

### Comandos Úteis

```bash
# Desenvolvimento
docker compose --profile dev up --build

# Produção
docker compose --profile prod up --build

# Parar todos os serviços
docker compose down

# Ver logs
docker compose logs -f

# Validação de código
npm run ci          # Executa todas as validações
npm run lint        # Verifica linting
npm run lint:fix    # Corrige problemas de linting
npm run format      # Formata código
npm run format:check # Verifica formatação
npm run type-check  # Verifica tipos TypeScript
```

## Schema do Banco de Dados

A aplicação inclui os seguintes modelos:

- **Customer**: Informações do cliente com nome, email, CPF e telefone
- **Category**: Categorias de produtos (Hambúrgueres, Bebidas, etc.)
- **Product**: Itens de comida com nome, descrição, preço, categoria e disponibilidade
- **Order**: Pedidos dos clientes com rastreamento de status
- **OrderItem**: Itens individuais dentro de um pedido

## Dados de Exemplo

O banco de dados é automaticamente preenchido com:

- **5 Categorias**: Hambúrgueres, Bebidas, Acompanhamentos, Sobremesas, Combos
- **13 Produtos**: Vários hambúrgueres, bebidas, acompanhamentos, sobremesas e combos
- **5 Clientes**: Dados de exemplo de clientes com CPF e números de telefone válidos
- **3 Pedidos de Exemplo**: Pedidos em diferentes status com itens realistas

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /products` - Get all products
- `POST /products` - Create a new product
- `GET /orders` - Get all orders
- `POST /orders` - Create a new order
- `GET /customers` - Get all customers
- `POST /customers` - Create a new customer
- `GET /categories` - Get all categories

## Comandos do Banco de Dados

**Via Docker:**

```bash
# Acessar o container da aplicação (desenvolvimento)
docker compose exec app_development sh

# Acessar o container da aplicação (produção)
docker compose exec app_production sh

# Dentro do container:
npm run db:generate    # Gera o cliente Prisma
npm run db:push        # Envia alterações do schema
npm run db:seed        # Preenche com dados de exemplo
npm run db:reset       # Reseta e preenche o banco
```

**Localmente:**

- `npm run db:generate` - Gera o cliente Prisma
- `npm run db:push` - Envia alterações do schema para o banco
- `npm run db:seed` - Preenche o banco com dados de exemplo (pula se dados existem)
- `npm run db:seed:force` - Força o preenchimento do banco (limpa dados existentes primeiro)
- `npm run db:reset` - Reseta o banco e preenche com dados de exemplo
- `npm run db:studio` - Abre o Prisma Studio (interface gráfica do banco)

**Prisma Studio:**

- Disponível em `http://localhost:5555` quando usando `--profile dev`
- Ou execute localmente: `npm run db:studio`

## Comandos Docker

- **Iniciar todos os serviços (desenvolvimento):**
  ```bash
  docker compose --profile dev up --build
  ```
- **Iniciar todos os serviços (produção):**
  ```bash
  docker compose --profile prod up --build
  ```
- **Parar todos os serviços:**
  ```bash
  docker compose down
  ```
- **Ver logs:**
  ```bash
  docker compose logs -f
  ```
- **Reconstruir containers (desenvolvimento):**
  ```bash
  docker compose --profile dev up --build --force-recreate
  ```
- **Reconstruir containers (produção):**
  ```bash
  docker compose --profile prod up --build --force-recreate
  ```
- **Acessar um container em execução (desenvolvimento):**
  ```bash
  docker compose exec app_development sh
  ```
- **Acessar um container em execução (produção):**
  ```bash
  docker compose exec app_production sh
  ```

---

## Variáveis de Ambiente

Copie `env.example` para `.env` e configure as seguintes variáveis:

- `DATABASE_URL`: String de conexão PostgreSQL
- `PORT`: Porta do servidor (padrão: 3000)
- `NODE_ENV`: Ambiente (development/production)
- `LOG_LEVEL`: Nível de log (opcional)
- `CORS_origin`: Origem CORS (opcional)

## Fluxo de Pagamento (Mercado Pago)

A API suporta um fluxo completo de pagamento usando Mercado Pago, incluindo geração de QR code e integração de webhook para atualizações de status.

### 🚀 **Guia Completo de Configuração**

#### **1. Configure as Variáveis de Ambiente**

Adicione o seguinte ao seu arquivo `.env`:

```env
# Configuração do Mercado Pago
MERCADO_PAGO_ACCESS_TOKEN=TEST-seu-access-token-aqui
MERCADO_PAGO_NOTIFICATION_URL=https://sua-url-ngrok.ngrok-free.app/api/payments/webhook

# Banco de Dados
DATABASE_URL="postgresql://user:password@localhost:5432/fastfood?schema=public"

# Servidor
PORT=3000
NODE_ENV=development
```

#### **2. Configure ngrok para Webhook (Necessário para Desenvolvimento Local)**

**Instale o ngrok:**

- Baixe em: https://ngrok.com/download
- Ou instale via gerenciador de pacotes: `npm install -g ngrok`

**Configure o ngrok:**

```bash
# Autentique (obtenha o token em ngrok.com)
ngrok config add-authtoken SEU_NGROK_TOKEN

# Inicie o túnel para a porta 3000
ngrok http 3000
```

**Obtenha sua URL de webhook:**

```bash
# Verifique túneis ativos
curl http://localhost:4040/api/tunnels

# Sua URL de webhook será algo como:
# https://abc123.ngrok-free.app/api/payments/webhook
```

#### **3. Configure o Webhook do Mercado Pago**

1. **Acesse o Painel de Desenvolvedores do Mercado Pago:**
   - Vá para: https://www.mercadopago.com.br/developers/panel
   - Navegue para: Applications → Sua App → Webhooks

2. **Adicione a Configuração do Webhook:**

   ```
   URL: https://sua-url-ngrok.ngrok-free.app/api/payments/webhook
   Events: payment.created, payment.updated
   ```

3. **Teste o Webhook:**
   - Use o botão "Test" no painel do Mercado Pago
   - Ou use a coleção do Postman fornecida

#### **4. Inicie a Aplicação**

```bash
# Inicie com Docker (recomendado) - Desenvolvimento
docker compose --profile dev up --build

# Ou inicie com Docker - Produção
docker compose --profile prod up --build

# Ou inicie localmente
npm install
npm run dev
```

#### **5. Verifique a Configuração**

**Verifique se tudo está funcionando:**

```bash
# Teste a aplicação
curl http://localhost:3000/api/health

# Teste o túnel ngrok
curl https://sua-url-ngrok.ngrok-free.app/api/health

# Teste o endpoint de webhook
curl -X POST https://sua-url-ngrok.ngrok-free.app/api/payments/webhook \
  -H "Content-Type: application/json" \
  -d '{"data":{"id":"test"}}'
```

### 🔄 **Testando o Fluxo de Pagamento**

#### **Passo 1: Crie um Cliente e Pedido**

```bash
# Crie um cliente
POST /api/customers
{
  "name": "João Silva",
  "email": "joao@example.com",
  "cpf": "12345678901",
  "phone": "11999999999"
}

# Crie um pedido
POST /api/orders
{
  "customerId": "customer-id-do-exemplo-acima",
  "items": [
    {
      "productId": "product-id",
      "quantity": 1
    }
  ]
}
```

#### **Passo 2: Gere o QR Code de Pagamento**

```bash
# Gere o pagamento
POST /api/orders/{orderId}/payment
{
  "paymentMethodId": "pix"
}

# A resposta inclui:
{
  "orderId": "...",
  "paymentProviderId": "...",
  "qrCode": "https://mercadopago.com/...",
  "qrCodeBase64": "data:image/png;base64,..."
}
```

#### **Passo 3: Complete o Pagamento**

1. **Escaneie o QR Code** com a conta de teste do Mercado Pago
2. **Complete o pagamento** na interface do Mercado Pago
3. **O webhook atualiza automaticamente** o status do pedido

#### **Passo 4: Monitore o Status do Pagamento**

```bash
# Verifique o status do pedido (do banco de dados)
GET /api/payments/order/{orderId}/status

# Verifique o status em tempo real (do Mercado Pago)
GET /api/payments/order/{orderId}/status?provider=true

# Monitore os logs (desenvolvimento)
docker compose logs -f app_development

# Monitore os logs (produção)
docker compose logs -f app_production
```

### 🛠️ **Solução de Problemas**

#### **Problemas com ngrok**

Se você receber erro `ERR_NGROK_3004`:

```bash
# 1. Pare o ngrok
taskkill /f /im ngrok.exe  # Windows
# ou
pkill ngrok  # Linux/Mac

# 2. Reinicie o ngrok corretamente
ngrok http 3000

# 3. Atualize a URL do webhook no painel do Mercado Pago
```

**Execute o script de diagnóstico:**

```bash
# Windows
.\diagnose_ngrok.ps1

# Verifique se o ngrok está apontando para http://localhost:3000 (não https)
```

#### **Webhook Não Recebendo**

1. **Verifique o status do ngrok:**

   ```bash
   curl http://localhost:4040/api/tunnels
   ```

2. **Teste o webhook manualmente:**

   ```bash
   curl -X POST https://sua-url-ngrok.ngrok-free.app/api/payments/webhook \
     -H "Content-Type: application/json" \
     -d '{"data":{"id":"119538917962"}}'
   ```

3. **Verifique os logs da aplicação:**

   ```bash
   # Desenvolvimento
   docker compose logs -f app_development

   # Produção
   docker compose logs -f app_production
   ```

#### **Status do Pagamento Não Atualizando**

1. **Verifique a URL do webhook** no painel do Mercado Pago
2. **Verifique se o pedido existe** no banco de dados
3. **Verifique se o ID do pagamento** está correto
4. **Verifique os logs** para mensagens de erro

### 📚 **Documentação e Ferramentas**

#### **Coleções do Postman**

Importe estas coleções para teste:

1. **`fast-food-api.postman_collection.json`** - Teste completo da API
2. **`mercado-pago-monitoring.postman_collection.json`** - Monitoramento de pagamentos

#### **Scripts de Teste**

- **PowerShell**: `scripts/test_payment_endpoint.ps1`
- **Bash**: `scripts/test_payment_endpoint.sh`
- **Node.js**: `test_payment_flow.js`

#### **Ferramentas de Monitoramento**

- **Interface ngrok**: http://localhost:4040
- **Logs da Aplicação**: `docker compose logs -f app_development` (dev) ou `docker compose logs -f app_production` (prod)
- **Painel Mercado Pago**: https://www.mercadopago.com.br/developers/panel

#### **Teste Alternativo (se ngrok falhar)**

Use **webhook.site** para teste temporário:

1. Vá para: https://webhook.site
2. Copie a URL única
3. Configure no Mercado Pago temporariamente
4. Visualize requisições de webhook em tempo real
5. Copie o payload para testar localmente

### 🎯 **Fluxo de Status do Pedido**

O webhook de pagamento gerencia automaticamente as transições de status do pedido:

```
PENDING → CONFIRMED → PAYMENT_CONFIRMED → PREPARING → READY → DELIVERED
```

**Processamento do Webhook:**

1. Recebe notificação de pagamento do Mercado Pago
2. Busca o status do pagamento na API do Mercado Pago
3. Encontra o pedido pela referência externa
4. Atualiza o status do pagamento
5. Transiciona o status do pedido se o pagamento for aprovado:
   - `PENDING` → `CONFIRMED` → `PAYMENT_CONFIRMED`

### 🔧 **Checklist de Configuração do Ambiente**

- [ ] Docker instalado e funcionando
- [ ] ngrok instalado e autenticado
- [ ] Conta de teste do Mercado Pago criada
- [ ] Access token configurado no `.env`
- [ ] Túnel ngrok iniciado (`ngrok http 3000`)
- [ ] URL do webhook configurada no painel do Mercado Pago
- [ ] Aplicação rodando (`docker compose --profile dev up` ou `docker compose --profile prod up`)
- [ ] Webhook testado e recebendo requisições
- [ ] Fluxo de pagamento testado end-to-end

### 📞 **Referência Rápida de Comandos**

```bash
# Iniciar tudo (desenvolvimento)
docker compose --profile dev up --build
ngrok http 3000

# Iniciar tudo (produção)
docker compose --profile prod up --build
ngrok http 3000

# Verificar status
docker compose ps
curl http://localhost:4040/api/tunnels

# Ver logs (desenvolvimento)
docker compose logs -f app_development

# Ver logs (produção)
docker compose logs -f app_production

# Testar webhook
curl -X POST http://localhost:3000/api/payments/webhook \
  -H "Content-Type: application/json" \
  -d '{"data":{"id":"119538917962"}}'

# Reiniciar se necessário
docker compose restart
taskkill /f /im ngrok.exe && ngrok http 3000
```

---

## Fluxo de Status do Pedido e Regras de Negócio

As transições de status do pedido seguem regras de negócio rigorosas:

- **PENDING**: Pedido criado, aguardando confirmação.
- **CONFIRMED**: Pedido confirmado, aguardando pagamento.
- **PAYMENT_CONFIRMED**: Pagamento recebido, pronto para preparação.
- **PREPARING**: Pedido está sendo preparado na cozinha.
- **READY**: Pedido está pronto para retirada/entrega.
- **DELIVERED**: Pedido foi entregue ou retirado.
- **CANCELLED**: Pedido foi cancelado (não permitido após DELIVERED).

### Transições Permitidas

| De                          | Para              | Regra/Condição                        |
| --------------------------- | ----------------- | ------------------------------------- |
| PENDING                     | CONFIRMED         | Deve ter pelo menos um item           |
| CONFIRMED                   | PAYMENT_CONFIRMED | Pagamento deve ser confirmado         |
| PAYMENT_CONFIRMED           | PREPARING         | Apenas após pagamento confirmado      |
| PREPARING                   | READY             | Apenas após preparação completa       |
| READY                       | DELIVERED         | Apenas após pronto                    |
| Qualquer (exceto DELIVERED) | CANCELLED         | Pode cancelar a menos que já entregue |

### Respostas de Erro

- Transição inválida: `400 Bad Request` com mensagem como `"Order can only be marked as delivered when it is ready"`
- Cancelar após entregue: `400 Bad Request` com mensagem `"Cannot cancel an order that has been delivered"`

---

## Documentação da API

A documentação completa da API (Swagger/OpenAPI) está disponível em:

```
/api-docs
```

Acesse este endpoint no seu navegador após iniciar a aplicação para visualizar e testar todas as rotas, payloads e respostas disponíveis.

---

## Validação de Código

O projeto inclui validações automatizadas que são executadas em cada Pull Request:

### GitHub Actions

- ✅ **TypeScript Check** - Verifica tipos e erros de compilação
- ✅ **ESLint** - Valida regras de linting
- ✅ **Prettier** - Verifica formatação do código
- ✅ **Testes** - Executa suite de testes
- ✅ **Coverage** - Valida cobertura mínima de 75%

### Executar Localmente

```bash
# Executar todas as validações
npm run ci

# Validações individuais
npm run type-check  # TypeScript
npm run lint        # ESLint
npm run format:check # Prettier
npm run test:coverage # Testes + Coverage
```

### Configurações

- **ESLint**: `.eslintrc.js` - Regras de linting para TypeScript
- **Prettier**: `.prettierrc` - Formatação de código
- **Jest**: `jest.config.js` - Configuração de testes e coverage

---
