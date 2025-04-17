import { UserRole } from '../utils/enums';

interface User {
  id: string;
  email: string;
  password: string; 
  firstName: string;
  lastName: string;
  documentType: string; 
  documentNumber: string;
  phoneNumber: string;
  role: UserRole;
  
  defaultAddress?: {
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  
  // Rastreo de cuenta
  isActive: boolean;
  emailVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export default User;