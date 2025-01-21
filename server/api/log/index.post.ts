import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
const config = useRuntimeConfig();

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
    if (body.auth === undefined) {
        setResponseStatus(event,400,"Bad Request")
    }
    const user = await mongoose.connection.db.collection('hotel-users').findOne({token: body.auth})
    if (user === null) {
        unauthorizedReturn(event)
        return
    }
    if (user.permissions.root === false) {
        unauthorizedReturn(event)
        return
    }
    return mongoose.connection.db.collection('hotel-logs').find({}).toArray()
})

const unauthorizedReturn = (event: any) => {
    setResponseStatus(event,401,"Unauthorized")
}