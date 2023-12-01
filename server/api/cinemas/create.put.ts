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
    let cinemas = floor.cinema
    if (cinemas === undefined) {
        cinemas = []
    }

    let AccessPointNumber = 1
    if (cinemas.length == 0) {
        AccessPointNumber = Number.parseInt(`${floor_number}001`)
    }
    else {
        let biggestCinemaNumber = cinemas.reduce((prev:any, current:any) => (prev.AccessPointNumber > current.AccessPointNumber) ? prev : current)
        AccessPointNumber = biggestCinemaNumber.number + 1
    }
    let AcessPointRecord = {
        "accessPointNumber" : AccessPointNumber,
        "macAddress" : "",
        "comment" : "",
    }
    console.log(AcessPointRecord)
    cinemas.push(AcessPointRecord)
    console.log(cinemas)
    Object.assign(floor, {cinema: cinemas})
    mongoose.connection.db.collection('hotel-floors').replaceOne({floor_number: floor_number},floor,{upsert: true})
})