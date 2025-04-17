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

    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userData = req.body as User;

            if (!userData) {
                res.status(400).json({ message: "Faltan datos requeridos para actualizar el usuario" });
                return
            }

            if (!userData.email || !userData.firstName || !userData.lastName || !userData.documentType || !userData.documentNumber || !userData.phoneNumber) {
                res.status(400).json({ message: "Faltan datos requeridos para actualizar el usuario" });
                return
            }

            if (userData.defaultAddress) {

                const { city, address, country, postalCode } = userData.defaultAddress;
                if (!address || !city || !country || !postalCode) {
                    res.status(400).json({ message: "Faltan datos requeridos para la dirección: ciudad, dirección, pais, codigo postal" });
                    return
                }

            }

            if (userData.role) {
                if (userData.role !== UserRole.CUSTOMER && userData.role !== UserRole.ADMIN && userData.role !== UserRole.COURRIER) {
                    res.status(400).json({ message: "El rol del usuario no es válido" });
                    return
                }
            }

            userData.updatedAt = new Date();

            const user = await userService.updateUser(id, userData);

            if (!user) {
                res.status(404).json({ message: "Usuario no encontrado" });
                return
            }

            res.status(200).json(user);
            return
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al actualizar el usuario" });
            return
        }
    }

    async updateUserActiveStatus(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { isActive } = req.body;

            if (isActive === undefined) {
                res.status(400).json({ message: "Faltan datos requeridos para actualizar el estado de activación del usuario" });
                return
            }

            const user = await userService.updateUserActiveStatus(id, isActive, new Date());

            if (!user) {
                res.status(404).json({ message: "Usuario no encontrado" });
                return
            }

            res.status(200).json(user);
            return
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al actualizar el estado de activación del usuario" });
            return
        }
    }

    async updateUserEmailVerifiedStatus(req: Request, res: Response): Promise<void> {
        try {

            const { id } = req.params;
            const { emailVerified } = req.body;

            if (emailVerified === undefined) {
                res.status(400).json({ message: "Faltan datos requeridos para actualizar el estado de verificación de email del usuario" });
                return
            }

            const user = await userService.updateUserEmailVerifiedStatus(id, emailVerified, new Date());

            if (!user) {
                res.status(404).json({ message: "Usuario no encontrado" });
                return
            }

            res.status(200).json(user);
            return

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al actualizar el estado de verificación de email del usuario" });
            return

        }
    }

    async updateUserRoleStatus(req: Request, res: Response): Promise<void> {
        try {

            const { id } = req.params;
            const { role } = req.body;

            if (role === undefined) {
                res.status(400).json({ message: "Faltan datos requeridos para actualizar el estado de verificación de email del usuario" });
                return
            }

            if (role !== UserRole.CUSTOMER && role !== UserRole.ADMIN && role !== UserRole.COURRIER) {
                res.status(400).json({ message: "El rol del usuario no es válido" });
                return
            }

            const user = await userService.updateUserRoleStatus(id, role, new Date());

            if (!user) {
                res.status(404).json({ message: "Usuario no encontrado" });
                return
            }

            res.status(200).json(user);
            return

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al actualizar el estado de verificación de email del usuario" });
            return

        }
    }


}

export default new UserController();