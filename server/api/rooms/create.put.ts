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
        console.log(room_number)
        console.log(biggest_room_number)
    }
    let room = {
        'room_number' : room_number,
        'hasAccessPoint' : "unknown",
        'hasTV' : "unknown",
        "hasPhone" : "unknown",
        'hasBathPhone' : "unknown"
    }
    rooms.push(room)
    let floor_obj = {
        "floor_number" : floor_number,
        "rooms" : rooms,
    }

    mongoose.connection.db.collection('hotel-floors').replaceOne({floor_number: floor_number},floor_obj,{upsert: true})
    return {
        body: room
    }
})