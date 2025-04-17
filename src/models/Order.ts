import { OrderStatus } from '../utils/enums';

interface Order {
  id: string;

  userId: string;
  origin: string;
  destination: {
    city: string;
    country: string;
    address: string;
    postalCode: string;
  };
  orderStatus: OrderStatus;
  dimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };

  createdAt: Date;
  updatedAt: Date;
}

export default Order;