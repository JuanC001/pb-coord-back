import { Request, Response } from "express";
import { Route } from "../models/Route";
import routeService from "../services/route.service";
import { DatabaseError } from 'pg';

export class RouteController {

    async getRoutes(req: Request, res: Response): Promise<void> {
        try {
            const routes = await routeService.getRoutes();
            res.status(200).json(routes);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al obtener las rutas" });
        }
    }

    async getRouteById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const route = await routeService.getRouteById(id);

            if (!route) {
                res.status(404).json({ message: "Ruta no encontrada" });
                return;
            }

            res.status(200).json(route);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al obtener la ruta" });
        }
    }

    async createRoute(req: Request, res: Response): Promise<void> {
        try {
            const routeData = req.body as Omit<Route, 'id'>;

            if (!routeData) {
                res.status(400).json({ message: "Faltan datos requeridos para crear la ruta" });
                return;
            }

            if (!routeData.name || !routeData.origin || !routeData.destination) {
                res.status(400).json({ message: "Faltan datos requeridos para crear la ruta" });
                return;
            }

            const newRoute = await routeService.createRoute(routeData);
            res.status(201).json(newRoute);
        } catch (error) {
            console.error(error);
            if (error instanceof DatabaseError && error.code === '23505') {
                res.status(409).json({ message: "La ruta ya existe" });
                return;
            }
            res.status(500).json({ message: "Error al crear la ruta" });
        }
    }

    async updateRoute(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const routeData = req.body as Partial<Route>;

            if (Object.keys(routeData).length === 0) {
                res.status(400).json({ message: "No se han proporcionado datos para actualizar" });
                return;
            }

            const updatedRoute = await routeService.updateRoute(id, routeData);

            if (!updatedRoute) {
                res.status(404).json({ message: "Ruta no encontrada" });
                return;
            }

            res.status(200).json(updatedRoute);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al actualizar la ruta" });
        }
    }

    async deleteRoute(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const existingRoute = await routeService.getRouteById(id);
            if (!existingRoute) {
                res.status(404).json({ message: "Ruta no encontrada" });
                return;
            }

            await routeService.deleteRoute(id);
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al eliminar la ruta" });
        }
    }
}

export default new RouteController();