import { Router } from "express";
import UserController from "../controllers/UserController"
import { asyncHandler } from "../middleware/asyncHandler";
import { checkJwt } from "../middleware/checkJwt";
import { checkRole } from "../middleware/checkRole";
import { Roles } from "../state/users";

const router = Router()

router.get("/", [checkJwt, checkRole([Roles.ADMIN])], asyncHandler(UserController.listAll));

router.get("/:id([0-9a-z] {24})", [checkJwt, checkRole([Roles.USER, Roles.ADMIN])], asyncHandler(UserController.getOneById));

router.post("/", asyncHandler(UserController.newUser));

router.patch("/:id([0-9a-z] {24})", [checkJwt, checkRole([Roles.USER, Roles.ADMIN])], asyncHandler(UserController.editUser));

router.delete("/:id([0-9a-z] {24})", [checkJwt, checkRole([Roles.ADMIN])], asyncHandler(UserController.deleteUser));

export default router