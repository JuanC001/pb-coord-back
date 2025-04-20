import { v4 as uuidv4 } from 'uuid';
import { Carrier } from "../models/Carrier";
import pool from "../config/database";
import { DatabaseError } from 'pg';

export class CarrierService {

    async getCarriers(): Promise<Carrier[]> {
        try {

            const result = await pool.query(`
               SELECT ca.*, r."name" as "routeName" FROM carriers ca
         LEFT JOIN public.routes r on ca."routeId" = r.id
            `);
            return result.rows;

        } catch (error) {
            console.error('Error al obtener transportistas:', error);
            throw error;
        }
    }
    async getCarrierById(id: string): Promise<Carrier | undefined> {
        try {
            const result = await pool.query(`
                SELECT * FROM carriers
                WHERE id = $1
            `, [id]);

            return result.rows[0];
        } catch (error) {
            console.error(`Error al obtener transportista con ID ${id}:`, error);
            throw error;
        }
    }

    async createCarrier(carrierData: Omit<Carrier, 'id'>): Promise<Carrier> {
        try {
            const id = uuidv4();
            const now = new Date();

            const result = await pool.query(`
                INSERT INTO carriers (
                    id, "userId", "maxWeight", "maxItems", "routeId", "createdAt", "updatedAt"
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7
                ) RETURNING *
            `, [id, carrierData.userId, carrierData.maxWeight, carrierData.maxItems, carrierData.routeId, now, now]);

            return result.rows[0];
        } catch (error) {
            console.error('Error al crear transportista:', error);
            throw error;
        }
    }
    async updateCarrier(id: string, carrierData: Partial<Carrier>): Promise<Carrier | undefined> {
        try {
            const now = new Date();

            const existingCarrier = await this.getCarrierById(id);

            if (!existingCarrier) {
                return undefined;
            }

            const result = await pool.query(`
                UPDATE carriers
                SET "maxWeight" = $1, "maxItems" = $2, "routeId" = $3, "updatedAt" = $4
                WHERE id = $5
                RETURNING *
            `, [
                carrierData.maxWeight ?? existingCarrier.maxWeight,
                carrierData.maxItems ?? existingCarrier.maxItems,
                carrierData.routeId ?? existingCarrier.routeId,
                now,
                id
            ]);

            return result.rows[0];
        } catch (error) {

            console.error(`Error al actualizar transportista con ID ${id}:`, error);
            throw error;
        }
    }
    async deleteCarrier(id: string): Promise<void> {
        try {
            await pool.query(`
                DELETE FROM carriers
                WHERE id = $1
            `, [id]);
        } catch (error) {
            console.error(`Error al eliminar transportista con ID ${id}:`, error);
            throw error;
        }
    }
}

export default new CarrierService();