import { Request, Response } from "express";
import { Shipment } from "../models/Shipment";
import { ShipmentStatus } from "../utils/enums";

import ShipmentService from "../services/shipment.service";

export class ShipmentController {

    async getShipments(req: Request, res: Response): Promise<void> {
        try {
            const shipments = await ShipmentService.getShipments();
            res.status(200).json(shipments);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al obtener los envíos" });
        }
    }

    async getShipmentById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const shipment = await ShipmentService.getShipmentById(id);

            if (!shipment) {
                res.status(404).json({ message: "Envío no encontrado" });
                return;
            }

            res.status(200).json(shipment);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al obtener el envío" });
        }
    }

    async getShipmentsByOrderId(req: Request, res: Response): Promise<void> {
        try {
            const { orderId } = req.params;

            if (!orderId) {
                res.status(400).json({ message: "Se requiere el ID de la orden" });
                return;
            }

            const shipments = await ShipmentService.getShipmentsByOrderId(orderId);
            res.status(200).json(shipments);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al obtener los envíos de la orden" });
        }
    }

    async createShipment(req: Request, res: Response): Promise<void> {
        try {
            const shipmentData = req.body as Omit<Shipment, 'id' | 'createdAt' | 'updatedAt'>;

            if (!shipmentData) {
                res.status(400).json({ message: "Faltan datos requeridos para crear el envío" });
                return;
            }

            if (!shipmentData.orderId || !shipmentData.carrierId) {
                res.status(400).json({ message: "Se requiere el ID de la orden y del transportista" });
                return;
            }

            if (!shipmentData.trackingNumber) {
                res.status(400).json({ message: "Se requiere el número de seguimiento" });
                return;
            }

            if (!shipmentData.status || !Object.values(ShipmentStatus).includes(shipmentData.status)) {
                res.status(400).json({ message: "Estado de envío inválido" });
                return;
            }

            const newShipment = await ShipmentService.createShipment(shipmentData);
            res.status(201).json(newShipment);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al crear el envío" });
        }
    }

    async updateShipment(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const shipmentData = req.body as Partial<Shipment>;

            if (!shipmentData) {
                res.status(400).json({ message: "Faltan datos requeridos para actualizar el envío" });
                return;
            }

            const existingShipment = await ShipmentService.getShipmentById(id);
            if (!existingShipment) {
                res.status(404).json({ message: "Envío no encontrado" });
                return;
            }

            if (shipmentData.status && !Object.values(ShipmentStatus).includes(shipmentData.status)) {
                res.status(400).json({ message: "Estado de envío inválido" });
                return;
            }

            const updatedShipment = await ShipmentService.updateShipment(id, shipmentData);

            if (!updatedShipment) {
                res.status(404).json({ message: "Envío no encontrado" });
                return;
            }

            res.status(200).json(updatedShipment);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al actualizar el envío" });
        }
    }

    async updateShipmentStatus(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!status || !Object.values(ShipmentStatus).includes(status)) {
                res.status(400).json({ message: "Estado de envío inválido" });
                return;
            }

            const existingShipment = await ShipmentService.getShipmentById(id);
            if (!existingShipment) {
                res.status(404).json({ message: "Envío no encontrado" });
                return;
            }

            const updatedShipment = await ShipmentService.updateShipmentStatus(id, status);

            if (!updatedShipment) {
                res.status(404).json({ message: "Envío no encontrado" });
                return;
            }

            res.status(200).json(updatedShipment);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al actualizar el estado del envío" });
        }
    }

    async deleteShipment(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const existingShipment = await ShipmentService.getShipmentById(id);
            if (!existingShipment) {
                res.status(404).json({ message: "Envío no encontrado" });
                return;
            }

            await ShipmentService.deleteShipment(id);
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al eliminar el envío" });
        }
    }
}

export default new ShipmentController();