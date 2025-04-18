import { ShipmentStatus } from "../utils/enums";

export interface Shipment {
    id: string;
    orderId: string;
    carrierId: string;
    status: ShipmentStatus;
    trackingNumber: string;

    createdAt: Date;
    updatedAt: Date;
}