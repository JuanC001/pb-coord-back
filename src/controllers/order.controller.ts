import { Request, Response } from "express";
import pool from "../config/database";

export class OrderController {

    async getOrders(req: Request, res: Response) {

        console.log("Obteniendo todas las órdenes");
        try {

            const data = await pool.query("SELECT * FROM orders");
            res.status(200).json(data);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al obtener las órdenes" });
        }

    }

    async getOrderById(req: Request, res: Response) {

    }


    async createOrder(req: Request, res: Response) {

    }


    async updateOrderStatus(req: Request, res: Response) {

    }

    async deleteOrder(req: Request, res: Response) {

    }

    async getOrdersByUserId(req: Request, res: Response) {

    }
}

export default new OrderController();