import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database';

import { ShipmentStatus } from '../utils/enums';
import { Shipment } from '../models/Shipment';

export class ShipmentService {
    async getShipments(): Promise<Shipment[]> {
        try {
            const result = await pool.query(`
                SELECT * FROM shipments
                ORDER BY "createdAt" DESC
            `);
            return result.rows;
        } catch (error) {
            console.error('Error al obtener envíos:', error);
            throw error;
        }
    }
    async getShipmentById(id: string): Promise<Shipment | undefined> {
        try {
            const result = await pool.query(`
                SELECT * FROM shipments
                WHERE id = $1
            `, [id]);

            return result.rows[0];
        } catch (error) {
            console.error(`Error al obtener envío con ID ${id}:`, error);
            throw error;
        }
    }

    async getShipmentsByOrderId(orderId: string): Promise<Shipment[]> {
        try {
            const result = await pool.query(`
                SELECT * FROM shipments
                WHERE "orderId" = $1
                ORDER BY "createdAt" DESC
            `, [orderId]);

            return result.rows[0];
        } catch (error) {
            console.error(`Error al obtener envíos de la orden ${orderId}:`, error);
            throw error;
        }
    }

    async getShipmentsByTrackingNumber(trackingNumber: string): Promise<Shipment[]> {
        try {
            const result = await pool.query(`
                SELECT s.*, o.destination, o.dimensions, o.origin, r."name" as "routeName" FROM shipments s
LEFT JOIN public.orders o on s."orderId" = o.id
LEFT JOIN public.carriers ca on s."carrierId" = ca.id
LEFT JOIN public.routes r on ca."routeId" = r.id
                WHERE "trackingNumber" = $1
                ORDER BY s."createdAt" DESC
            `, [trackingNumber]);

            return result.rows[0];
        } catch (error) {
            console.error(`Error al obtener envíos con número de seguimiento ${trackingNumber}:`, error);
            throw error;
        }
    }

    async createShipment(shipmentData: Omit<Shipment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Shipment> {
        try {
            const id = uuidv4();
            const now = new Date();

            const result = await pool.query(`
                INSERT INTO shipments (
                    id, "orderId", "carrierId", status, "trackingNumber", "createdAt", "updatedAt"
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7
                ) RETURNING *
            `, [id, shipmentData.orderId, shipmentData.carrierId, shipmentData.status, shipmentData.trackingNumber, now, now]);

            return result.rows[0];
        } catch (error) {
            console.error('Error al crear envío:', error);
            throw error;
        }
    }

    async updateShipment(id: string, shipmentData: Partial<Shipment>): Promise<Shipment | undefined> {
        try {
            const now = new Date();

            const result = await pool.query(`
                UPDATE shipments
                SET "carrierId" = $1, status = $2, "trackingNumber" = $3, "updatedAt" = $4
                WHERE id = $5
                RETURNING *
            `, [shipmentData.carrierId, shipmentData.status, shipmentData.trackingNumber, now, id]);

            return result.rows[0];
        } catch (error) {
            console.error(`Error al actualizar envío con ID ${id}:`, error);
            throw error;
        }
    }

    async updateShipmentStatus(id: string, status: ShipmentStatus): Promise<Shipment | undefined> {
        try {
            const now = new Date();

            const result = await pool.query(`
                UPDATE shipments
                SET status = $1, "updatedAt" = $2
                WHERE id = $3
                RETURNING *
            `, [status, now, id]);

            return result.rows[0];
        } catch (error) {
            console.error(`Error al actualizar estado de envío con ID ${id}:`, error);
            throw error;
        }
    }

    async deleteShipment(id: string): Promise<void> {
        try {
            await pool.query(`
                DELETE FROM shipments
                WHERE id = $1
            `, [id]);
        } catch (error) {
            console.error(`Error al eliminar envío con ID ${id}:`, error);
            throw error;
        }
    }
}

export default new ShipmentService();