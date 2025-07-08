
export class ProductPresenter {
  static toHttp(product: any) {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId,
    };
  }

  static listToHttp(products: any[]) {
    return products.map(ProductPresenter.toHttp);
  }

  static error(error: any) {
    return { error: error.message };
  }
}
