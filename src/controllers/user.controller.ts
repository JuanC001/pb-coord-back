import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import User from "../models/User";
import userService from "../services/user.service";
import { UserRole } from "../utils/enums";

export class UserController {

    async getUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await userService.getUsers();
            res.status(200).json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al obtener los usuarios" });
        }
    }

    async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const user = await userService.getUserById(id);

            if (!user) {
                res.status(404).json({ message: "Usuario no encontrado" });
                return
            }

            res.status(200).json(user);
            return
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al obtener el usuario" });
            return
        }
    }

    async getUserByEmail(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.params;
            const user = await userService.getUserByEmail(email);

            if (!user) {
                res.status(404).json({ message: "Usuario no encontrado" });
                return
            }

            res.status(200).json(user);
            return
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al obtener el usuario" });
            return
        }
    }

    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const userData = req.body as User;
            if (!userData) {
                res.status(400).json({ message: "Faltan datos requeridos para crear el usuario" });
                return
            }

            if (!userData.email || !userData.password || !userData.firstName || !userData.lastName || !userData.documentType || !userData.documentNumber || !userData.phoneNumber) {
                res.status(400).json({ message: "Faltan datos requeridos para crear el usuario" });
                return
            }

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(userData.password, salt);
            userData.password = hash;
            userData.id = crypto.randomUUID();
            userData.role = UserRole.CUSTOMER;
            userData.isActive = true;
            userData.emailVerified = false;
            userData.lastLogin = undefined;
            userData.createdAt = new Date();
            userData.updatedAt = new Date();

            const newUser = await userService.createUser(userData);
            res.status(201).json(newUser);
            return
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al crear el usuario" });
        }
    }

}

export default new UserController();