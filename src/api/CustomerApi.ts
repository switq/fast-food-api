import { CustomerController } from "@controllers/CustomerController";
import { Express, Request, Response } from "express";
import { DbConnection } from "@interfaces/dbconnection";

export function CustomerApi(app: Express,dbconnection: DbConnection) {

  app.get("/api/customers", async (req: Request, res: Response) => {
    try {
      const result = await CustomerController.listAll(dbconnection);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/customers/:id", async (req: Request, res: Response) => {
    try {
      const result = await CustomerController.getById(req.params.id, dbconnection);
      if (!result) return res.status(404).json({ error: "Customer not found" });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/customers", async (req: Request, res: Response) => {
    try {
      const { name, email, cpf, phone } = req.body;
      const result = await CustomerController.create(name, email, cpf, phone, dbconnection);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });
}
