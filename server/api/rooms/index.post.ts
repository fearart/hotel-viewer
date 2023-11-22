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
    let floor = {
        "floor_number" : floor_number,
        "rooms" : rooms,
    }
    mongoose.connection.db.collection('hotel-floors').replaceOne({floor_number: floor_number},floor,{upsert: true})
})