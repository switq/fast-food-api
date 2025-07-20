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

## Environment Variables

Copy `env.example` to `.env` and configure the following variables:

- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `LOG_LEVEL`: Logging level (optional)
- `CORS_origin`: CORS origin (optional)

## Payment Flow (Mercado Pago)

The API supports a complete payment flow using Mercado Pago, including QR code generation and webhook integration for status updates.

### How to Test the Payment Flow

1. **Configure Mercado Pago Credentials**
   - Add your test `MERCADO_PAGO_ACCESS_TOKEN` to `.env`.
   - Set `MERCADO_PAGO_NOTIFICATION_URL` to your public webhook endpoint (use ngrok for local development).

2. **Create an Order**
   - Use `POST /api/orders` with a valid customer and product.

3. **Generate Payment (QR Code)**
   - Use `POST /api/orders/:orderId/payment` (body is optional, e.g. `{}` or `{ "paymentMethodId": "pix" }`).
   - The response includes a QR code URL and a base64 QR code for Mercado Pago checkout.

4. **Complete Payment**
   - Scan the QR code or open the payment URL with your Mercado Pago test buyer account.

5. **Webhook Notification**
   - Mercado Pago will POST to your webhook endpoint when payment status changes.
   - The API updates the order status automatically.

### Example Postman Collection

Import `fast-food-api.postman_collection.json` into Postman for ready-to-use requests, including payment flow.

### Scripts for Automated Testing

- Bash: `scripts/test_payment_endpoint.sh`
- PowerShell: `scripts/test_payment_endpoint.ps1`

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
