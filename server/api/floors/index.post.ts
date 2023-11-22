import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
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
    let floor_number = await mongoose.connection.db.collection('hotel-floors').countDocuments() + 1
    let floor = {
        "floor_number" : floor_number,
        "rooms" : [],
    }
    mongoose.connection.db.collection('hotel-floors').insertOne(floor)
})