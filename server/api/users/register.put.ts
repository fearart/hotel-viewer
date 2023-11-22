import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
const config = useRuntimeConfig();

const missingDataReturnMessage = {
    statusCode: 400,
    body: "Not all parameters found"
}

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    if (typeof(body.login) === 'undefined') {
        return missingDataReturnMessage;
    }
    if (typeof(body.password) === 'undefined') {
        return missingDataReturnMessage;
    }
    let token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30),
        data: body.email
        },
        config.jwt_secret
    )
    let user = {
        'token' : token,
        'login' : body.login,
        'password': body.password,
    }
    if (await mongoose.connection.db.collection('hotel-users').find({login: body.login}).count() > 0) {
        return {
            statusCode: 409,
            body: 'User already exists'
        }
    }
    mongoose.connection.db.collection('hotel-users').insertOne(user)
    setCookie(event,'token',token)

    return {
        statusCode: 201,
        body: 'User created'
    }

})
