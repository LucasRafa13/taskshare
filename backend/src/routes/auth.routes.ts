import { Router } from "express";
import { AuthController } from "@/controllers/auth.controller";
import { validateBody } from "@/middleware/validation.middleware";
import { authSchemas } from "@/middleware/validation.middleware";
import { authenticateToken } from "@/middleware/auth.middleware";

const router = Router();
const authController = new AuthController();

router.post(
  "/register",
  validateBody(authSchemas.register),
  authController.register,
);

router.post("/login", validateBody(authSchemas.login), authController.login);

router.get("/email/:email", authController.getUserByEmail);


router.post(
  "/refresh",
  validateBody(authSchemas.refreshToken),
  authController.refreshToken,
);

router.post("/logout", authenticateToken, authController.logout);

router.get("/me", authenticateToken, authController.getProfile);

export default router;
