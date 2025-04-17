import { Router } from "express";
import userController from "../controllers/user.controller";

const router = Router();

router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.get("/email/:email", userController.getUserByEmail);

router.put("/:id", userController.updateUser);

router.patch("/status/active/:id", userController.updateUserActiveStatus);
router.patch("/status/email/:id", userController.updateUserEmailVerifiedStatus);
router.patch("/status/role/:id", userController.updateUserRoleStatus);

export default router;