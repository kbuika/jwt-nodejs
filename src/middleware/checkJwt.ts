import { Request, Response, NextFunction } from "express";
import { verify, JwtPayload } from "jsonwebtoken";
import config from "../config";

export interface CustomRequest extends Request {
    token: JwtPayload
}

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    const token = <string>req.headers["authorization"]
    let jwtPayload;

    // validate token and retrieve data
    try {
        jwtPayload = <any>verify(token?.split(" ")[1], config.jwt.secret!, {
            complete: true,
            audience: config.jwt.audience,
            issuer: config.jwt.issuer,
            algorithms: ["HS256"],
            clockTolerance: 0,
            ignoreExpiration: false,
            ignoreNotBefore: false
        });
        // add payload to request so controllers can access it
        (req as CustomRequest).token = jwtPayload
    } catch (error) {
        res.status(401).type("json").send(JSON.stringify({ message: "Missing or invalid token "}));
        return;
    }

    next()
}