import { NextFunction, Request, Response } from "express";
import { getAllUsers, Roles, getUser, updateUser, deleteUser, createUser } from "../state/users";
import { ClientError } from "../exceptions/clientError";
import { CustomRequest } from "../middleware/checkJwt";
import { ForbiddenError } from "../exceptions/forbiddenError";

class UserController {
    static listAll = async (req: Request, res: Response, next: NextFunction) => {
        const users = getAllUsers();
        res.status(200).type('json').send(users)
    };

    static getOneById = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id;

        // restrict USER requestors from retrieving their own record
        // allow ADMIN requestors to retirve any record
        if((req as CustomRequest).token.payload.role === Roles.USER && req.params.id !== (req as CustomRequest).token.payload.userId) {
            throw new ForbiddenError("Not enough permissions")
        }

        const user = getUser(id);
        res.status(200).type('json').send(user)
    }

    static newUser = async (req: Request, res: Response, next: NextFunction) => {
        let { username, password } = req.body;
        const user = await createUser(username, password, Roles.USER);

        res.status(201).type('json').send(user);
    };

    static editUser = async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;

        // restrict USER requestors from editing their own record
        // allow ADMIN requestors to edit any record
        if((req as CustomRequest).token.payload.role === Roles.USER &&  req.params.id !== (req as CustomRequest).token.payload.userId) {
            throw new ForbiddenError("Not enough permissions")
        }

        const { username, role } = req.body;

        // do not allow USER to change themselves to an ADMIN
        // verify you cannot make yourself an ADMIN if you are a user
        if((req as CustomRequest).token.payload.role === Roles.USER && role === Roles.ADMIN) {
            throw new ForbiddenError("Not enough permissions")
        }

        if(!Object.values(Roles).includes(role)) throw new ClientError('invalid role')

        const user = getUser(id)
        const updatedUser = updateUser(id, username || user.username, role || user.role)

        res.status(204).type('json').send(updatedUser)
    }

    static deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;

        deleteUser(id)

        res.status(204).type('json').send();
    }
}

export default UserController