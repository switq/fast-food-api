import { Request, Response } from "express";
import { z } from "zod";
import { paymentUseCases } from "./MakePaymentController";

// CREATE
export const createPayment = async (req: Request, res: Response) => {
  try {
    const { orderId, amount, method, status } = z.object({
      orderId: z.string().min(1, "Order ID is required"),
      amount: z.number().min(0),
      method: z.string().min(1, "Payment method is required"),
      status: z.string().optional(),
    }).parse(req.body);
    const result = await paymentUseCases.createPayment({ orderId, amount, method, status });
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE
export const updatePayment = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { orderId, amount, method, status } = z.object({
      orderId: z.string().optional(),
      amount: z.number().min(0).optional(),
      method: z.string().optional(),
      status: z.string().optional(),
    }).parse(req.body);
    const result = await paymentUseCases.updatePayment({ id, orderId, amount, method, status });
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// FIND BY ID
export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const result = await paymentUseCases.findPaymentById({ id });
    res.status(200).json(result);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

// FIND ALL
export const getAllPayments = async (_req: Request, res: Response) => {
  try {
    const result = await paymentUseCases.findAllPayments();
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deletePayment = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await paymentUseCases.deletePayment({ id });
    res.status(204).send();
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};
