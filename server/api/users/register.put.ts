import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Permissions from '~/utilities/permsisions';
import Logger from "~/utilities/logger";
const config = useRuntimeConfig();

const missingDataReturnMessage = {
    statusCode: 400,
    body: "Not all parameters found"
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    await mongoose.connect(config.mongodb_uri);
    const body = await readBody(event)
    if (body.password === undefined || body.login === undefined || body.name === undefined || body.surname === undefined) {
        return missingDataReturnMessage;
    }
    if (body.permissions === undefined) {
        body.permissions = {
            root: false,
            admin: false
        }
    }
    if (body.group === undefined) {
        body.group = {
            it: false,
            cleaning: false,
            hydro: false,
            elec: false
        }
    }
    let token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30),
        data: body.email
        },
        config.jwt_secret
    )
    if (await mongoose.connection.db.collection('hotel-users').countDocuments({login: body.login}) > 0) {
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
                'permissions' : body.permissions,
                'group' : body.group,
                'name' : body.name,
                'surname' : body.surname
            }
            mongoose.connection.db.collection('hotel-users').insertOne(user)
            setCookie(event,'token',token,{maxAge: 30* 24 * 60 * 60 * 1000 })
            return {
                statusCode: 201,
                body: 'User created'
            }
        })
    })
})