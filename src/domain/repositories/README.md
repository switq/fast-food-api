# Repositórios com Prisma

Este diretório contém a implementação dos repositórios usando Prisma ORM com padrão de herança e organização hierárquica.

## Estrutura de Pastas

```
repositories/
├── interfaces/           # Interfaces dos repositórios
│   ├── ICategoryRepository.ts
│   ├── ICustomerRepository.ts
│   ├── IProductRepository.ts
│   ├── IOrderRepository.ts
│   └── index.ts
├── implementations/      # Implementações concretas
│   ├── BaseRepository.ts
│   ├── CategoryRepository.ts
│   ├── CustomerRepository.ts
│   ├── ProductRepository.ts
│   ├── OrderRepository.ts
│   └── index.ts
├── example.ts           # Exemplo de uso
├── README.md           # Esta documentação
└── index.ts            # Exportações principais
```

## Arquitetura

### Interfaces (`/interfaces`)

Contém as definições de contrato para cada repositório:

- `ICategoryRepository`: Contrato para operações de categorias
- `ICustomerRepository`: Contrato para operações de clientes
- `IProductRepository`: Contrato para operações de produtos
- `IOrderRepository`: Contrato para operações de pedidos

### Implementações (`/implementations`)

Contém as implementações concretas usando Prisma:

#### BaseRepository

Classe abstrata que fornece funcionalidades básicas de CRUD:

- `create(entity)`: Cria uma nova entidade
- `findById(id)`: Busca entidade por ID
- `findAll()`: Lista todas as entidades
- `update(entity)`: Atualiza uma entidade
- `delete(id)`: Remove uma entidade
- `disconnect()`: Fecha a conexão com o banco

#### Repositórios Específicos

- **CategoryRepository**: Herda de `BaseRepository<Category>`, implementa `ICategoryRepository`
- **CustomerRepository**: Herda de `BaseRepository<Customer>`, implementa `ICustomerRepository`
- **ProductRepository**: Herda de `BaseRepository<Product>`, implementa `IProductRepository`
- **OrderRepository**: Herda de `BaseRepository<Order>`, implementa `IOrderRepository`

## Exemplo de Uso

```typescript
// Importar interfaces
import {
  ICategoryRepository,
  ICustomerRepository,
} from "./repositories/interfaces";

// Importar implementações
import {
  CategoryRepository,
  CustomerRepository,
} from "./repositories/implementations";

// Ou importar tudo de uma vez
import { CategoryRepository, ICategoryRepository } from "./repositories";

// Criar instâncias
const categoryRepo: ICategoryRepository = new CategoryRepository();
const customerRepo: ICustomerRepository = new CustomerRepository();

// Usar os repositórios
const category = await categoryRepo.create(
  new Category("Bebidas", "Todas as bebidas")
);
const customer = await customerRepo.findByEmail("joao@email.com");
```

## Características

- **Separação de Responsabilidades**: Interfaces separadas das implementações
- **Herança**: Todos os repositórios herdam de `BaseRepository`
- **Type Safety**: Uso de generics para type safety
- **Transações**: OrderRepository usa transações para operações complexas
- **Mapeamento**: Conversão automática entre entidades de domínio e dados do Prisma
- **Injeção de Dependência**: Fácil substituição de implementações através das interfaces
