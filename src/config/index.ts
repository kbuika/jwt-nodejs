import * as dotenv from "dotenv"
dotenv.config()

const config = {
    jwt: {
        secret: process.env.JWT_SECRET, // to sign and validate signatures
        audience: process.env.JWT_AUDIENCE, // this and issuer are for validation
        issuer: process.env.JWT_ISSUER
    },
    port: process.env.PORT || 8080,
    prefix: process.env.API_PREFIX || "api"
}

export default config