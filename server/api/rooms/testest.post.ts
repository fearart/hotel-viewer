import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
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
    const floors = await mongoose.connection.db.collection('hotel-floors').find().toArray()
    floors[1].rooms.forEach(element => {
        element.hasLock = "Yes"
    });
    await mongoose.connection.db.collection('hotel-floors').updateOne({floor_number: 2},{$set: {rooms: floors[1].rooms}})
})