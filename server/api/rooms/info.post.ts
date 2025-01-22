import mongoose from "mongoose";
import jwt from 'jsonwebtoken';

import { Room } from "~/types/room";
const config = useRuntimeConfig();

const unauthorizedReturn = (event: any) => {
    setResponseStatus(event,401,"Unauthorized")
}

export default defineEventHandler(async (event) => {
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
    if (body.floorNumber === undefined || body.roomNumber === undefined) {
        setResponseStatus(event,400,"Bad Request")
        return
    }
    const floor_number = Number.parseInt(body.floorNumber)
    const floors : Array<any> = await mongoose.connection.db.collection('hotel-floors').find().toArray()
    const floor = floors.find((floor) => floor.floor_number == floor_number)
    if (floor === null) {
        setResponseStatus(event,404,"Not Found")
        return
    }
    const roomNumber = Number.parseInt(body.roomNumber)
    let room = floor.rooms.find((object: any) => object.roomNumber == roomNumber)
    if (room === undefined) {
        setResponseStatus(event,404,"Not Found")
        return
    }
    const roomObject = {} as Room;
    roomObject.roomNumber = roomNumber
    roomObject.floorNumber = floor_number
    roomObject.alarm = room.alarm || false
    roomObject.informatycy = room.informatycy
    roomObject.elektrycy = room.elektrycy
    roomObject.konserwatorzy = room.konserwatorzy
    roomObject.pokojowe = room.pokojowe
    roomObject.administracja = room.administracja
    if (room === undefined) {
        setResponseStatus(event,404,"Not Found")
        return
    }
    else {
        return JSON.stringify(roomObject)
    }
}
catch (e) {
    console.log(e)
}
})