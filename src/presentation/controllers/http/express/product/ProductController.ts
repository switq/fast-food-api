import { Request, Response } from "express";
import { z } from "zod";
import { productUseCases } from "./MakeProductController";

// CREATE
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, categoryId } = z.object({
      name: z.string().min(1, "Name is required"),
      description: z.string().optional(),
      price: z.number().min(0),
      categoryId: z.string().min(1, "Category ID is required"),
    }).parse(req.body);
    const result = await productUseCases.createProduct({ name, description, price, categoryId });
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { name, description, price, categoryId } = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      price: z.number().min(0).optional(),
      categoryId: z.string().optional(),
    }).parse(req.body);
    const result = await productUseCases.updateProduct({ id, name, description, price, categoryId });
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// FIND BY ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const result = await productUseCases.findProductById({ id });
    res.status(200).json(result);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

// FIND ALL
export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const result = await productUseCases.findAllProducts();
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await productUseCases.deleteProduct({ id });
    res.status(204).send();
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};
