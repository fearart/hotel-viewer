import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import Logger from "~/utilities/logger";
const unauthorizedReturn = (event: any) => {
    setResponseStatus(event,401,"Unauthorized")
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    await mongoose.connect(config.mongodb_uri);
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
    if (body.floor_number === undefined || body.room_number === undefined || body.hasPhone === undefined || body.hasTV === undefined || 
        body.hasAccessPoint === undefined || body.hasBathPhone === undefined || body.comment === undefined || body.macAddress === undefined || 
        body.alarm === undefined || body.hasLock === undefined || body.hasBroom === undefined || body.hasSink === undefined || body.hasToilet === undefined ||
        body.hasRadiator === undefined || body.hasShower === undefined || body.hasBidet === undefined || body.hasSocket === undefined || 
        body.hasBulb === undefined || body.hasBed === undefined || body.hasGuard === undefined || body.hasAdmin === undefined || body.hasDoor === undefined ||
        body.hasDoctor === undefined) {
        setResponseStatus(event,400,"Bad Request")
        return
    }
    const floor_number = Number.parseInt(body.floor_number)
    const floor = await mongoose.connection.db.collection('hotel-floors').findOne({floor_number: floor_number})
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
    let room_number = 1
    if (rooms.length == 0) {
        room_number = Number.parseInt(`${floor_number}001`)
    }
    else {
        room_number = Number.parseInt(body.room_number)
    }
    let room = {
        'room_number' : room_number,
        'hasAccessPoint' : body.hasAccessPoint,
        'hasTV' : body.hasTV,
        "hasPhone" : body.hasPhone,
        'hasBathPhone' : body.hasBathPhone,
        "comment" : body.comment,
        "macAddress" : body.macAddress.toUpperCase(),
        "alarm" : body.alarm,
        'hasLock' : body.hasLock,
        'hasBroom' : body.hasBroom,
        'hasSink' : body.hasSink,
        'hasToilet' : body.hasToilet,
        'hasRadiator' : body.hasRadiator,
        'hasShower' : body.hasShower,
        'hasBidet' : body.hasBidet,
        'hasSocket' : body.hasSocket,
        'hasBulb' : body.hasBulb,
        'hasBed' : body.hasBed,
        'hasGuard' : body.hasGuard,
        'hasAdmin' : body.hasAdmin,
        'hasDoor' : body.hasDoor,
        'hasDoctor' : body.hasDoctor,
        'Ecomment' : body.Ecomment,
        'Kcomment' : body.Kcomment,
        'Icomment' : body.Icomment,
        'Pcomment' : body.Pcomment,
        'Acomment' : body.Acomment,
    }

    // delete old room  
    rooms = rooms.filter((room:any) => room.room_number != room_number)
    rooms.push(room)
    let floor_obj = Object.assign(floor, {rooms: rooms})
    mongoose.connection.db.collection('hotel-floors').replaceOne({floor_number: floor_number},floor_obj,{upsert: true})
    mongoose.connection.db.collection('hotel-logs').insertOne({
        "event" : `Room #${room_number} modified.`,
        "type" : "modify",
        "timestamp" : Date.now(),
        "user" : await new Logger(token).search(),
        "details" : `${JSON.stringify(room)}`,
        'ID' : await Logger.getID()
        
    })
    return {
        statusCode: 200,
        body: "OK"
    }
})