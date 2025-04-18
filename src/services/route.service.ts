import { v4 as uuidv4 } from 'uuid';
import { Route } from "../models/Route";
import pool from "../config/database";

export class RouteService {

    async getRoutes(): Promise<Route[]> {
        try {
            const result = await pool.query(`
                SELECT * FROM routes
                ORDER BY "name" ASC
            `);
            return result.rows;
        } catch (error) {
            console.error('Error al obtener rutas:', error);
            throw error;
        }
    }

    async getRouteById(id: string): Promise<Route | undefined> {
        try {
            const result = await pool.query(`
                SELECT * FROM routes
                WHERE id = $1
            `, [id]);

            return result.rows[0];
        } catch (error) {
            console.error(`Error al obtener ruta con ID ${id}:`, error);
            throw error;
        }
    }

    async createRoute(routeData: Omit<Route, 'id'>): Promise<Route> {
        try {
            const id = uuidv4();

            const result = await pool.query(`
                INSERT INTO routes (
                    id, name, origin, destination
                ) VALUES (
                    $1, $2, $3, $4
                ) RETURNING *
            `, [id, routeData.name, routeData.origin, routeData.destination]);

            return result.rows[0];
        } catch (error) {
            console.error('Error al crear ruta:', error);
            throw error;
        }
    }

    async updateRoute(id: string, routeData: Partial<Route>): Promise<Route | undefined> {
        try {
            const existingRoute = await this.getRouteById(id);
            
            if (!existingRoute) {
                return undefined;
            }

            const result = await pool.query(`
                UPDATE routes
                SET name = $1, origin = $2, destination = $3
                WHERE id = $4
                RETURNING *
            `, [
                routeData.name ?? existingRoute.name,
                routeData.origin ?? existingRoute.origin,
                routeData.destination ?? existingRoute.destination,
                id
            ]);

            return result.rows[0];
        } catch (error) {
            console.error(`Error al actualizar ruta con ID ${id}:`, error);
            throw error;
        }
    }

    async deleteRoute(id: string): Promise<void> {
        try {
            await pool.query(`
                DELETE FROM routes
                WHERE id = $1
            `, [id]);
        } catch (error) {
            console.error(`Error al eliminar ruta con ID ${id}:`, error);
            throw error;
        }
    }
}

export default new RouteService();