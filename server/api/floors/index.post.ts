import mongoose, { mongo } from "mongoose";
import jwt from 'jsonwebtoken';
import Logger from "~/utilities/logger";
const unauthorizedReturn = (event: any) => {
    setResponseStatus(event,401,"Unauthorized")
}

export default defineEventHandler(async (event) => {
    let token = getCookie(event,'token')
    const config = useRuntimeConfig();
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
    await mongoose.connect(config.mongodb_uri);
    let floor_number = await mongoose.connection.db.collection('hotel-floors').countDocuments() + 1
    let floor = {
        "floor_number" : floor_number,
        "rooms" : [],
    }
    mongoose.connection.db.collection('hotel-floors').insertOne(floor)
    mongoose.connection.db.collection('hotel-logs').insertOne({
        "event" : `Floor added`,
        "type" : "info",
        "timestamp" : Date.now(),
        "user" : await new Logger(token).search(),
        "details" : {
            "floor_number" : floor_number,
        },
        'ID' : await Logger.getID()
    })
})