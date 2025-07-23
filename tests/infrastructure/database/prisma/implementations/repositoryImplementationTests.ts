import {
  CategoryRepository,
  CustomerRepository,
  ProductRepository,
  OrderRepository,
} from "@src/infrastructure/repositories/prisma/implementations";
import Category from "@src/domain/entities/Category";
import Customer from "@src/domain/entities/Customer";
import Product from "@src/domain/entities/Product";
import Order from "@src/domain/entities/Order";
import OrderItem from "@src/domain/entities/OrderItem";

//docker compose exec app npx ts-node -r tsconfig-paths/register tests/infrastructure/database/prisma/implementations/repositoryImplementationTests.ts

// Import OrderStatus enum from Order entity
enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PAYMENT_CONFIRMED = "PAYMENT_CONFIRMED",
  PREPARING = "PREPARING",
  READY = "READY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

async function example() {
  // Criar instâncias dos repositórios
  const categoryRepo = new CategoryRepository();
  const customerRepo = new CustomerRepository();
  const productRepo = new ProductRepository();
  const orderRepo = new OrderRepository();

  try {
    console.log("🚀 Iniciando exemplo de uso dos repositórios...\n");

    // 1. Criar uma categoria
    console.log("1. Criando categoria...");

    // Verificar se a categoria já existe
    const existingCategory = await categoryRepo.findByName("Bebidas");
    let savedCategory: Category;

    if (existingCategory) {
      console.log(`ℹ️ Categoria já existe: ${existingCategory.name}`);
      savedCategory = existingCategory;
    } else {
      const category = new Category(
        undefined,
        "Bebidas",
        "Todas as bebidas disponíveis"
      );
      savedCategory = await categoryRepo.create(category);
      console.log(`✅ Categoria criada: ${savedCategory.name}`);
    }
    console.log();

    // 2. Criar um cliente
    console.log("2. Criando cliente...");

    // Verificar se o cliente já existe
    const existingCustomer = await customerRepo.findByEmail("joao@email.com");
    let savedCustomer: Customer;

    if (existingCustomer) {
      console.log(`ℹ️ Cliente já existe: ${existingCustomer.name}`);
      savedCustomer = existingCustomer;
    } else {
      const customer = new Customer(
        undefined,
        "João Silva",
        "joao@email.com",
        "123.456.789-09",
        "(11) 99999-9999"
      );
      savedCustomer = await customerRepo.create(customer);
      console.log(`✅ Cliente criado: ${savedCustomer.name}`);
    }
    console.log();

    // 3. Criar um produto
    console.log("3. Criando produto...");

    // Verificar se o produto já existe (por nome e categoria)
    const existingProducts = await productRepo.findByCategory(savedCategory.id);
    const existingProduct = existingProducts.find(
      (p: Product) => p.name === "Coca-Cola"
    );
    let savedProduct: Product;

    if (existingProduct) {
      console.log(`ℹ️ Produto já existe: ${existingProduct.name}`);
      savedProduct = existingProduct;
    } else {
      const product = new Product(
        undefined,
        "Coca-Cola",
        "Refrigerante Coca-Cola 350ml",
        5.5,
        savedCategory.id
      );
      savedProduct = await productRepo.create(product);
      console.log(
        `✅ Produto criado: ${savedProduct.name} - R$ ${savedProduct.price}`
      );
    }
    console.log();

    // 4. Buscar categoria por nome
    console.log("4. Buscando categoria por nome...");
    const foundCategory = await categoryRepo.findByName("Bebidas");
    console.log(`✅ Categoria encontrada: ${foundCategory?.name}\n`);

    // 5. Buscar cliente por email
    console.log("5. Buscando cliente por email...");
    const foundCustomer = await customerRepo.findByEmail("joao@email.com");
    console.log(`✅ Cliente encontrado: ${foundCustomer?.name}\n`);

    // 6. Buscar produtos por categoria
    console.log("6. Buscando produtos por categoria...");
    const products = await productRepo.findByCategory(savedCategory.id);
    console.log(`✅ Produtos encontrados: ${products.length}\n`);

    // 7. Listar todas as categorias
    console.log("7. Listando todas as categorias...");
    const allCategories = await categoryRepo.findAll();
    console.log(`✅ Total de categorias: ${allCategories.length}\n`);

    // 8. Atualizar um produto
    console.log("8. Atualizando produto...");
    savedProduct.price = 6.0;
    const updatedProduct = await productRepo.update(savedProduct);
    console.log(`✅ Produto atualizado: R$ ${updatedProduct.price}\n`);

    // 9. Criar um pedido
    console.log("9. Criando pedido...");

    // Cria o pedido vazio
    const order = new Order(
      undefined,
      savedCustomer.id,
      [],
      OrderStatus.PENDING
    );
    const savedOrder = await orderRepo.create(order);

    // Agora cria o item do pedido com o orderId real
    const orderItem = new OrderItem(
      undefined,
      savedOrder.id,
      savedProduct.id,
      2,
      savedProduct.price,
      "Sem gelo"
    );
    // Adiciona o item ao pedido
    const orderWithItem = new Order(
      savedOrder.id,
      savedOrder.customerId,
      [orderItem],
      savedOrder.status
    );
    const updatedOrderWithItem = await orderRepo.update(orderWithItem);
    console.log(
      `✅ Pedido criado: ID ${updatedOrderWithItem.id} - Total: R$ ${updatedOrderWithItem.totalAmount}\n`
    );

    // 10. Buscar pedidos do cliente
    console.log("10. Buscando pedidos do cliente...");
    const customerOrders = await orderRepo.findByCustomerId(savedCustomer.id);
    console.log(`✅ Pedidos do cliente: ${customerOrders.length}\n`);

    // 11. Atualizar status do pedido
    console.log("11. Atualizando status do pedido...");
    updatedOrderWithItem.confirm();
    const updatedOrder = await orderRepo.update(updatedOrderWithItem);
    console.log(`✅ Status do pedido atualizado: ${updatedOrder.status}\n`);

    // 12. Buscar cliente por CPF
    console.log("12. Buscando cliente por CPF...");
    const customerByCPF = await customerRepo.findByCPF("123.456.789-09");
    console.log(`✅ Cliente encontrado por CPF: ${customerByCPF?.name}\n`);

    // 13. Buscar produto por nome
    console.log("13. Buscando produto por nome...");
    const productByName = await productRepo.findByName("Coca-Cola");
    console.log(
      `✅ Produto encontrado por nome: ${productByName?.name} - R$ ${productByName?.price}\n`
    );

    // 14. Listar todos os produtos
    console.log("14. Listando todos os produtos...");
    const allProducts = await productRepo.findAll();
    console.log(`✅ Total de produtos: ${allProducts.length}\n`);

    // 15. Listar todos os pedidos
    console.log("15. Listando todos os pedidos...");
    const allOrders = await orderRepo.findAll();
    console.log(`✅ Total de pedidos: ${allOrders.length}\n`);

    console.log("🎉 Exemplo concluído com sucesso!");
  } catch (error) {
    console.error("❌ Erro durante o exemplo:", error);
  } finally {
    // Fechar conexões
    await categoryRepo.disconnect();
    await customerRepo.disconnect();
    await productRepo.disconnect();
    await orderRepo.disconnect();
    console.log("🔌 Conexões fechadas");
  }
}

// Executar o exemplo se este arquivo for executado diretamente
if (require.main === module) {
  example();
}

export { example };
