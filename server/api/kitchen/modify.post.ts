import mongoose from "mongoose";
import TokenDecoder from "~/utilities/tokendecoder";

export default defineEventHandler(async (event) => {
    let cookie = getCookie(event, "token")
    let decoder = new TokenDecoder(cookie || "")
    if (!decoder.checkValid()) {
        setResponseStatus(event,401,"Unauthorized")
        return
    }
    let user = await decoder.decode()
    if (!user) {
        setResponseStatus(event,401,"Unauthorized")
        return
    }
    const body = await readBody(event)
    if (body.floor_number === undefined || body.name === undefined || body.comment === undefined) {
        setResponseStatus(event,400,"Bad Request")
        return
    }
    const floor_number = Number.parseInt(body.floor_number)
    const floor_object = await mongoose.connection.db.collection('hotel-floors').findOne({floor_number: floor_number})
    if (floor_object === null) {
        setResponseStatus(event,404,"Not Found")
        return
    }
    let kitchens: Array<any> = floor_object.kitchens || []
    let kitchen_object = kitchens.find((kitchen:any) => kitchen.name === body.name)
    if (kitchen_object == null) {
        setResponseStatus(event,404,"Not Found")
        return
    }
    kitchen_object.comment = body.comment
    kitchen_object.name = body.name
    kitchens = kitchens.filter((kitchen:any) => kitchen.name !== body.name)
    kitchens.push(kitchen_object)
    console.log(kitchens)
    await mongoose.connection.db.collection('hotel-floors').updateOne({floor_number: floor_number}, {$set: {kitchens: kitchens}})
})