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

export const validateJWT = (token: string) => {
    try {
        const { uid, email, role } = verify(token, SECRET_KEY_JWT as string) as {
            uid: string;
            email: string;
            role: UserRole;
        };
        return true
    } catch (error) {
        console.error(error)
        return false;
    }
}