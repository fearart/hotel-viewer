import type mongoose from "mongoose";

export interface InventoryItem {
    _id?: mongoose.Types.ObjectId;
    label: string;
    description: string;
    quantity: number;
    location: string;
    serialNumber: string;
    createdAt: Date;
    notifyAt: Date;
    icon: string;
}
// needed icons