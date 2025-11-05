import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import { InventoryItem } from "~/types/inventoryItem";
import Logger from "~/utilities/logger";
const config = useRuntimeConfig();

const unauthorizedReturn = (event: any) => {
    setResponseStatus(event,401,"Unauthorized")
}

export default defineEventHandler(async (event) => {
    let token = getCookie(event,'token')
    console.log("Creating new item, token:",token)
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
    console.log("Body:",body)
    if (!body) {
        setResponseStatus(event,400,"Bad Request")
        return {
            statusCode: 400,
            body: "Bad Request"
        }
    }
    console.log("Creating new inventory item:",body)
    console.log(`Type of fields: label=${typeof body.label}, createdAt=${typeof body.createdAt}, notifyAt=${typeof body.notifyAt}, quantity=${typeof body.quantity}, serialNumber=${typeof body.serialNumber}, location=${typeof body.location}, description=${typeof body.description}`)
    if (!body.label || !body.createdAt || !body.notifyAt || !body.quantity || !body.serialNumber || !body.location || !body.description) {
        setResponseStatus(event,400,"Bad Request")
        console.log("Bad Request - missing fields")
        return {
            statusCode: 400,
            body: "Bad Request"
        }
    }
    if (body.icon === undefined || body.icon === null) {
        body.icon = "public/img/pngs/fire_ext_green.png"
    }
    await mongoose.connection.collection('hotel-inventory').insertOne(body)
    await mongoose.connection.collection('hotel-logs').insertOne({
        "ID" : await Logger.getID(),
        "type" : "create",
        "event" : `Item #${String(body._id)} was created`,
        //"user" : await Logger.search(token),
        "timestamp" : Date.now(),
        "details" : body
    })
    setResponseStatus(event,200,"OK")
    return {
      statusCode: 200,
      body: body
    }
})