import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import router from "./routes";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fast Food API",
      version: "1.0.0",
      description: "API de autoatendimento para lanchonete - SOAT Tech Challenge",
    },
    servers: [
      {
        url: "/api",
        description: "API base path"
      }
    ]
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api", router);

// Basic health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

async function main() {
  try {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
}

main();
