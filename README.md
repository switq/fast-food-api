# Fast Food API

A TypeScript-based REST API for a fast food restaurant using Express and Prisma.

## Setup

### Option 1: Using Docker (Recommended)

1. Clone the repository and navigate to the project directory:

```bash
git clone <repository-url>
cd fast-food-api
```

2. Start the application with Docker Compose:

```bash
docker compose up --build
```

This will start both the PostgreSQL database and the application automatically, including seeding the database with sample data.

### Option 2: Local Development

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory:

```bash
cp env.example .env
```

3. Update the `.env` file with your database configuration:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/fast_food_db?schema=public"
PORT=3000
NODE_ENV=development
```

4. Initialize the database:

```bash
npm run db:push
```

5. Generate Prisma Client:

```bash
npm run db:generate
```

6. Seed the database with sample data:

```bash
npm run db:seed
```

## Development

### With Docker

The application will automatically restart when you make changes to the code.

### Without Docker

Run the development server:

```bash
npm run dev
```

## Build

Build the project:

```bash
npm run build
```

Run the production server:

```bash
npm start
```

## Database Schema

The application includes the following models:

- **Customer**: Customer information with name, email, CPF, and phone
- **Category**: Product categories (Hambúrgueres, Bebidas, etc.)
- **Product**: Food items with name, description, price, category, and availability
- **Order**: Customer orders with status tracking
- **OrderItem**: Individual items within an order

## Sample Data

The database is automatically seeded with:

- **5 Categories**: Hambúrgueres, Bebidas, Acompanhamentos, Sobremesas, Combos
- **13 Products**: Various hamburgers, drinks, sides, desserts, and combo meals
- **5 Customers**: Sample customer data with valid CPF and phone numbers
- **3 Sample Orders**: Orders in different statuses with realistic items

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /products` - Get all products
- `POST /products` - Create a new product
- `GET /orders` - Get all orders
- `POST /orders` - Create a new order
- `GET /customers` - Get all customers
- `POST /customers` - Create a new customer
- `GET /categories` - Get all categories

## Database Commands

- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed database with sample data (skips if data exists)
- `npm run db:seed:force` - Force seed database (clears existing data first)
- `npm run db:reset` - Reset database and seed with sample data
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Docker Commands

- **Start all services (app + database):**
  ```bash
  docker-compose up --build
  ```
- **Stop all services:**
  ```bash
  docker-compose down
  ```
- **View logs:**
  ```bash
  docker-compose logs -f
  ```
- **Rebuild containers:**
  ```bash
  docker-compose up --build --force-recreate
  ```
- **Access a running container (bash):**
  ```bash
  docker-compose exec app bash
  ```

---

## Environment Variables

Copy `env.example` to `.env` and configure the following variables:

- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `LOG_LEVEL`: Logging level (optional)
- `CORS_origin`: CORS origin (optional)

## Payment Flow (Mercado Pago)

The API supports a complete payment flow using Mercado Pago, including QR code generation and webhook integration for status updates.

### 🚀 **Complete Setup Guide**

#### **1. Configure Environment Variables**

Add the following to your `.env` file:

```env
# Mercado Pago Configuration
MERCADO_PAGO_ACCESS_TOKEN=TEST-your-access-token-here
MERCADO_PAGO_NOTIFICATION_URL=https://your-ngrok-url.ngrok-free.app/api/payments/webhook

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/fastfood?schema=public"

# Server
PORT=3000
NODE_ENV=development
```

#### **2. Setup ngrok for Webhook (Required for Local Development)**

**Install ngrok:**
- Download from: https://ngrok.com/download
- Or install via package manager: `npm install -g ngrok`

**Configure ngrok:**
```bash
# Authenticate (get token from ngrok.com)
ngrok config add-authtoken YOUR_NGROK_TOKEN

# Start tunnel for port 3000
ngrok http 3000
```

