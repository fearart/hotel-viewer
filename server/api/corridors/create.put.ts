import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
const config = useRuntimeConfig();
import { Corridor } from "~/types/corridor";
import Floor from "~/model/floor";
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
    const floor = await Floor.findOne({floor_number: floor_number})
    if (!floor) {
        setResponseStatus(event,404,"Not Found")
        return
    }
    let corridorNumber;
    if (!floor.corridor || floor.corridor.length === 0) {
        corridorNumber = Number.parseInt(`${floor_number}001`);
    } else {
        //@ts-ignore
        corridorNumber = floor.corridor[floor.corridor.length - 1].corridorNumber + 1;
    }
    const newCorridorRecord = {
        corridorNumber: corridorNumber,
        floorNumber: floor_number,
        alarm: false,
        informatycy: {
            hasAccessPoint: "unknown",
            macAddress: "",
            Icomment: "",
        },
        elektrycy: {
            hasBulb: "unknown",
            hasSocket: "unknown",
            Ecomment: "",
        },
    } as Corridor;
    floor.corridor.push(newCorridorRecord)
    await Floor.updateOne({floor_number: floor_number}, {$set: {corridor: floor.corridor}})
})