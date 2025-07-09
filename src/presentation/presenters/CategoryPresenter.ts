export class CategoryPresenter {
  toHttp(category: any) {
    // Ajuste o formato conforme necessário para a resposta da API
    return {
      id: category.id,
      name: category.name,
      description: category.description,
    };
  }

  listToHttp(categories: any[]) {
    return categories.map(this.toHttp);
  }

  error(error: any) {
    return { error: error.message };
  }
}
