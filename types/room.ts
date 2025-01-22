export interface Room {
    /** @deprecated */
    floor_number: number;
    floorNumber: number;
    /** @deprecated */
    room_number: number;
    roomNumber: number;
    alarm: boolean;
    informatycy: {
        hasAccessPoint: "Yes" | "No" | "unknown";
        hasBathPhone: "Yes" | "No" | "unknown";
        hasPhone: "Yes" | "No" | "unknown";
        hasTV: "Yes" | "No" | "unknown";
        hasLock: "Yes" | "No" | "unknown";
        macAddress: string;
        Icomment: string;
        _id: string;
    },

    elektrycy: {
        hasSocket: "Yes" | "No" | "unknown";
        hasBulb: "Yes" | "No" | "unknown";
        hasFreezer: "Yes" | "No" | "unknown";
        hasDryer: "Yes" | "No" | "unknown";
        hasMirror: "Yes" | "No" | "unknown";
        hasAC: "Yes" | "No" | "unknown";
        Ecomment: string;
        _id: string;
    },

    konserwatorzy: {
        hasShower: "Yes" | "No" | "unknown";
        hasToilet: "Yes" | "No" | "unknown";
        hasRadiator: "Yes" | "No" | "unknown";
        hasBidet: "Yes" | "No" | "unknown";
        hasSink: "Yes" | "No" | "unknown";
        hasDoor: "Yes" | "No" | "unknown"; // drzwi do pokoju
        hasDrain: "Yes" | "No" | "unknown"; // kratka balkon
        hasWallpaper: "Yes" | "No" | "unknown"; // tapety
        hasTiles: "Yes" | "No" | "unknown"; // Plytki + kamien
        hasJoints: "Yes" | "No" | "unknown"; // Fugi ( pomiedzy płytkami)
        hasSilicone: "Yes" | "No" | "unknown"; // Silikon
        hasCeiling: "Yes" | "No" | "unknown"; // sufit
        hasVent: "Yes" | "No" | "unknown"; // kratka wentylacyjna
        hasRevisionDoor: "Yes" | "No" | "unknown"; // Drwiczki rewizyjne
        hasToiletDoor: "Yes" | "No" | "unknown"; // drzwi do toalety
        hasWindow: "Yes" | "No" | "unknown"; // Szyby
        hasCeilingPainting: "Yes" | "No" | "unknown"; // Malowanie sufitu
        Kcomment: string;
        _id: string;
    },

    pokojowe: {
        hasCarpet: "Yes" | "No" | "unknown"; // Wykładzina
        hasBed: "Yes" | "No" | "unknown"; // Meble
        hasCurtains: "Yes" | "No" | "unknown"; // firany
        hasPainting: "Yes" | "No" | "unknown"; // Obrazy
        hasSafe: "Yes" | "No" | "unknown"; // Sejf
        hasBroom: "Yes" | "No" | "unknown"; // Szczotka
        hasKettle: "Yes" | "No" | "unknown"; // Czajnik
        Pcomment: string;
        _id: string;
    },
    
    administracja: {
        isApproved: "Yes" | "No" | "unknown";
        isApprovedBy: string;
        isApprovedDate: Date;
        Acomment: string;
        _id: string;
    }
}