import { Request, Response, NextFunction } from "express";
import { sign } from "jsonwebtoken";
import { CustomRequest } from "../middleware/checkJwt"
import config from "../config";
import { ClientError } from "../exceptions/clientError";
import { UnauthorizedError } from "../exceptions/unauthorizedError";
import { getUserByUsername, isPasswordCorrect, changePassword } from "../state/users";

class AuthController {
    static login = async (req: Request, res: Response, next: NextFunction) => {
        let { username, password } = req.body;
        if(!(username && password)) {
             throw new ClientError(`Username and password are required`) 
        }

        const user = getUserByUsername(username);

        if(!user || !(await isPasswordCorrect(user.id, password))) throw new UnauthorizedError(`Username and password do not match`)

        const token = sign({ userId: user.id, username: user.username, role: user.role}, config.jwt.secret!, {
            expiresIn: "1h",
            notBefore: "0",
            algorithm: "HS256",
            audience: config.jwt.audience,
            issuer: config.jwt.issuer
        })

        res.type("json").send({ token: token })
    }

    static changePassword = async (req: Request, res: Response, next: NextFunction) => {
        const id = (req as CustomRequest).token.payload.userId;

        const { oldPassword, newPassword } = req.body
        if(!(oldPassword && newPassword)) throw new ClientError("Passwords do not match")

        if(!(await isPasswordCorrect(id, oldPassword))) throw new UnauthorizedError("Old password does not match")

        await changePassword(id, newPassword)

        res.status(204).send
    }
}

export default AuthController