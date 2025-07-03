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
- `CORS_ORIGIN`: CORS origin (optional)
