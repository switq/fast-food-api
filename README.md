# Fast Food API

A TypeScript-based REST API for a fast food restaurant using Express and Prisma.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following content:
```
DATABASE_URL="postgresql://user:password@localhost:5432/fast_food_db?schema=public"
PORT=3000
```

3. Initialize the database:
```bash
npx prisma migrate dev
```

4. Generate Prisma Client:
```bash
npx prisma generate
```

## Development

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

## API Endpoints

- `GET /health` - Health check endpoint 