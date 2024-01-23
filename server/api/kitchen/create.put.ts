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
    if (!user.permissions.admin) {
        setResponseStatus(event,401,"Unauthorized")
        return
    }
    const body = await readBody(event)
    if (body.floor_number === undefined || body.kitchen_name === undefined) {
        setResponseStatus(event,400,"Bad Request")
        return
    }
    let floor_object = await mongoose.connection.db.collection('hotel-floors').findOne({floor_number: body.floor_number})
    if (!floor_object) {
        setResponseStatus(event,404,"Not Found")
        return
    }
    if (!floor_object.kitchens) {
        floor_object.kitchens = []
    }

    let kitchen_object = {
        name: body.kitchen_name,
        id: floor_object.kitchens.length + 1,
        comment: "",
    }
    console.log(kitchen_object)
    floor_object.kitchens.push(kitchen_object)
    console.log(floor_object)
    await mongoose.connection.db.collection('hotel-floors').updateOne({floor_number: body.floor_number}, {$set: {kitchens: floor_object.kitchens}})
    setResponseStatus(event,200,"OK")
    return
})