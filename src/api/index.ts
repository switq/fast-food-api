import { CategoryApi } from "./CategoryApi";
import { ProductApi } from "./ProductApi";
import { CustomerApi } from "./CustomerApi";
import { OrderApi } from "./OrderApi";
import express from "express";
import { DbConnection } from "@interfaces/dbconnection";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

export class FastFoodApp {
  private _dbconnection: DbConnection;

  constructor(dbconnection: DbConnection) {
    this._dbconnection = dbconnection;
  }
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
      apis: [
        "./src/api/*.ts",
        "./src/controllers/*.ts"
      ],
    };
    const swaggerSpec = swaggerJsdoc(swaggerOptions);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Binding das rotas de cada feature
    CategoryApi(app,this._dbconnection);
    ProductApi(app,this._dbconnection);
    CustomerApi(app,this._dbconnection);
    OrderApi(app,this._dbconnection);

    // Health check
    app.get("/health", (req, res) => {
      res.json({ status: "ok" });
    });

    app.listen(port, () => {
      console.log(`FastFood app listening on port ${port}`);
    });
  }
}
