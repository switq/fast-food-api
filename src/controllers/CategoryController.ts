import { Request, Response } from "express";
import { CategoryUseCases } from "../application/use-cases/CategoryUseCases";
import { CategoryPresenter } from "../presenters/CategoryPresenter";

export class CategoryController {
  private categoryUseCases: CategoryUseCases;

  constructor(categoryUseCases: CategoryUseCases) {
    this.categoryUseCases = categoryUseCases;
  }

  public async listAll(_req: Request, res: Response): Promise<Response> {
    try {
      const output = await this.categoryUseCases.findAllCategories();
      const presenter = new CategoryPresenter();
      return res.status(200).json(presenter.listToHttp(output));
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const output = await this.categoryUseCases.findCategoryById(id);
      if (!output) {
        return res.status(404).json({ message: "Category not found" });
      }
      const presenter = new CategoryPresenter();
      return res.status(200).json(presenter.toHttp(output));
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, description } = req.body;
      const output = await this.categoryUseCases.createCategory(name, description);
      const presenter = new CategoryPresenter();
      return res.status(201).json(presenter.toHttp(output));
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}
