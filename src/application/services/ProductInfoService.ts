import Order from "../../domain/entities/Order";
import Product from "../../domain/entities/Product";
import { IProductRepository } from "@repositories/IProductRepository";

class ProductInfoService {
  static async getProductsFromOrders(
    orders: Order[],
    productRepository: IProductRepository
  ): Promise<Map<string, Product>> {
    // Buscar todos os produtos únicos dos pedidos
    const productIds = new Set<string>();
    orders.forEach((order) => {
      order.items.forEach((item) => {
        productIds.add(item.productId);
      });
    });

    // Buscar informações dos produtos
    const products = new Map<string, Product>();
    for (const productId of productIds) {
      const product = await productRepository.findById(productId);
      if (product) {
        products.set(productId, product);
      }
    }

    return products;
  }

  static async getProductsFromOrder(
    order: Order,
    productRepository: IProductRepository
  ): Promise<Map<string, Product>> {
    return this.getProductsFromOrders([order], productRepository);
  }
}

export default ProductInfoService;
