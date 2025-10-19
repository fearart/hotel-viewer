import type mongoose from "mongoose";

export interface InventoryItem {
    _id: mongoose.Types.ObjectId;
    label: string;
    creatadAt: Date;
    notifyAt: Date;
    quantity: number;
    serialNumber: string;
    location: string;
    description: string;
}