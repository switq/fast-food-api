import swaggerJSDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "API Documentation",
        version: "1.0.0",
        description: "Automatically generated Swagger documentation",
    },
    servers: [
        {
            url: "http://localhost:3000/api/v1",
            description: "Development server",
        },
    ],
}

const options = {
    swaggerDefinition,
    apis: [
        "src/adapter/driver/http/express/categories/index.ts",
        "dist/adapter/driver/http/express/categories/index.js",
        "src/adapter/driver/http/express/products/index.ts",
        "dist/adapter/driver/http/express/products/index.js",
        "src/adapter/driver/http/express/clients/index.ts",
        "dist/adapter/driver/http/express/clients/index.js",
        "src/adapter/driver/http/express/orders/index.ts",
        "dist/adapter/driver/http/express/orders/index.js",
        "src/adapter/driver/http/express/order-items/index.ts",
        "dist/adapter/driver/http/express/order-items/index.js",
        "src/adapter/driver/http/express/payments/index.ts",
        "dist/adapter/driver/http/express/payments/index.js",
    ],
}

const swaggerSpec = swaggerJSDoc(options)

export { swaggerSpec, swaggerUi }

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         categoryId:
 *           type: integer
 *         active:
 *           type: boolean
 *     Client:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         cpf:
 *           type: string
 *         description:
 *           type: string
 *       required:
 *         - name
 *         - email
 *         - cpf
 * /client/cpf/{cpf}:
 *   get:
 *     tags:
 *       - client
 *     summary: Get client by CPF
 *     parameters:
 *        - name: cpf
 *          in: path
 *          required: true
 *          schema:
 *              type: string
 *     responses:
 *          200:
 *              description: A client object.
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: '#/components/schemas/Client'
 *          404:
 *              description: Client not found.
 * /product/category/{categoryId}:
 *   get:
 *     tags:
 *       - product
 *     summary: Get products by category
 *     parameters:
 *        - name: categoryId
 *          in: path
 *          required: true
 *          schema:
 *              type: number
 *     responses:
 *          200:
 *              description: A list of products in the category.
 *              content:
 *                application/json:
 *                  schema:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Product'
 *          404:
 *              description: No products found for this category.
 */
