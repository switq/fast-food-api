import Customer from "@src/domain/entities/Customer";

export function customerToJSON(customer: Customer) {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    cpf: customer.cpf,
  };
}