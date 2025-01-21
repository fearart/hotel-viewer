import mongoose, { set } from "mongoose";
import jwt from 'jsonwebtoken';
import Logger from "~/utilities/logger";
const config = useRuntimeConfig();

const unauthorizedReturn = (event: any) => {
    setResponseStatus(event,401,"Unauthorized")
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    await mongoose.connect(config.mongodb_uri);
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
    if (body.login === undefined) {
        setResponseStatus(event,400,"Bad Request")
    }
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
    const target = await mongoose.connection.db.collection('hotel-users').findOne({login: body.login})
    if (target === null) {
        setResponseStatus(event,404,"Not Found")
        return
    }
    await mongoose.connection.db.collection('hotel-users').deleteOne({login: body.login})
    await mongoose.connection.db.collection('hotel-logs').insertOne({
        "ID" : await Logger.getID(),
        'type': 'delete',
        'event': `User ${body.login} was deleted`,
        'user' : await new Logger(body.auth).search(),
        'timestamp': Date.now(),
        'details': body.login
    })
    setResponseStatus(event,200,"OK")
})