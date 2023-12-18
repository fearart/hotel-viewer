import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import Logger from "~/utilities/logger";
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
    if (body.floor_number === undefined || body.accessPointNumber === undefined || body.macAddress === undefined || 
        body.comment === undefined || body.APStatus === undefined) {
        setResponseStatus(event,400,"Bad Request")
        return
    }
    const floor_number = Number.parseInt(body.floor_number)
    const floor = await mongoose.connection.db.collection('hotel-floors').findOne({floor_number: floor_number})
    if (floor === null) {
        setResponseStatus(event,404,"Not Found")
        return
    }
    let corridor = []
    try {
        corridor = floor.corridor
    }
    catch {
        corridor = []
    }
    let corridor_number = 1
    if (corridor.length == 0) {
        corridor_number = Number.parseInt(`${floor_number}001`)
    }
    else {
        corridor_number = Number.parseInt(body.accessPointNumber)
    }
    let corridor_record = {
        'accessPointNumber' : corridor_number,
        "macAddress" : body.macAddress,
        "comment" : body.comment,
        "APStatus" : body.APStatus
    }
    corridor = corridor.filter((record:any) => record.accessPointNumber != body.accessPointNumber)
    corridor.push(corridor_record)
    corridor.sort((a:any,b:any) => a.accessPointNumber - b.accessPointNumber)
    let floor_obj = Object.assign(floor, {corridor: corridor})
    mongoose.connection.db.collection('hotel-floors').replaceOne({floor_number: floor_number},floor_obj,{upsert: true})
    mongoose.connection.db.collection('hotel-logs').insertOne({
        "ID" : Logger.getID(),
        "type" : "modify",
        "event" : `Corridor AP #${corridor_number} was modified`,
        "user" : new Logger(token).search(),
        "timestamp" : Date.now(),
        "details" : body
    })
    return {
        statusCode: 200,
        body: "OK"
    }
})