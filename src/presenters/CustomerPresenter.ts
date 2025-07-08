
export class CustomerPresenter {
  static toHttp(customer: any) {
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      cpf: customer.cpf,
      phone: customer.phone,
    };
  }

  static listToHttp(customers: any[]) {
    return customers.map(CustomerPresenter.toHttp);
  }

  static error(error: any) {
    return { error: error.message };
  }
}