**Get your webhook URL:**
```bash
# Check active tunnels
curl http://localhost:4040/api/tunnels

# Your webhook URL will be something like:
# https://abc123.ngrok-free.app/api/payments/webhook
```

#### **3. Configure Mercado Pago Webhook**

1. **Access Mercado Pago Developer Panel:**
   - Go to: https://www.mercadopago.com.br/developers/panel
   - Navigate to: Applications → Your App → Webhooks

2. **Add Webhook Configuration:**
   ```
   URL: https://your-ngrok-url.ngrok-free.app/api/payments/webhook
   Events: payment.created, payment.updated
   ```

3. **Test Webhook:**
   - Use the "Test" button in Mercado Pago panel
   - Or use Postman collection provided

#### **4. Start the Application**

```bash
# Start with Docker (recommended)
docker-compose up --build

# Or start locally
npm install
npm run dev
```

#### **5. Verify Setup**

**Check if everything is running:**
```bash
# Test application
curl http://localhost:3000/api/health

# Test ngrok tunnel
curl https://your-ngrok-url.ngrok-free.app/api/health

# Test webhook endpoint
curl -X POST https://your-ngrok-url.ngrok-free.app/api/payments/webhook \
  -H "Content-Type: application/json" \
  -d '{"data":{"id":"test"}}'
```

### 🔄 **Payment Flow Testing**

#### **Step 1: Create Customer and Order**

```bash
# Create customer
POST /api/customers
{
  "name": "João Silva",
  "email": "joao@example.com",
  "cpf": "12345678901",
  "phone": "11999999999"
}

# Create order
POST /api/orders
{
  "customerId": "customer-id-from-above",
  "items": [
    {
      "productId": "product-id",
      "quantity": 1
    }
  ]
}
```

#### **Step 2: Generate Payment QR Code**

```bash
# Generate payment
POST /api/orders/{orderId}/payment
{
  "paymentMethodId": "pix"
}

# Response includes:
{
  "orderId": "...",
  "paymentProviderId": "...",
  "qrCode": "https://mercadopago.com/...",
  "qrCodeBase64": "data:image/png;base64,..."
}
```

#### **Step 3: Complete Payment**

1. **Scan QR Code** with Mercado Pago test account
2. **Complete payment** in Mercado Pago interface
3. **Webhook automatically updates** order status

#### **Step 4: Monitor Payment Status**

```bash
# Check order status (from database)
GET /api/payments/order/{orderId}/status

# Check real-time status (from Mercado Pago)
GET /api/payments/order/{orderId}/status?provider=true

# Monitor logs
docker-compose logs -f app
```

### 🛠️ **Troubleshooting**

#### **ngrok Issues**

If you get `ERR_NGROK_3004` error:

```bash
# 1. Stop ngrok
taskkill /f /im ngrok.exe  # Windows
# or
pkill ngrok  # Linux/Mac

# 2. Restart ngrok correctly
ngrok http 3000

# 3. Update webhook URL in Mercado Pago panel
```

**Run diagnostic script:**
```bash
# Windows
.\diagnose_ngrok.ps1

# Check if ngrok is pointing to http://localhost:3000 (not https)
```

#### **Webhook Not Receiving**

1. **Check ngrok status:**
   ```bash
   curl http://localhost:4040/api/tunnels
   ```

2. **Test webhook manually:**
   ```bash
   curl -X POST https://your-ngrok-url.ngrok-free.app/api/payments/webhook \
     -H "Content-Type: application/json" \
     -d '{"data":{"id":"119538917962"}}'
   ```

3. **Check application logs:**
   ```bash
   docker-compose logs -f app
   ```

#### **Payment Status Not Updating**

1. **Verify webhook URL** in Mercado Pago panel
2. **Check order exists** in database
3. **Verify payment ID** is correct
4. **Check logs** for error messages

### 📚 **Documentation and Tools**

#### **Postman Collections**

Import these collections for testing:

