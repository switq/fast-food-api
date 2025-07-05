import { Request, Response } from "express";
import CategoryUseCases from "../application/use-cases/CategoryUseCases";
import { CategoryRepository } from "../infrastructure/database/prisma/implementations/CategoryRepository";

const categoryUseCases = new CategoryUseCases();
const categoryRepository = new CategoryRepository();

export default class CategoryController {
  static async listAll(req: Request, res: Response) {
    try {
      const categories = await categoryUseCases.findAllCategories(categoryRepository);
      res.json(categories);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const category = await categoryUseCases.findCategoryById(req.params.id, categoryRepository);
      res.json(category);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      const category = await categoryUseCases.createCategory(name, description, categoryRepository);
      res.status(201).json(category);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
