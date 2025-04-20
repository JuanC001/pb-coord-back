import { Shipment } from "./Shipment";

export interface Carrier {
    id: string;
    userId: string;
    maxWeight: number;
    maxItems: number;
    routeId: string;
    shipments?: Shipment[];
}