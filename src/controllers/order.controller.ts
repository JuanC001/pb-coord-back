import { Request, Response } from "express";
import orderService from "../services/order.service";
import { OrderStatus } from "../utils/enums";
import Order from "../models/Order";

export class OrderController {

    async getOrders(req: Request, res: Response) {
        try {
            const orders = await orderService.getOrders();
            res.status(200).json(orders);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al obtener las órdenes" });
        }
    }

    async getOrderById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const order = await orderService.getOrderById(id);

            if (!order) {
                res.status(404).json({ message: "Orden no encontrada" });
                return
            }

            res.status(200).json(order);
            return
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al obtener la orden" });
            return
        }
    }

    async createOrder(req: Request, res: Response): Promise<void> {
        try {
            const orderData = req.body as Order;
            if (!orderData) {
                res.status(400).json({ message: "Faltan datos requeridos para crear la orden" });
                return
            }

            if (!orderData.userId || !orderData.origin || !orderData.destination || !orderData.dimensions) {
                res.status(400).json({ message: "Faltan datos requeridos para crear la orden" });
                return
            }

            if (orderData.dimensions && (orderData.dimensions.length <= 0 || orderData.dimensions.width <= 0 || orderData.dimensions.height <= 0 || orderData.dimensions.weight <= 0)) {
                res.status(400).json({ message: "Las dimensiones deben ser mayores a 0" });
                return
            }

            if (orderData.destination && (!orderData.destination.city || !orderData.destination.country || !orderData.destination.address || !orderData.destination.postalCode)) {
                res.status(400).json({ message: "Faltan datos requeridos para la dirección de destino" });
                return
            }

            const newOrder = await orderService.createOrder(orderData);
            res.status(201).json(newOrder);
            return
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al crear la orden" });
        }
    }

    async updateOrder(req: Request, res: Response): Promise<void> {
        try {

            const { id } = req.params;
            const orderData = req.body as Order;

            if (!orderData) {
                res.status(400).json({ message: "Faltan datos requeridos para actualizar la orden" });
                return
            }

            if (!orderData.userId || !orderData.origin || !orderData.destination || !orderData.dimensions) {
                res.status(400).json({ message: "Faltan datos requeridos para actualizar la orden" });
                return
            }

            if (orderData.dimensions && (orderData.dimensions.length <= 0 || orderData.dimensions.width <= 0 || orderData.dimensions.height <= 0 || orderData.dimensions.weight <= 0)) {
                res.status(400).json({ message: "Las dimensiones deben ser mayores a 0" });
                return
            }

            if (orderData.destination && (!orderData.destination.city || !orderData.destination.country || !orderData.destination.address || !orderData.destination.postalCode)) {
                res.status(400).json({ message: "Faltan datos requeridos para la dirección de destino" });
                return
            }

            const actualOrder = await orderService.getOrderById(id);
            if (!actualOrder) {
                res.status(404).json({ message: "Orden no encontrada" });
                return
            }

            if (actualOrder.userId !== orderData.userId) {
                res.status(403).json({ message: "No tienes permiso para actualizar esta orden" });
                return
            }

            if (actualOrder.orderStatus === OrderStatus.ACCEPTED) {
                res.status(403).json({ message: "No puedes actualizar una orden que está en estado 'ACEPTADA'" });
                return
            }

            if (orderData.orderStatus && !Object.values(OrderStatus).includes(orderData.orderStatus)) {
                res.status(400).json({ message: "Estado de orden inválido" });
                return
            }

            const updatedOrder = await orderService.updateOrder(id, orderData);

            if (!updatedOrder) {
                res.status(404).json({ message: "Orden no encontrada" });
                return
            }

            res.status(200).json(updatedOrder);
            return

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al actualizar la orden" });
        }
    }

    async updateOrderStatus(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { orderStatus } = req.body;

            if (!orderStatus || !Object.values(OrderStatus).includes(orderStatus)) {
                res.status(400).json({ message: "Estado de orden inválido" });
                return
            }

            const updatedOrder = await orderService.updateOrderStatus(id, orderStatus);

            if (!updatedOrder) {
                res.status(404).json({ message: "Orden no encontrada" });
                return
            }

            res.status(200).json(updatedOrder);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al actualizar el estado de la orden" });
        }
    }

    async deleteOrder(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const deleted = await orderService.deleteOrder(id);

            if (!deleted) {
                res.status(404).json({ message: "Orden no encontrada" });
                return
            }

            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al eliminar la orden" });
        }
    }

    async getOrdersByUserId(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const orders = await orderService.getOrdersByUserId(userId);
            res.status(200).json(orders);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al obtener las órdenes del usuario" });
        }
    }
}

export default new OrderController();