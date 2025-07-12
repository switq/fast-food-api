import 'dotenv/config';
import { setupCategoryRoutes } from "./CategoryApi";
import { setupProductRoutes } from "./ProductApi";
import { setupCustomerRoutes } from "./CustomerApi";
import { setupOrderRoutes } from "./OrderApi";
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { CategoryRepository } from "../database/prisma/implementations/CategoryRepository";
import { ProductRepository } from "../database/prisma/implementations/ProductRepository";
import { CustomerRepository } from "../database/prisma/implementations/CustomerRepository";
import { OrderRepository } from "../database/prisma/implementations/OrderRepository";
import { CategoryUseCases } from "../../application/use-cases/CategoryUseCases";
import ProductUseCases from "../../application/use-cases/ProductUseCases";
import CustomerUseCases from "../../application/use-cases/CustomerUseCases";
import OrderUseCases from "../../application/use-cases/OrderUseCases";
import { CategoryController } from "../../presentation/controllers/CategoryController";
import { ProductController } from "../../presentation/controllers/ProductController";
import { CustomerController } from "../../presentation/controllers/CustomerController";
import { OrderController } from "../../presentation/controllers/OrderController";
import testApi from "./testApi";

export class FastFoodApp {
  start() {
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
      apis: ["src/api/*.ts", "src/controllers/*.ts"],
    };
    const swaggerSpec = swaggerJsdoc(swaggerOptions);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Instantiate repositories
    const categoryRepository = new CategoryRepository();
    const productRepository = new ProductRepository();
    const customerRepository = new CustomerRepository();
    const orderRepository = new OrderRepository();

    // Instantiate use cases
    const categoryUseCases = new CategoryUseCases(categoryRepository);
    const productUseCases = new ProductUseCases();
    const customerUseCases = new CustomerUseCases();
    const orderUseCases = new OrderUseCases();

    // Instantiate controllers
    const categoryController = new CategoryController(categoryUseCases);
    const productController = new ProductController(
      productUseCases,
      productRepository,
      categoryRepository
    );
    const customerController = new CustomerController(
      customerUseCases,
      customerRepository
    );
    const orderController = new OrderController(
      orderUseCases,
      orderRepository,
      productRepository,
      customerRepository
    );

    // Mount routers
    app.use("/api", setupCategoryRoutes(categoryController));
    app.use("/api", setupProductRoutes(productController));
    app.use("/api", setupCustomerRoutes(customerController));
    app.use("/api", setupOrderRoutes(orderController));
    app.use("/api", testApi);

    // Health check
    app.get("/health", (req, res) => {
      res.json({ status: "ok" });
    });

    app.listen(port, () => {
      console.log(`FastFood app listening on port ${port}`);
    });
  }
}
