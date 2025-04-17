import { Request, Response } from "express";
import userService from "../services/user.service";
import { UserRole } from "../utils/enums";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { generateJWT } from "../utils/jwt";

import { DatabaseError } from 'pg'

export class AuthController {

    async login(req: Request, res: Response): Promise<void> {
        try {
            const body = req.body as { email: string, password: string };
            if (!body) {
                res.status(400).json({ message: "Faltan datos requeridos para iniciar sesión" });
                return;
            }
            const { email, password } = body;

            const user = await userService.getUserByEmail(email);

            if (!user) {
                res.status(401).json({ message: "Usuario o contraseña incorrecta" });
                return;
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(401).json({ message: "Usuario o contraseña incorrecta" });
                return;
            }

            const token = await generateJWT(user.id, user.email, user.role);

            res.status(200).json({
                uuid: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                token
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al iniciar sesión" });
        }
    }

    async register(req: Request, res: Response): Promise<void> {
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
            userData.createdAt = new Date();
            userData.updatedAt = new Date();

            const newUser = await userService.createUser(userData);
            res.status(201).json(newUser);
            return
        } catch (error) {

            if (error instanceof DatabaseError) {

                if (error.code === '23505') {
                    res.status(400).json({ message: "El correo electrónico ya está en uso" });
                    return
                }
            }

            res.status(500).json({ message: "Error al crear el usuario" });
            return
        }
    }

    async renewToken(req: Request, res: Response): Promise<void> {
        try {
            const { uid, email, role } = req.body;
            const token = await generateJWT(uid, email, role);

            res.status(200).json({
                uid,
                email,
                role,
                token
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al renovar el token" });
        }
    }

}

export default new AuthController();