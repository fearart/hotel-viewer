import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import Logger from "~/utilities/logger";
const config = useRuntimeConfig();

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
    if (body.rooms === undefined) { 
        setResponseStatus(event,400,"Bad Request")
        return
    }
    const floor_number = body.floor_number
    const rooms = body.rooms
    let floor = mongoose.connection.db.collection('hotel-floors').findOne({floor_number: floor_number})
    Object.assign(floor,{rooms: rooms})
    await mongoose.connection.db.collection('hotel-floors').replaceOne({floor_number: floor_number},floor,{upsert: true})
    await mongoose.connection.db.collection('hotel-logs').insertOne({
        "ID" : await Logger.getID(),
        "type" : "modify",
        "event" : "Rooms Modified",
        "user" : await new Logger(token).search(),
        "timestamp" : new Date().getTime(),
        "details" : rooms
    })
})