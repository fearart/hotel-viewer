export interface OldRoom {
    room_number: number;
    hasAccessPoint: "Yes" | "No" | "unknown";
    hasTV: "Yes" | "No" | "unknown";
    hasPhone: "Yes" | "No" | "unknown";
    hasBathPhone: "Yes" | "No" | "unknown";
    comments: string;
    macAddress: string;
    alarm: boolean;
    hasLock: "Yes" | "No" | "unknown";
    hasBroom: "Yes" | "No" | "unknown";
    hasSink: "Yes" | "No" | "unknown";
    hasToilet: "Yes" | "No" | "unknown";
    hasRadiator: "Yes" | "No" | "unknown";
    hasShower: "Yes" | "No" | "unknown";
    hasBidet: "Yes" | "No" | "unknown";
    hasSocket: "Yes" | "No" | "unknown";
    hasBulb: "Yes" | "No" | "unknown";
    hasBed: "Yes" | "No" | "unknown";
    hasGuard: "Yes" | "No" | "unknown";
    hasAdmin: "Yes" | "No" | "unknown";
    hasDoor: "Yes" | "No" | "unknown";
    hasDoctor: "Yes" | "No" | "unknown";
    Ecomment: string;
    Kcomment: string;
    Icomment: string;
    Pcomment: string;
    Acomment: string;
}