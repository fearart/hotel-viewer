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
    if (body.roomNumber === undefined || body.floorNumber === undefined) {
        setResponseStatus(event,400,"Bad Request")
        return
    }
    let roomNumber = Number.parseInt(body.roomNumber)
    let floorNumber = Number.parseInt(body.floorNumber)
    const floor = await Floor.findOne({floor_number: floorNumber})
    if (!floor) {
        setResponseStatus(event,404,"Not Found")
        return
    }
    // @ts-ignore
    const roomRecord = floor.rooms.find(
        (item) => item.roomNumber === roomNumber
    ) as Room;
    if (body.administracja.isApproved && body.administracja.isApproved === undefined) {
        body.administracja.isApproved = 'No'
        body.administracja.isApprovedBy = ''
        body.administracja.isApprovedDate = '' 
    }   
    const newRoomRecord = {
        ...roomRecord,
        ...body
    } as Room;
    // remove old room record
    floor.rooms.remove(roomRecord)
    // add new room record
    floor.rooms.push(newRoomRecord)
    await Floor.updateOne({floor_number: floorNumber}, {$set: {rooms: floor.rooms}})
    mongoose.connection.db.collection('hotel-logs').insertOne({
        "ID" : await Logger.getID(),
        "type" : "modify",
        "event" : `Room #${roomNumber} was modified`,
        "user" : await Logger.search(token),
        "timestamp" : Date.now(),
        "details" : body
    })
    return {
        statusCode: 200,
        body: "OK"
    }
})