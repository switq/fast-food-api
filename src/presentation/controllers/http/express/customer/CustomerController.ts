import { Request, Response } from "express";
import { z } from "zod";
import { customerUseCases } from "./MakeCustomerController";

// CREATE
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, email, cpf, phone } = z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Valid email is required"),
      cpf: z.string().min(1, "CPF is required"),
      phone: z.string().optional(),
    }).parse(req.body);
    const result = await customerUseCases.createCustomer({ name, email, cpf, phone });
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE
export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { name, email, cpf, phone } = z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      cpf: z.string().optional(),
      phone: z.string().optional(),
    }).parse(req.body);
    const result = await customerUseCases.updateCustomer({ id, name, email, cpf, phone });
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// FIND BY ID
export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const result = await customerUseCases.findCustomerById({ id });
    res.status(200).json(result);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

// FIND ALL
export const getAllCustomers = async (_req: Request, res: Response) => {
  try {
    const result = await customerUseCases.findAllCustomers();
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await customerUseCases.deleteCustomer({ id });
    res.status(204).send();
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};