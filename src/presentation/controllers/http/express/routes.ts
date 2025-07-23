import { Router } from "express"
import categoryRouter from "./category"
import productRouter from "./products"
import clientRouter from "./customer"
import orderRouter from "./orders"
import orderItemRouter from "./order-items"
import paymentRouter from "./payments"

const routes = Router()

routes.use("/v1/categories", categoryRouter)
routes.use("/v1/products", productRouter)
routes.use("/v1/clients", clientRouter)
routes.use("/v1/orders", orderRouter)
routes.use("/v1/order-items", orderItemRouter)
routes.use("/v1/payments", paymentRouter)

export default routes
