import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import Logger from "~/utilities/logger";

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
    if (body.floor_number === undefined) {
        setResponseStatus(event,400,"Bad Request")
        return
    }
    const floor_number = Number.parseInt(body.floor_number)
    const floors : Array<any> = await mongoose.connection.db.collection('hotel-floors').find().toArray()
    const floor = floors.find((floor) => floor.floor_number == floor_number)
    if (floor === null) {
        setResponseStatus(event,404,"Not Found")
        return
    }
    let rooms = []
    try {
        rooms = floor.rooms
    }
    catch {
        rooms = []
    }
    if (body.room_number === undefined) {
        setResponseStatus(event,400,"Bad Request")
        return
    }
    let room_number = Number.parseInt(body.room_number)
    let room = floor.rooms.find((room: any) => room.room_number == room_number)
    if (room === undefined) {
        setResponseStatus(event,404,"Not Found")
        return
    }
    else {
        let roomComment = room.comment || "";
        let roomMac = room.macAddress || "";
        await mongoose.connection.db.collection('hotel-logs').insertOne({
            "id" : Logger.getID(),
            "event" : "Get room status",
            "type" : "info",
            "details" : `Room ${room_number} status was requested`,
            "timestamp" : Date.now(),
            "user" : await new Logger(token).search()
        })
        return {
            hasPhone: room.hasPhone,
            hasTV: room.hasTV,
            hasAccessPoint: room.hasAccessPoint,
            hasBathPhone: room.hasBathPhone,
            comment: roomComment,
            macAddress: roomMac,
            alarm: room.alarm,
            hasLock: room.hasLock
        }
    }
}
catch (e) {
    console.log(e)
}
})