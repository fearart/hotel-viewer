import mongoose from 'mongoose';

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    if (typeof(body.token) === 'undefined') {
        setResponseStatus(event,400,"Bad Request")
    }
    try {
        const user = await mongoose.connection.db.collection('hotel-users').findOne({token: body.token})
        if (user === null) return {}
        return user.permissions
    }
    catch {
        return {}
    }
})