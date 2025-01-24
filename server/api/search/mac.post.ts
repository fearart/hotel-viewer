import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import Logger from "~/utilities/logger";
import { Room } from "~/types/room";
import { Corridor } from "~/types/corridor";
const unauthorizedReturn = (event: any) => {
    setResponseStatus(event,401,"Unauthorized")
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    await mongoose.connect(config.mongodb_uri);
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
    if (body.macAddress === undefined) {
        setResponseStatus(event,400,"Bad Request")
        return
    }
    const mac: string = body.macAddress 
    const floors : Array<any> = await mongoose.connection.db.collection('hotel-floors').find().toArray()
    let rooms: Array<Room> = []
    let corridor: Array<Corridor> = []
    floors.forEach((floor) => {
        try {
            rooms = rooms.concat(floor.rooms)
            corridor = corridor.concat(floor.corridor)
        }
        catch {
            rooms = []
            corridor = []
        }
    })
    console.log(rooms)
    let record = rooms.find((room: Room) => room.informatycy.macAddress == mac)
    if (record !== undefined) {
        record.type = "room"
        return record
    }
    else {
        record = corridor.find((corridor: Corridor) => corridor.macAddress == mac)
        if (record !== undefined) {
            record.type = "corridor"
            return record
        }
        else {
            return {}
        }
    }
}
catch (e) {
    console.log(e)
}
})