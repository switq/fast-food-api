import { OrderController } from "@controllers/OrderController";
import { Express, Request, Response } from "express";
import { DbConnection } from "@interfaces/dbconnection";

export function OrderApi(app: Express,dbconnection: DbConnection) {
  
  app.get("/api/orders", async (req: Request, res: Response) => {
    try {
      const result = await OrderController.listAll(dbconnection);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/orders/:id", async (req: Request, res: Response) => {
    try {
      const result = await OrderController.getById(req.params.id, dbconnection);
      if (!result) return res.status(404).json({ error: "Order not found" });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/orders", async (req: Request, res: Response) => {
    try {
      const { items, customerId } = req.body;
      const result = await OrderController.create(items, customerId, dbconnection);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });
}
