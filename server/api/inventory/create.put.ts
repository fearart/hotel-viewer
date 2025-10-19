import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import { InventoryItem } from "~/types/inventoryItem";
import Logger from "~/utilities/logger";
const config = useRuntimeConfig();

const unauthorizedReturn = (event: any) => {
    setResponseStatus(event,401,"Unauthorized")
}

export default defineEventHandler(async (event) => {
    /*let token = getCookie(event,'token')
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
    }*/
    const body = await readBody(event)
    console.log("Body:",body)
    if (!body) {
        setResponseStatus(event,400,"Bad Request")
        return {
            statusCode: 400,
            body: "Bad Request"
        }
    }
    // check if body has all fields for inventory item
    if (Object.keys(body).length !== 0) {
        setResponseStatus(event,400,"Bad Request")
        console.log("Bad Request - empty body")
        return {
            statusCode: 400,
            body: "Bad Request"
        }
    }
    if (!body.label || !body.notifyAt || !body.quantity || !body.serialNumber || !body.location || !body.description) {
        setResponseStatus(event,400,"Bad Request")
        console.log("Bad Request - missing fields")
        return {
            statusCode: 400,
            body: "Bad Request"
        }
    }
    await mongoose.connection.collection('hotel-inventory').insertOne(body)
    await mongoose.connection.db.collection('hotel-logs').insertOne({
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