1. **`fast-food-api.postman_collection.json`** - Complete API testing
2. **`mercado-pago-monitoring.postman_collection.json`** - Payment monitoring

#### **Testing Scripts**

- **PowerShell**: `scripts/test_payment_endpoint.ps1`
- **Bash**: `scripts/test_payment_endpoint.sh`
- **Node.js**: `test_payment_flow.js`

#### **Monitoring Tools**

- **ngrok Interface**: http://localhost:4040
- **Application Logs**: `docker-compose logs -f app`
- **Mercado Pago Panel**: https://www.mercadopago.com.br/developers/panel

#### **Alternative Testing (if ngrok fails)**

Use **webhook.site** for temporary testing:

1. Go to: https://webhook.site
2. Copy the unique URL
3. Configure in Mercado Pago temporarily
4. View webhook requests in real-time
5. Copy payload to test locally

### 🎯 **Order Status Flow**

The payment webhook automatically manages order status transitions:

```
PENDING → CONFIRMED → PAYMENT_CONFIRMED → PREPARING → READY → DELIVERED
```

**Webhook Processing:**
1. Receives payment notification from Mercado Pago
2. Fetches payment status from Mercado Pago API
3. Finds order by external reference
4. Updates payment status
5. Transitions order status if payment approved:
   - `PENDING` → `CONFIRMED` → `PAYMENT_CONFIRMED`

### 🔧 **Environment Setup Checklist**

- [ ] Docker installed and running
- [ ] ngrok installed and authenticated
- [ ] Mercado Pago test account created
- [ ] Access token configured in `.env`
- [ ] ngrok tunnel started (`ngrok http 3000`)
- [ ] Webhook URL configured in Mercado Pago panel
- [ ] Application running (`docker-compose up`)
- [ ] Webhook tested and receiving requests
- [ ] Payment flow tested end-to-end

### 📞 **Quick Commands Reference**

```bash
# Start everything
docker-compose up --build
ngrok http 3000

# Check status
docker-compose ps
curl http://localhost:4040/api/tunnels

# View logs
docker-compose logs -f app

# Test webhook
curl -X POST http://localhost:3000/api/payments/webhook \
  -H "Content-Type: application/json" \
  -d '{"data":{"id":"119538917962"}}'

# Restart if needed
docker-compose restart
taskkill /f /im ngrok.exe && ngrok http 3000
```

---

## Order Status Flow & Business Rules

The order status transitions follow strict business rules:

- **PENDING**: Order created, awaiting confirmation.
- **CONFIRMED**: Order confirmed, awaiting payment.
- **PAYMENT_CONFIRMED**: Payment received, ready for preparation.
- **PREPARING**: Order is being prepared in the kitchen.
- **READY**: Order is ready for pickup/delivery.
- **DELIVERED**: Order has been delivered or picked up.
- **CANCELLED**: Order was cancelled (not allowed after DELIVERED).

### Allowed Transitions

| From                | To                   | Rule/Condition                        |
|---------------------|----------------------|---------------------------------------|
| PENDING             | CONFIRMED            | Must have at least one item           |
| CONFIRMED           | PAYMENT_CONFIRMED    | Payment must be confirmed             |
| PAYMENT_CONFIRMED   | PREPARING            | Only after payment confirmed          |
| PREPARING           | READY                | Only after preparation complete       |
| READY               | DELIVERED            | Only after ready                      |
| Any (except DELIVERED) | CANCELLED         | Can cancel unless already delivered   |

### Error Responses

- Invalid transition: `400 Bad Request` with message like `"Order can only be marked as delivered when it is ready"`
- Cancel after delivered: `400 Bad Request` with message `"Cannot cancel an order that has been delivered"`

---

## API Documentation

The full API documentation (Swagger/OpenAPI) is available at:

```
/api-docs
```

Access this endpoint in your browser after starting the application to view and test all available routes, payloads, and responses.

---
