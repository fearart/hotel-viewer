import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import Logger from "~/utilities/logger";
import Floor from "~/model/floor";
import type { Corridor } from "~/types/corridor";
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
    if (body.corridorNumber === undefined || body.floorNumber === undefined) {
        setResponseStatus(event,400,"Bad Request")
        return
    }
    let match = Number.parseInt(body.corridorNumber)
    let floorNumber = Number.parseInt(body.floorNumber)
    const floor = await Floor.findOne({floor_number: floorNumber})
    if (!floor) {
        setResponseStatus(event,404,"Not Found")
        return
    }
    // @ts-ignore
    const corridorRecord = floor.corridor.find(
        (item) => item.corridorNumber === match
    ) as Corridor;
    const newCorridorRecord = {
        ...corridorRecord,
        ...body
    } as Corridor;
    console.log(newCorridorRecord)
    floor.corridor.remove(corridorRecord)
    floor.corridor.push(newCorridorRecord)
    await Floor.updateOne({floor_number: floorNumber}, {$set: {corridor: floor.corridor}})
    mongoose.connection.db.collection('hotel-logs').insertOne({
        "ID" : await Logger.getID(),
        "type" : "modify",
        "event" : `Corridor AP #${body.corridorNumber} was modified`,
        "user" : await Logger.search(token),
        "timestamp" : Date.now(),
        "details" : body
    })
    return {
        statusCode: 200,
        body: "OK"
    }
})