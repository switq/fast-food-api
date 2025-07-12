import { Request, Response } from "express";
import ProductUseCases from "../../application/use-cases/ProductUseCases";
import { ProductPresenter } from "../presenters/ProductPresenter";
import { IProductRepository } from "../../application/repositories/IProductRepository";
import { ICategoryRepository } from "../../application/repositories/ICategoryRepository";

export class ProductController {
  private readonly productUseCases: ProductUseCases;
  private readonly productRepository: IProductRepository;
  private readonly categoryRepository: ICategoryRepository;

  constructor(
    productUseCases: ProductUseCases,
    productRepository: IProductRepository,
    categoryRepository: ICategoryRepository
  ) {
    this.productUseCases = productUseCases;
    this.productRepository = productRepository;
    this.categoryRepository = categoryRepository;
  }

  public async listAll(_req: Request, res: Response): Promise<Response> {
    try {
      const output = await this.productUseCases.findAllProducts(
        this.productRepository
      );
      return res.status(200).json(ProductPresenter.listToHttp(output));
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const output = await this.productUseCases.findProductById(
        id,
        this.productRepository
      );
      if (!output) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json(ProductPresenter.toHttp(output));
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, description, price, categoryId, imageUrl } = req.body;
      const output = await this.productUseCases.createProduct(
        name,
        description,
        price,
        categoryId,
        imageUrl,
        this.productRepository,
        this.categoryRepository
      );
      return res.status(201).json(ProductPresenter.toHttp(output));
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { name, description, price, categoryId, imageUrl, isAvailable } =
        req.body;
      const output = await this.productUseCases.updateProduct(
        id,
        name,
        description,
        price,
        categoryId,
        imageUrl,
        isAvailable,
        this.productRepository
      );
      return res.status(200).json(ProductPresenter.toHttp(output));
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  public async remove(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await this.productUseCases.deleteProduct(id, this.productRepository);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}
