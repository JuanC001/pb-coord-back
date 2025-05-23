import { Router } from "express";
import userController from "../controllers/user.controller";
import { validateToken, hasRole } from "../middlewares/auth.middleware";
import { UserRole } from "../utils/enums";

const router = Router();

router.get("/", validateToken, hasRole(UserRole.ADMIN), userController.getUsers);
router.get("/:id", validateToken, userController.getUserById);
router.get("/email/:email", validateToken, hasRole(UserRole.ADMIN), userController.getUserByEmail);

router.put("/:id", validateToken, userController.updateUser);

router.patch("/status/active/:id", validateToken, hasRole(UserRole.ADMIN), userController.updateUserActiveStatus);
router.patch("/status/email/:id", validateToken, hasRole(UserRole.ADMIN), userController.updateUserEmailVerifiedStatus);
router.patch("/status/role/:id", validateToken, hasRole(UserRole.ADMIN), userController.updateUserRoleStatus);

export default router;