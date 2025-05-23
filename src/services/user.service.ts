import { v4 as uuidv4 } from 'uuid';
import User from '../models/User';
import Order from '../models/Order';
import { UserRole } from '../utils/enums';
import pool from '../config/database';

export class UserService {

    async getUsers(): Promise<User[]> {
        try {
            const result = await pool.query(`
        SELECT * FROM users
        ORDER BY "createdAt" DESC
      `);
            return result.rows;
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            throw error;
        }
    }

    async getUserById(id: string): Promise<User & { orders?: Order[] } | undefined> {
        try {
            const result = await pool.query(`
        SELECT * FROM users
        WHERE id = $1
      `, [id]);

            if (result.rows.length === 0) {
                return undefined;
            }
            const user = result.rows[0];

            const orderResult = await pool.query(`
        SELECT * FROM orders
        WHERE "userId" = $1
        ORDER BY "createdAt" DESC
      `, [id]);

            return {
                ...user,
                orders: orderResult.rows
            };
        } catch (error) {
            console.error(`Error al obtener usuario con ID ${id}:`, error);
            throw error;
        }
    }

    async getUserByEmail(email: string): Promise<User | undefined> {
        try {
            const result = await pool.query(`
        SELECT * FROM users
        WHERE email = $1
      `, [email]);

            return result.rows[0];
        } catch (error) {
            console.error(`Error al obtener usuario con email ${email}:`, error);
            throw error;
        }
    }

    async createUser(userData: User): Promise<User> {
        try {
            const result = await pool.query(`
        INSERT INTO users (
          id, email, password, "firstName", "lastName", "documentType", 
          "documentNumber", "phoneNumber", role, "defaultAddress",
          "isActive", "emailVerified", "lastLogin", "createdAt", "updatedAt"
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
        ) RETURNING *
      `, [
                userData.id,
                userData.email,
                userData.password,
                userData.firstName,
                userData.lastName,
                userData.documentType,
                userData.documentNumber,
                userData.phoneNumber,
                userData.role,
                userData.defaultAddress,
                userData.isActive,
                userData.emailVerified,
                userData.lastLogin,
                userData.createdAt,
                userData.updatedAt
            ]);

            delete result.rows[0].password

            return result.rows[0];
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error;
        }
    }


    async updateUser(id: string, userData: User): Promise<User | undefined> {
        try {

            const result = await pool.query(`
                UPDATE users
                SET "firstName" = $1, "lastName" = $2, "documentType" = $3,
                "documentNumber" = $4, "phoneNumber" = $5, "defaultAddress" = $6,
                "updatedAt" = $7, "email" = $8, "role" = $9
                WHERE id = $10
                RETURNING *
                `, [
                userData.firstName,
                userData.lastName,
                userData.documentType,
                userData.documentNumber,
                userData.phoneNumber,
                userData.defaultAddress,
                userData.updatedAt,
                userData.email,
                userData.role,
                id
            ])

            if (result.rowCount === 0) {
                return undefined;
            }

            delete result.rows[0].password
            return result.rows[0];

        } catch (error) {
            console.error(`Error al actualizar usuario ${id}:`, error);
            throw error;
        }
    }

    async updateUserActiveStatus(id: string, isActive: boolean, updatedAt: Date): Promise<User | undefined> {
        try {
            const result = await pool.query(`
        UPDATE users
        SET "isActive" = $1, "updatedAt" = $2
        WHERE id = $3
        RETURNING *
      `, [isActive, updatedAt, id]);

            if (result.rowCount === 0) {
                return undefined;
            }
            delete result.rows[0].password
            return result.rows[0];
        } catch (error) {
            console.error(`Error al actualizar estado de activación del usuario ${id}:`, error);
            throw error;
        }
    }

    async updateUserEmailVerifiedStatus(id: string, emailVerified: boolean, updatedAt: Date): Promise<User | undefined> {

        try {

            const result = await pool.query(`
        UPDATE users
        SET "emailVerified" = $1, "updatedAt" = $2
        WHERE id = $3
        RETURNING *
        `, [emailVerified, updatedAt, id]);

            if (result.rowCount === 0) {
                return undefined;
            }

            delete result.rows[0].password
            return result.rows[0];

        } catch (error) {

            console.error(`Error al actualizar estado de verificación de email del usuario ${id}:`, error);
            throw error;

        }

    }

    async updateUserRoleStatus(id: string, role: UserRole, updatedAt: Date): Promise<User | undefined> {

        try {

            const result = await pool.query(`
        UPDATE users
        SET "role" = $1, "updatedAt" = $2
        WHERE id = $3
        RETURNING *
        `, [role, updatedAt, id]);

            if (result.rowCount === 0) {
                return undefined;
            }

            delete result.rows[0].password
            return result.rows[0];

        } catch (error) {

            console.error(`Error al actualizar estado de verificación de email del usuario ${id}:`, error);
            throw error;

        }

    }

    async verifyUserEmail(id: string, updatedAt: Date): Promise<User | undefined> {
        try {
            const result = await pool.query(`
        UPDATE users
        SET "emailVerified" = true, "updatedAt" = $1
        WHERE id = $2
        RETURNING *
      `, [updatedAt, id]);

            if (result.rowCount === 0) {
                return undefined;
            }
            delete result.rows[0].password
            return result.rows[0];
        } catch (error) {
            console.error(`Error al verificar email del usuario ${id}:`, error);
            throw error;
        }
    }

    async updateLastLogin(id: string, lastLogin: Date, updatedAt: Date): Promise<User | undefined> {
        try {
            const result = await pool.query(`
        UPDATE users
        SET "lastLogin" = $1, "updatedAt" = $2
        WHERE id = $3
        RETURNING *
      `, [lastLogin, updatedAt, id]);

            if (result.rowCount === 0) {
                return undefined;
            }
            delete result.rows[0].password
            return result.rows[0];
        } catch (error) {
            console.error(`Error al actualizar último login del usuario ${id}:`, error);
            throw error;
        }
    }

    async deleteUser(id: string): Promise<boolean> {
        try {
            const result = await pool.query(`
        DELETE FROM users
        WHERE id = $1
      `, [id]);
            delete result.rows[0].password
            return (result.rowCount ?? 0) > 0;
        } catch (error) {
            console.error(`Error al eliminar usuario ${id}:`, error);
            throw error;
        }
    }
}

export default new UserService();