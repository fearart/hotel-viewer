import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
const config = useRuntimeConfig();

const missingDataReturnMessage = {
    statusCode: 400,
    body: "Not all parameters found"
}


export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    if (typeof(body.login) === 'undefined') { return missingDataReturnMessage}
    if (typeof(body.password) === 'undefined') {return missingDataReturnMessage}
    let user = await mongoose.connection.db.collection('hotel-users').findOne({"login" : body.login, "password": body.password})
    if (user === null) {
        return {
            statusCode: 401,
            body: "Wrong password or email"
        }
    }
    else {
        let id = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30),
            data: body.email
            },
            config.jwt_secret
        )
        setCookie(event,'token',id)
        setResponseStatus(event,202,"OK")
    }
})