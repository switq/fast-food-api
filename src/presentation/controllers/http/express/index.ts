import app from "./app"
import { HOST_PORT } from "../../../../env-variables"

app.listen(HOST_PORT, () =>
    console.log(`Server is running on port ${HOST_PORT}`)
)