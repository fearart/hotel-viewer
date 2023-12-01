import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
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
    if (body.floor_number === undefined) {
        setResponseStatus(event,400,"Bad Request")
        return
    }
    const floor_number = Number.parseInt(body.floor_number)
    console.log(floor_number)
    const floors : Array<any> = await mongoose.connection.db.collection('hotel-floors').find().toArray()
    const floor = floors.find((floor) => floor.floor_number == floor_number)
    if (floor === null) {
        setResponseStatus(event,404,"Not Found")
        return
    }
    let corridors = []
    try {
        corridors = floor.corridors
    }
    catch {
        corridors = []
    }
    if (body.corridor_number === undefined) {
        setResponseStatus(event,400,"Bad Request")
        return
    }
    let corridor_number = Number.parseInt(body.corridor_number)
    let corridor = floor.corridor.find((object: any) => object.accessPointNumber == corridor_number)
    if (corridor === undefined) {
        setResponseStatus(event,404,"Not Found")
        return
    }
    else {
        let roomComment = corridor.comment || "";
        let roomMac = corridor.macAddress || "";
        return {
            comment: roomComment,
            macAddress: roomMac,
        }
    }
}
catch (e) {
    console.log(e)
}
})