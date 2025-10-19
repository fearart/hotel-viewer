import mongoose from 'mongoose';
const unauthorizedReturn = (event: any) => {
    setResponseStatus(event,401,"Unauthorized")
}
import jwt from 'jsonwebtoken';
const config = useRuntimeConfig();
export default defineEventHandler(async (event) => {
    let token = getCookie(event,'token' )
    console.log("Fetching inventory, token:",token)
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
    const inventory = mongoose.connection.collection('hotel-inventory').find({}).toArray()
    setResponseStatus(event,200,"OK")
    return inventory
})