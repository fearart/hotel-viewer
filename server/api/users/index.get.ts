import mongoose from 'mongoose';
const unauthorizedReturn = (event: any) => {
    setResponseStatus(event,401,"Unauthorized")
}
import jwt from 'jsonwebtoken';
import Logger from '~/utilities/logger';
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
    const users = await mongoose.connection.db.collection('hotel-users').find({}).toArray()

    return users
})