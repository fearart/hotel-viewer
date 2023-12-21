import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
const config = useRuntimeConfig();
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
    if (body.floor_number === undefined) {
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
        let biggest_room_number = rooms.reduce((prev:any, current:any) => (prev.room_number > current.room_number) ? prev : current)
        room_number = biggest_room_number.room_number + 1
    }
    let room = {
        'room_number' : room_number,
        'hasAccessPoint' : "unknown",
        'hasTV' : "unknown",
        "hasPhone" : "unknown",
        'hasBathPhone' : "unknown",
        "comment" : "",
        "macAddress" : "",
        "alarm" : false,
        'hasLock' : 'unknown',
        'hasBroom' : 'unknown',
        'hasSink' : 'unknown',
        'hasToilet' : 'unknown',
        'hasRadiator' : 'unknown',
        'hasShower' : 'unknown',
        'hasBidet' : 'unknown',
        'hasSocket' : 'unknown',
        'hasBulb' : 'unknown',
        'hasBed' : 'unknown',
        'hasGuard' : 'unknown',
        'hasAdmin' : 'unknown',
        'hasDoor' : 'unknown',
        'Ecomment' : "",
        'Kcomment' : "",
        'Icomment' : "",
        'Pcomment' : "",
        'Acomment' : "",
    }
    rooms.push(room)
    Object.assign(floor, {rooms: rooms})
    await mongoose.connection.db.collection('hotel-floors').updateOne({floor_number: floor_number},{$set: floor})
    await mongoose.connection.db.collection('hotel-logs').insertOne({
        "event" : `Room added`,
        "type" : "info",
        "timestamp" : Date.now(),
        "user" : await new Logger(token).search(),
        "details" : {
            "floor_number" : floor_number,
            "room_number" : room_number,
        },
        'ID' : await Logger.getID()
    })
    return {
        body: room
    }
})