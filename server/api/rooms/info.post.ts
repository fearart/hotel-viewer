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
        return {
            hasPhone: room.hasPhone,
            hasTV: room.hasTV,
            hasAccessPoint: room.hasAccessPoint,
            hasBathPhone: room.hasBathPhone,
            comment: roomComment,
            macAddress: roomMac,
            alarm: room.alarm,
            hasLock: room.hasLock,
            hasBroom: room.hasBroom,
            hasSink: room.hasSink,
            hasToilet: room.hasToilet,
            hasRadiator: room.hasRadiator,
            hasShower: room.hasShower,
            hasBidet: room.hasBidet,
            hasSocket: room.hasSocket,
            hasBulb: room.hasBulb,
            hasBed: room.hasBed,
            hasGuard: room.hasGuard,
            hasAdmin: room.hasAdmin,
            hasDoor: room.hasDoor,
            Ecomment: room.Ecomment,
            Kcomment: room.Kcomment,
            Icomment: room.Icomment,
            Pcomment: room.Pcomment,
            Acomment: room.Acomment,
        }
    }
}
catch (e) {
    console.log(e)
}
})