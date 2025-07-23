import { Request, Response } from "express";
import { z } from "zod";
import { categoryUseCases } from "./MakeCategoryController";

// CREATE
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = z.object({
      name: z.string().min(1, "Name is required"),
      description: z.string().optional(),
    }).parse(req.body);
    const result = await categoryUseCases.createCategory({ name, description: description ?? "" });
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { name, description } = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
    }).parse(req.body);
    const result = await categoryUseCases.updateCategory({ id, name, description });
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// FIND BY ID
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const result = await categoryUseCases.findCategoryById({ id });
    res.status(200).json(result);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

// FIND ALL
export const getCategoryAll = async (_req: Request, res: Response) => {
  try {
    const result = await categoryUseCases.findAllCategories();
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await categoryUseCases.deleteCategory({ id });
    res.status(204).send();
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};