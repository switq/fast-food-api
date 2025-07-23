import { Request, Response } from "express";
import { z } from "zod";
import { orderUseCases } from "./MakeOrderController";

// CREATE
export const createOrder = async (req: Request, res: Response) => {
  try {
    // Adjust schema as needed
    const { customerId, items, paymentId, status } = z.object({
      customerId: z.string().min(1, "Customer ID is required"),
      items: z.array(z.object({ productId: z.string(), quantity: z.number().int().min(1) })),
      paymentId: z.string().optional(),
      status: z.string().optional(),
    }).parse(req.body);
    const result = await orderUseCases.createOrder({ customerId, items, paymentId, status });
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { customerId, items, paymentId, status } = z.object({
      customerId: z.string().optional(),
      items: z.array(z.object({ productId: z.string(), quantity: z.number().int().min(1) })).optional(),
      paymentId: z.string().optional(),
      status: z.string().optional(),
    }).parse(req.body);
    const result = await orderUseCases.updateOrder({ id, customerId, items, paymentId, status });
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// FIND BY ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const result = await orderUseCases.findOrderById({ id });
    res.status(200).json(result);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

// FIND ALL
export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const result = await orderUseCases.findAllOrders();
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await orderUseCases.deleteOrder({ id });
    res.status(204).send();
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};
