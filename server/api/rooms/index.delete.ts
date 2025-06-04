import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import Logger from "~/utilities/logger";
import Floor from "~/model/floor";
import type { Room } from "~/types/room";
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
    if (body.floorNumber === undefined || body.roomNumber === undefined) {
        setResponseStatus(event,400,"Bad Request")
        return
    }
    let floorNumber = Number.parseInt(body.floorNumber)
    let roomNumber = Number.parseInt(body.roomNumber)
    const floor = await Floor.findOne({floor_number: floorNumber})
    if (!floor) {
        setResponseStatus(event,404,"Not Found")
        return
    }
    const roomIndex = floor.rooms.findIndex((a) => a.roomNumber === roomNumber);
    if (roomIndex === -1) {
      setResponseStatus(event, 404, "Not Found");
      return;
    }
    floor.rooms.splice(roomIndex, 1);
    await Floor.updateOne({floor_number: floorNumber}, {$set: {rooms: floor.rooms}})
    await mongoose.connection.db.collection('hotel-logs').insertOne({
        "ID" : await Logger.getID(),
        "type" : "modify",
        "event" : "Rooms Deleted",
        "user" : await Logger.search(token),
        "timestamp" : new Date().getTime(),
        "details" : roomNumber
    })
    return {
        statusCode: 200,
        body: "OK"
    }
})