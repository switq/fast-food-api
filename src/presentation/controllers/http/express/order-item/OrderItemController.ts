import { Request, Response } from "express";
import { z } from "zod";
import { orderItemUseCases } from "./MakeOrderItemController";

// CREATE
export const createOrderItem = async (req: Request, res: Response) => {
  try {
    const { orderId, productId, quantity } = z.object({
      orderId: z.string().min(1, "Order ID is required"),
      productId: z.string().min(1, "Product ID is required"),
      quantity: z.number().int().min(1),
    }).parse(req.body);
    const result = await orderItemUseCases.createOrderItem({ orderId, productId, quantity });
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE
export const updateOrderItem = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { orderId, productId, quantity } = z.object({
      orderId: z.string().optional(),
      productId: z.string().optional(),
      quantity: z.number().int().min(1).optional(),
    }).parse(req.body);
    const result = await orderItemUseCases.updateOrderItem({ id, orderId, productId, quantity });
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// FIND BY ID
export const getOrderItemById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const result = await orderItemUseCases.findOrderItemById({ id });
    res.status(200).json(result);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

// FIND ALL
export const getAllOrderItems = async (_req: Request, res: Response) => {
  try {
    const result = await orderItemUseCases.findAllOrderItems();
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deleteOrderItem = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await orderItemUseCases.deleteOrderItem({ id });
    res.status(204).send();
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};
