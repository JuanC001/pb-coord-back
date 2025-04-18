import { Request, Response, NextFunction } from 'express';
import { validateJWT, JWTPayload } from '../utils/jwt';
import { UserRole } from '../utils/enums';

declare module 'express' {
    interface Request {
        user?: JWTPayload;
    }
}

export const validateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        res.status(401).json({
            message: 'No hay token en la petición'
        });
        return
    }

    const { valid, payload } = validateJWT(token);

    if (!valid) {
        res.status(401).json({
            message: 'Token no válido'
        });
        return
    }

    req.user = payload;

    next();
};

export const hasRole = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            res.status(500).json({
                message: 'Error en la validación del token'
            });
            return
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                message: `Usuario sin permisos suficientes. Roles necesarios: ${roles.join(', ')}`
            });
            return
        }

        next();
    };
};