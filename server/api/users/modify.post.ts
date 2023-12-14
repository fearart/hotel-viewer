import mongoose from "mongoose";
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
    if (body.login === undefined || body.password === undefined || body.name === undefined || 
        body.surname === undefined || body.password === undefined || body.token === undefined ||
        body.permissions === undefined || body.group === undefined)
    {
        setResponseStatus(event,400,"Bad Request") 
    }

    const users = await mongoose.connection.db.collection('hotel-users').find().toArray()
    const user = users.find((user) => user.login === body.login)
    if (user === undefined) {
        setResponseStatus(event,400,"Bad Request")
        return
    }
    // replace old user with new one
    await mongoose.connection.db.collection('hotel-users').replaceOne(user,body)
    await mongoose.connection.db.collection('hotel-logs').insertOne({
        'ID' : await Logger.getID(),
        'timestamp' : Date.now(),
        'type' : 'modify',
        'event' : `User ${user.login} modified`,
        'user' : await new Logger(token).search(),
        'details' : body
    })
})