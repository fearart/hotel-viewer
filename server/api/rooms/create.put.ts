import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import Logger from "~/utilities/logger";
import Floor from "~/model/floor";
import type { Room } from "~/types/room";
const config = useRuntimeConfig();

const unauthorizedReturn = (event: any) => {
    setResponseStatus(event,401,"Unauthorized")
}

export default defineEventHandler(async (event) => {
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
    if (body.floorNumber === undefined) {
        setResponseStatus(event,400,"Bad Request")
        return
    }
    let floorNumber = Number.parseInt(body.floorNumber)
    const floor = await Floor.findOne({floor_number: floorNumber})
    if (!floor) {
        setResponseStatus(event,404,"Not Found")
        return
    }
    let roomNumber;
    if (floor.rooms.length === 0) {
        roomNumber = Number(floorNumber + "001");
    } else {
        roomNumber = floor.rooms[floor.rooms.length - 1].roomNumber + 1;
    }
    const newRoomRecord = {
        floorNumber: floorNumber,
        roomNumber: roomNumber,
        alarm: false,
        informatycy: {
            hasAccessPoint: "unknown",
            hasBathPhone: "unknown",
            hasPhone: "unknown",
            hasTV: "unknown",
            hasLock: "unknown",
            macAddress: "",
            Icomment: "",
        },
        elektrycy: {
            hasSocket: "unknown",
            hasBulb: "unknown",
            hasFreezer: "unknown",
            hasDryer: "unknown",
            hasMirror: "unknown",
            hasAC: "unknown",
            Ecomment: "",
        },
        administracja: {
            isApproved: "No",
            isApprovedBy: "",
            isApprovedDate: "",
            Acomment: "",
        },
        konserwatorzy: {
            hasShower: "unknown",
            hasToilet: "unknown",
            hasRadiator: "unknown",
            hasBidet: "unknown",
            hasSink: "unknown",
            hasDoor: "unknown",
            hasDrain: "unknown",
            hasWallpaper: "unknown",
            hasTiles: "unknown",
            hasJoints: "unknown",
            hasSilicone: "unknown",
            hasCeiling: "unknown",
            hasVent: "unknown",
            hasRevisionDoor: "unknown",
            hasToiletDoor: "unknown",
            hasWindow: "unknown",
            hasCeilingPainting: "unknown",
            Kcomment: "",
        },
        pokojowe: {
            hasCarpet: "unknown",
            hasBed: "unknown",
            hasCurtains: "unknown",
            hasPainting: "unknown",
            hasSafe: "unknown",
            hasBroom: "unknown",
            hasKettle: "unknown",
            Pcomment: "",
        }
    } as unknown as Room
    floor.rooms.push(newRoomRecord)
    await Floor.updateOne({floor_number: floorNumber}, {$set: {rooms: floor.rooms}})
    mongoose.connection.db.collection('hotel-logs').insertOne({
        "ID" : await Logger.getID(),
        "type" : "create",
        "event" : `Room #${String(floor.rooms.length)} was created`,
        "user" : await Logger.search(token),
        "timestamp" : Date.now(),
        "details" : body
    })
    return {
        statusCode: 200,
        body: "OK"
    }
})