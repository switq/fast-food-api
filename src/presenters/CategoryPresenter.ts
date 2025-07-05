
export class CategoryPresenter {
  static toHttp(category: any) {
    // Ajuste o formato conforme necessário para a resposta da API
    return {
      id: category.id,
      name: category.name,
      description: category.description,
    };
  }

  static listToHttp(categories: any[]) {
    return categories.map(CategoryPresenter.toHttp);
  }

  static error(error: any) {
    return { error: error.message };
  }
}
