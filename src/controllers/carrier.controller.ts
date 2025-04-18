import { Request, Response } from "express";
import { Carrier } from "../models/Carrier";
import carrierService from "../services/carrier.service";

import { DatabaseError } from 'pg'

export class CarrierController {

    async getCarriers(req: Request, res: Response): Promise<void> {
        try {
            const carriers = await carrierService.getCarriers();
            res.status(200).json(carriers);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al obtener los transportistas" });
        }
    }

    async getCarrierById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const carrier = await carrierService.getCarrierById(id);

            if (!carrier) {
                res.status(404).json({ message: "Transportista no encontrado" });
                return;
            }

            res.status(200).json(carrier);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al obtener el transportista" });
        }
    }

    async createCarrier(req: Request, res: Response): Promise<void> {
        try {
            const carrierData = req.body as Omit<Carrier, 'id'>;

            if (!carrierData) {
                res.status(400).json({ message: "Faltan datos requeridos para crear el transportista" });
                return;
            }

            if (!carrierData.userId) {
                res.status(400).json({ message: "Se requiere el ID del usuario" });
                return;
            }

            if (!carrierData.routeId) {
                res.status(400).json({ message: "Se requiere el ID de la ruta" });
                return;
            }

            if (carrierData.maxWeight <= 0) {
                res.status(400).json({ message: "El peso máximo debe ser mayor a 0" });
                return;
            }

            if (carrierData.maxItems <= 0) {
                res.status(400).json({ message: "El número máximo de ítems debe ser mayor a 0" });
                return;
            }

            const newCarrier = await carrierService.createCarrier(carrierData);
            res.status(201).json(newCarrier);
        } catch (error) {
            console.error(error);
            if (error instanceof DatabaseError) {
                if (error.code === '23505') {
                    res.status(409).json({ message: "El transportista ya existe" });
                    return;
                }
                if (error.code === '23503' && error.message.includes('routeId')) {
                    res.status(400).json({ message: "La ruta especificada no existe" });
                    return;
                }
                if (error.code === '23503' && error.message.includes('userId')) {
                    res.status(400).json({ message: "El usuario especificado no existe" });
                    return;
                }
            }
            res.status(500).json({ message: "Error al crear el transportista" });
        }
    }

    async updateCarrier(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const carrierData = req.body as Partial<Carrier>;

            if (!carrierData) {
                res.status(400).json({ message: "Faltan datos requeridos para actualizar el transportista" });
                return;
            }

            const existingCarrier = await carrierService.getCarrierById(id);
            if (!existingCarrier) {
                res.status(404).json({ message: "Transportista no encontrado" });
                return;
            }

            if (carrierData.maxWeight !== undefined && carrierData.maxWeight <= 0) {
                res.status(400).json({ message: "El peso máximo debe ser mayor a 0" });
                return;
            }

            if (carrierData.maxItems !== undefined && carrierData.maxItems <= 0) {
                res.status(400).json({ message: "El número máximo de ítems debe ser mayor a 0" });
                return;
            }

            const updatedCarrier = await carrierService.updateCarrier(id, carrierData);

            if (!updatedCarrier) {
                res.status(404).json({ message: "Transportista no encontrado" });
                return;
            }

            res.status(200).json(updatedCarrier);
        } catch (error) {
            console.error(error);
            if (error instanceof DatabaseError) {
                if (error.code === '23503' && error.message.includes('routeId')) {
                    res.status(400).json({ message: "La ruta especificada no existe" });
                    return;
                }

                if (error.code === '22P02') {
                    res.status(400).json({ message: "El ID del transportista o la ruta no es válida" });
                    return;
                }
            }
            res.status(500).json({ message: "Error al actualizar el transportista" });
        }
    }

    async deleteCarrier(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const existingCarrier = await carrierService.getCarrierById(id);
            if (!existingCarrier) {
                res.status(404).json({ message: "Transportista no encontrado" });
                return;
            }

            await carrierService.deleteCarrier(id);
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al eliminar el transportista" });
        }
    }
}

export default new CarrierController();