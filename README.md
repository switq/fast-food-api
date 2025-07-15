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

## Testing the Payment Flow

To test the end-to-end payment flow with Mercado Pago, follow these steps:

### 1. Configure Your Environment

1.  **Create a `.env` file** by copying the `env.example` file:
    ```bash
    cp env.example .env
    ```
2.  **Add your Mercado Pago test credentials** to the `.env` file. You will need your test "Access Token". You can find this in your Mercado Pago developer dashboard under "Your applications" > "Credentials".
    ```env
    MERCADO_PAGO_ACCESS_TOKEN=YOUR_TEST_ACCESS_TOKEN
    ```

### 2. Expose Your Local Server with ngrok

To receive webhook notifications from Mercado Pago, your local server needs to be accessible from the internet.

1.  **Install ngrok**: Follow the instructions on the [official website](https://ngrok.com/download).
2.  **Start ngrok**: Open a new terminal and run the following command to expose your local port 3000:
    ```bash
    ngrok http 3000
    ```
3.  **Get the public URL**: ngrok will give you a public URL that looks something like `https://<random-string>.ngrok-free.app`.
4.  **Add the notification URL to your `.env` file**:
    ```env
    MERCADO_PAGO_NOTIFICATION_URL=https://<your-ngrok-url>.ngrok-free.app/api/test/webhook
    ```

### 3. Run the Application with Docker

1.  **Start the application** with Docker Compose:
    ```bash
    docker-compose up --build
    ```
    This will start the application and the database in Docker containers.

### 4. Test with Postman

1.  **Import the Postman collection**: Import the `fast-food-api.postman_collection.json` file into Postman.
2.  **Send the test request**: In the "Fast Food API" collection, send the "Test Payment" request.
3.  **Pay with your test account**: The response will contain a QR code and a checkout URL. Scan the QR code with the Mercado Pago app (logged in with your test buyer account) or open the URL in your browser to complete the payment.
4.  **Check for the webhook notification**: In the terminal where `docker-compose` is running, you should see the webhook notification from Mercado Pago logged to the console. This confirms that the payment was successful and your application was notified.

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
