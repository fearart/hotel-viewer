import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const unauthorizedReturn = (event: any) => {
    setResponseStatus(event,401,"Unauthorized")
}
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
    if (body.login === undefined || body.password === undefined) {
        setResponseStatus(event,400,"Bad Request")
        return
    }
    const user = await mongoose.connection.db.collection('hotel-users').findOne({login: body.login})
    if (user === null) {
        setResponseStatus(event,400,"Bad Request")
        return
    }
    let password = body.password
    const saltRounds = 10 // HIGHER = MORE SECURE BUT SLOWER
    bcrypt.genSalt(saltRounds,function(err: any,salt: string) {
        bcrypt.hash(body.password,salt,function(err: any,hash: string) {
            mongoose.connection.db.collection('hotel-users').updateOne({login: body.login},{$set: {password: hash}})
        })
    })
})