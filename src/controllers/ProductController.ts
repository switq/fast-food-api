import { Request, Response } from "express";
import ProductUseCases from "../application/use-cases/ProductUseCases";
import { ProductRepository } from "../infrastructure/database/prisma/implementations/ProductRepository";
import { CategoryRepository } from "../infrastructure/database/prisma/implementations/CategoryRepository";
import { ProductPresenter } from "../presenters/ProductPresenter";

const productUseCases = new ProductUseCases();
const productRepository = new ProductRepository();
const categoryRepository = new CategoryRepository();

export default class ProductController {
  static async listAll(req: Request, res: Response) {
    try {
      const products = await productUseCases.findAllProducts(productRepository);
      res.json(ProductPresenter.listToHttp(products));
    } catch (err: any) {
      res.status(500).json(ProductPresenter.error(err));
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const product = await productUseCases.findProductById(req.params.id, productRepository);
      res.json(ProductPresenter.toHttp(product));
    } catch (err: any) {
      res.status(404).json(ProductPresenter.error(err));
    }
  }

  static async listByCategory(req: Request, res: Response) {
    try {
      const products = await productUseCases.findProductsByCategory(req.params.categoryId, productRepository);
      res.json(ProductPresenter.listToHttp(products));
    } catch (err: any) {
      res.status(500).json(ProductPresenter.error(err));
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { name, description, price, categoryId, imageUrl } = req.body;
      const product = await productUseCases.createProduct(name, description, price, categoryId, imageUrl, productRepository, categoryRepository);
      res.status(201).json(ProductPresenter.toHttp(product));
    } catch (err: any) {
      res.status(400).json(ProductPresenter.error(err));
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { name, description, price, categoryId, imageUrl, isAvailable } = req.body;
      const product = await productUseCases.updateProduct(req.params.id, name, description, price, categoryId, imageUrl, isAvailable, productRepository);
      res.json(ProductPresenter.toHttp(product));
    } catch (err: any) {
      res.status(400).json(ProductPresenter.error(err));
    }
  }

  static async remove(req: Request, res: Response) {
    try {
      await productUseCases.deleteProduct(req.params.id, productRepository);
      res.status(204).send();
    } catch (err: any) {
      res.status(404).json(ProductPresenter.error(err));
    }
  }
}
