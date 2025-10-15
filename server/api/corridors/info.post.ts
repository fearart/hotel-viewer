import mongoose from "mongoose";
import jwt from 'jsonwebtoken';

import { Corridor } from "~/types/corridor";
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
    if (body.floorNumber === undefined || body.corridorNumber === undefined) {
        setResponseStatus(event,400,"Bad Request")
        return
    }
    const floorNumber = Number.parseInt(body.floorNumber)
    const floors : Array<any> = await mongoose.connection.db.collection('hotel-floors').find().toArray()
    const floor = floors.find((floor) => floor.floor_number == floorNumber)
    if (floor === undefined) {
        setResponseStatus(event,404,"Not Found")
        return
    }
    let corridorNumber = Number.parseInt(body.corridorNumber)
    let corridor = floor.corridor.find((object: any) => object.corridorNumber == corridorNumber)
    const outputCorridor = {
        ...corridor,
        informatycy: {
            ...corridor.informatycy,
        },
        elektrycy: {
            ...corridor.elektrycy,
        },
    } as Corridor;
    if (corridor === undefined) {
        setResponseStatus(event,404,"Not Found")
        return
    }
    else {
        return JSON.stringify(outputCorridor)
    }
}
catch (e) {
    console.log(e)
}
})