# Fast Food API

Uma API REST baseada em TypeScript para um restaurante de fast food usando Express e Prisma.

## Configuração

1. Clone o repositório e navegue até o diretório do projeto:

```bash
git clone <url-do-repositório>
cd fast-food-api
```

2. Configure as variáveis de ambiente:

```bash
cp env.example .env
```

3. Inicie a aplicação com Docker Compose:

**Para Desenvolvimento:**
```bash
docker compose --profile dev up --build
```

**Para Produção:**
```bash
docker compose --profile prod up --build
```

Isso iniciará automaticamente o banco de dados PostgreSQL e a aplicação, incluindo o preenchimento do banco com dados de exemplo.

## Desenvolvimento

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
# Acessar o container da aplicação
docker compose exec app_development sh

# Dentro do container:
npm run db:generate    # Gera o cliente Prisma
npm run db:push        # Envia alterações do schema
npm run db:seed        # Preenche com dados de exemplo
npm run db:reset       # Reseta e preenche o banco
```

**Prisma Studio:**
- Disponível em `http://localhost:5555` quando usando `--profile dev`
- Ou execute localmente: `npm run db:studio`

## Variáveis de Ambiente

Copie `env.example` para `.env` e configure as seguintes variáveis:

- `DATABASE_URL`: String de conexão PostgreSQL
- `PORT`: Porta do servidor (padrão: 3000)
- `NODE_ENV`: Ambiente (development/production)
- `LOG_LEVEL`: Nível de log (opcional)
- `CORS_origin`: Origem CORS (opcional)

## Fluxo de Pagamento (Mercado Pago)

A API suporta um fluxo completo de pagamento usando Mercado Pago, incluindo geração de QR code e integração de webhook para atualizações de status.

### Como Testar o Fluxo de Pagamento

1. **Configure as Credenciais do Mercado Pago**
   - Adicione seu `MERCADO_PAGO_ACCESS_TOKEN` de teste ao `.env`.
   - Configure `MERCADO_PAGO_NOTIFICATION_URL` para seu endpoint de webhook público (use ngrok para desenvolvimento local).

2. **Crie um Pedido**
   - Use `POST /api/orders` com um cliente e produto válidos.

3. **Gere o Pagamento (QR Code)**
   - Use `POST /api/orders/:orderId/payment` (corpo é opcional, ex: `{}` ou `{ "paymentMethodId": "pix" }`).
   - A resposta inclui uma URL do QR code e um QR code base64 para checkout do Mercado Pago.

4. **Complete o Pagamento**
   - Escaneie o QR code ou abra a URL de pagamento com sua conta de comprador de teste do Mercado Pago.

5. **Notificação de Webhook**
   - O Mercado Pago fará POST para seu endpoint de webhook quando o status do pagamento mudar.
   - A API atualiza o status do pedido automaticamente.

### Coleção de Exemplo do Postman

Importe `fast-food-api.postman_collection.json` no Postman para requisições prontas para uso, incluindo o fluxo de pagamento.

### Scripts para Teste Automatizado

- Bash: `scripts/test_payment_endpoint.sh`
- PowerShell: `scripts/test_payment_endpoint.ps1`

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

| De                  | Para                 | Regra/Condição                         |
|---------------------|----------------------|----------------------------------------|
| PENDING             | CONFIRMED            | Deve ter pelo menos um item            |
| CONFIRMED           | PAYMENT_CONFIRMED    | Pagamento deve ser confirmado          |
| PAYMENT_CONFIRMED   | PREPARING            | Apenas após pagamento confirmado       |
| PREPARING           | READY                | Apenas após preparação completa        |
| READY               | DELIVERED            | Apenas após pronto                     |
| Qualquer (exceto DELIVERED) | CANCELLED     | Pode cancelar a menos que já entregue |

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
