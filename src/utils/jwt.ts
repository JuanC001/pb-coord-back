import pkg from 'jsonwebtoken';
const { sign, verify } = pkg
import { UserRole } from './enums';

const { SECRET_KEY_JWT } = process.env;

export const generateJWT = async (uid: string, email: string, role: UserRole) => {

    try {
        const token = sign({ uid, email, role }, SECRET_KEY_JWT as string, {
            expiresIn: '1h'
        })

        return token;
    } catch (error) {
        console.error(error)
        return null;
    }

}

export interface JWTPayload {
    uid: string;
    email: string;
    role: UserRole;
}

export const validateJWT = (token: string): { valid: boolean; payload?: JWTPayload } => {
    try {
        const payload = verify(token, SECRET_KEY_JWT as string) as JWTPayload;
        return {
            valid: true,
            payload
        };
    } catch (error) {
        console.error('JWT validation error:', error);
        return {
            valid: false
        };
    }
}