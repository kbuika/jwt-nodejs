import express from "express";
import { json } from "body-parser"
import { errorHandler } from "./middleware/errorHandler";
import config from "./config";
import routes from "./routes";

const app = express()
app.use(json())

app.use(errorHandler)

app.use("/" + config.prefix, routes)

app.listen(config.port, () => {
    console.log(`server is listening on port ${config.port}`)
})