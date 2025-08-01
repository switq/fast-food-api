import "dotenv/config";
import { setupCategoryRoutes } from "./CategoryApi";
import { setupProductRoutes } from "./ProductApi";
import { setupCustomerRoutes } from "./CustomerApi";
import { setupOrderRoutes } from "./OrderApi";
import { setupKitchenRoutes } from "./KitchenApi";
import { setupPaymentRoutes } from "./PaymentApi";
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import testApi from "./testApi";
import { IDatabaseConnection } from "@interfaces/IDbConnection";

export class FastFoodApp {
  start(dbConnection: IDatabaseConnection) {
    const app = express();
    app.use(express.json());
    const port = process.env.PORT ?? 3000;

    // Swagger setup
    const swaggerOptions = {
      definition: {
        openapi: "3.0.0",
        info: {
          title: "Fast Food API",
          version: "1.0.0",
        },
      },
      apis: [
        "src/infrastructure/api/*.ts",
        "src/presentation/controllers/*.ts",
      ],
    };
    const swaggerSpec = swaggerJsdoc(swaggerOptions);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Mount routers
    app.use("/api", setupCategoryRoutes(dbConnection));
    app.use("/api", setupProductRoutes(dbConnection));
    app.use("/api", setupCustomerRoutes(dbConnection));
    app.use("/api", setupOrderRoutes(dbConnection));
    app.use("/api", setupKitchenRoutes(dbConnection));
    app.use("/api", setupPaymentRoutes(dbConnection));
    app.use("/api", testApi);

    // Health check
    app.get("/health", (req, res) => {
      res.json({ status: "ok" });
    });

    app.listen(port, () => {
      console.log(`FastFood app listening on http://localhost:${port}`);
    });
  }
}
