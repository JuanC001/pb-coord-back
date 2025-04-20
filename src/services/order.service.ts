import { v4 as uuidv4 } from 'uuid';
import Order from '../models/Order';
import { OrderStatus } from '../utils/enums';
import pool from '../config/database';

export class OrderService {

    async getOrders(): Promise<Order[]> {
        try {
            const result = await pool.query(`
        SELECT * FROM orders
        ORDER BY "createdAt" DESC
      `);
            return result.rows;
        } catch (error) {
            console.error('Error al obtener órdenes:', error);
            throw error;
        }
    }

    async getOrderById(id: string): Promise<Order | undefined> {
        try {
            const result = await pool.query(`
        SELECT * FROM orders
        WHERE id = $1
      `, [id]);

            return result.rows[0];
        } catch (error) {
            console.error(`Error al obtener orden con ID ${id}:`, error);
            throw error;
        }
    }

    async getOrdersByUserId(userId: string): Promise<Order[]> {
        try {
            const result = await pool.query(`
        SELECT   o.*,  s."trackingNumber" FROM   public.orders o 
        LEFT JOIN   public.shipments s ON o.id = s."orderId"
        WHERE o."userId" = $1 ORDER BY o."createdAt" ASC
      `, [userId]);

            return result.rows;
        } catch (error) {
            console.error(`Error al obtener órdenes del usuario ${userId}:`, error);
            throw error;
        }
    }

    async createOrder(orderData: Omit<Order, 'id' | 'orderStatus' | 'createdAt' | 'updatedAt'>): Promise<Order> {
        try {
            const id = uuidv4();
            const orderStatus = OrderStatus.PENDING;
            const now = new Date();

            const result = await pool.query(`
        INSERT INTO orders (
          id, "userId", origin, destination, "orderStatus", dimensions, "createdAt", "updatedAt"
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8
        ) RETURNING *
      `, [
                id,
                orderData.userId,
                orderData.origin,
                orderData.destination,
                orderStatus,
                orderData.dimensions,
                now,
                now
            ]);

            return result.rows[0];
        } catch (error) {
            console.error('Error al crear orden:', error);
            throw error;
        }
    }

    async updateOrder(id: string, orderData: Partial<Omit<Order, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Order | undefined> {

        try {

            const now = new Date();

            const result = await pool.query(`
        UPDATE orders
        SET origin = $1, destination = $2, dimensions = $3, "updatedAt" = $4
        WHERE id = $5
        RETURNING *
        `, [
                orderData.origin,
                orderData.destination,
                orderData.dimensions,
                now,
                id
            ]);

            if (result.rowCount === 0) {
                return undefined;
            }

            return result.rows[0];

        } catch (error) {
            console.error(`Error al actualizar orden ${id}:`, error);
            throw error;
        }

    }

    async updateOrderStatus(id: string, orderStatus: OrderStatus): Promise<Order | undefined> {
        try {
            const now = new Date();

            const result = await pool.query(`
        UPDATE orders
        SET "orderStatus" = $1, "updatedAt" = $2
        WHERE id = $3
        RETURNING *
      `, [orderStatus, now, id]);

            if (result.rowCount === 0) {
                return undefined;
            }

            return result.rows[0];
        } catch (error) {
            console.error(`Error al actualizar estado de orden ${id}:`, error);
            throw error;
        }
    }

    async deleteOrder(id: string): Promise<boolean> {
        try {
            const result = await pool.query(`
        DELETE FROM orders
        WHERE id = $1
      `, [id]);

            return (result.rowCount ?? 0) > 0;
        } catch (error) {
            console.error(`Error al eliminar orden ${id}:`, error);
            throw error;
        }
    }
}

export default new OrderService();