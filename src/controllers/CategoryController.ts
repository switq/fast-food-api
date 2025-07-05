import { Request, Response } from "express";
import CategoryUseCases from "../application/use-cases/CategoryUseCases";
import { CategoryRepository } from "../infrastructure/database/prisma/implementations/CategoryRepository";
import { CategoryPresenter } from "../presenters/CategoryPresenter";

const categoryUseCases = new CategoryUseCases();
const categoryRepository = new CategoryRepository();

export default class CategoryController {
  static async listAll(req: Request, res: Response) {
    try {
      const categories = await categoryUseCases.findAllCategories(categoryRepository);
      res.json(CategoryPresenter.listToHttp(categories));
    } catch (err: any) {
      res.status(500).json(CategoryPresenter.error(err));
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const category = await categoryUseCases.findCategoryById(req.params.id, categoryRepository);
      res.json(CategoryPresenter.toHttp(category));
    } catch (err: any) {
      res.status(404).json(CategoryPresenter.error(err));
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      const category = await categoryUseCases.createCategory(name, description, categoryRepository);
      res.status(201).json(CategoryPresenter.toHttp(category));
    } catch (err: any) {
      res.status(400).json(CategoryPresenter.error(err));
    }
  }
}
