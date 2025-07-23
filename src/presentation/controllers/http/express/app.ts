import "reflect-metadata";
import express from "express"
import routes from "./routes"
import { swaggerSpec, swaggerUi } from "./swagger"
import { Request, Response, NextFunction } from "express"

const app = express()
app.use(express.json())
app.use("/api", routes)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))


interface ErrorRequest extends Request {}
interface ErrorResponse extends Response {}
interface ErrorNextFunction extends NextFunction {}
interface ExpressError extends Error {
    status?: number
}

app.use((err: ExpressError, req: ErrorRequest, res: ErrorResponse, next: ErrorNextFunction) => {
    console.error(err);
    if (err.stack) {
        console.error("STACKTRACE:", err.stack);
    }
    res.status(500).json({ message: err.message });
});


export default app