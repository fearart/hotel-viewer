export interface Corridor {
    corridorNumber: number;
    floorNumber: number;
    alarm: boolean;

    /** @deprecated */
    comment: string;
    
    informatycy: {
        hasAccessPoint: "Yes" | "No" | "unknown";
        macAddress: string;
        Icomment: string;
        _id: string;
    },
    elektrycy: {
        hasBulb: "Yes" | "No" | "unknown";
        hasSocket: "Yes" | "No" | "unknown";
        Ecomment: string;
        _id: string;
    },
}