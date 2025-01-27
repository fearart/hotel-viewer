import type { Corridor } from "./corridor";
import type { Room } from "./room";

export interface Floor {
    /** @deprecated */
    floor_number: number;
    floorNumber: number;
    rooms: Room[];
    corridor: Corridor[];
    cinemas: any[];
    conferenceRooms: any[];
    restaurants: any[];
    kitchens: any[];
    coffeeBrakes: any[];
}