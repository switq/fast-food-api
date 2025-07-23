import { runExpressEndpoint } from "../generic/run-express-endpoint"
import { Router } from "express"
import { getCategoryById } from "./get-by-id"
import { getCategoryAll } from "./get-all"
import { createCategory } from "./create"
import { updateCategory } from "./update"
import { deleteCategory } from "./delete"

const categoryRouter = Router()

/**
 * @openapi
 * tags:
 *   - name: category
 *     description: Operations about categories
 */

/**
 * @openapi
 * /categories:
 *   get:
 *     tags:
 *       - category
 *     summary: Get all categories
 *     responses:
 *       200:
 *         description: A list of categories.
 */
categoryRouter.get("/", runExpressEndpoint(getCategoryAll, "get"))

/**
 * @openapi
 * /categories/{id}:
 *   get:
 *     tags:
 *       - category
 *     summary: Get category by ID
 *     parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *              type: number
 *     responses:
 *          200:
 *              description: A category.
 *          404:
 *              description: Category not found.
 */
categoryRouter.get("/:id", runExpressEndpoint(getCategoryById, "get"))

/**
 * @openapi
 * /categories:
 *   post:
 *     tags:
 *       - category
 *     summary: Create a new category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 required: true
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created.
 *       400:
 *         description: Invalid input.
 */
categoryRouter.post("/", runExpressEndpoint(createCategory, "post"))

/**
 * @openapi
 * /categories/{id}:
 *   put:
 *     tags:
 *       - category
 *     summary: Update an existing category
 *     parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *              type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated.
 *       400:
 *         description: Invalid input.
 *       404:
 *         description: Category not found.
 */
categoryRouter.put("/:id", runExpressEndpoint(updateCategory, "put"))

/**
 * @openapi
 * /categories/{id}:
 *   delete:
 *     tags:
 *       - category
 *     summary: Delete a category
 *     parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *              type: number
 *     responses:
 *       204:
 *         description: Category deleted.
 *       404:
 *         description: Category not found.
 */
categoryRouter.delete("/:id", runExpressEndpoint(deleteCategory, "delete"))

export default categoryRouter
