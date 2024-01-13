import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { checkJwt } from "../middleware/checkJwt";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router()

router.post("/login", asyncHandler(AuthController.login));
router.post("/change-password", [checkJwt], asyncHandler(AuthController.changePassword));

export default router;