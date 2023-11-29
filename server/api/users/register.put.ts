import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Permissions from '~/utilities/permsisions';
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
    if (await mongoose.connection.db.collection('hotel-users').find({login: body.login}).count() > 0) {
        return {
            statusCode: 409,
            body: 'User already exists'
        }
    }
    const saltRounds = 10 // HIGHER = MORE SECURE BUT SLOWER
    bcrypt.genSalt(saltRounds,function(err: any,salt: string) {
        bcrypt.hash(body.password,salt,function(err: any,hash: string) {
            let user = {
                'token' : token,
                'login' : body.login,
                'password': hash,
                'permissions' : new Permissions()
            }
            mongoose.connection.db.collection('hotel-users').insertOne(user)
            setCookie(event,'token',token)
            return {
                statusCode: 201,
                body: 'User created'
            }
        })
    })
})