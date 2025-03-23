import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import Logger from "~/utilities/logger";
import { Room } from "~/types/room";
import { Corridor } from "~/types/corridor";
import type { IMacSearchResponse } from "~/types/macsearchresponse";
const unauthorizedReturn = (event: any) => {
    setResponseStatus(event,401,"Unauthorized")
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    await mongoose.connect(config.mongodb_uri);
    try {
    let token = getCookie(event,'token')
    if (!token) {
        unauthorizedReturn(event)
        return
    }
    try {
        jwt.verify(token,config.jwt_secret)
    }
    catch {
        unauthorizedReturn(event)
        return
    }
    const body = await readBody(event)
    if (body.macAddress === undefined) {
        setResponseStatus(event,400,"Bad Request")
        return
    }
    const mac: string = body.macAddress 
    const floors : Array<any> = await mongoose.connection.db.collection('hotel-floors').find().toArray()
    let rooms: Array<Room> = []
    let corridor: Array<Corridor> = []
    floors.forEach((floor) => {
        try {
            rooms = rooms.concat(floor.rooms)
            corridor = corridor.concat(floor.corridor)
        }
        catch {
            rooms = []
            corridor = []
        }
    })
    const matchedRecords: (Room | Corridor)[] = [];
    let record : Room | Corridor | undefined = rooms.find((room: Room) => compareMacEnds(room.informatycy.macAddress,mac.toUpperCase()))
    if (record !== undefined) {
        rooms.forEach(room => {
            if (compareMacEnds(room.informatycy.macAddress, mac.toUpperCase())) {
                room.type = "R"
                matchedRecords.push(room);
            }
        });
        return matchedRecords;
    }
    else {
        record = corridor.find((corridor: Corridor) => compareMacEnds(corridor.informatycy.macAddress,mac.toUpperCase()))
        if (record !== undefined) {
            corridor.forEach(corridor => {
                if (compareMacEnds(corridor.informatycy.macAddress, mac.toUpperCase())) {
                    corridor.type = 'K'
                    matchedRecords.push(corridor);
                }
            });
            return matchedRecords;
        }
        else {
            return {}
        }
    }
}
catch (e) {
    console.log(e)
}
})
function compareMacEnds(mac1: string, mac2: string): boolean {
    if (mac1 === null || mac2 === null) { return false }
    const getLastTwoPairs = (mac: string) => {
        const parts = mac.split(":");
        return parts.slice(-2).join(":");
    };

    return getLastTwoPairs(mac1).toLowerCase() === getLastTwoPairs(mac2).toLowerCase();
}