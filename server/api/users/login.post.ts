import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Permissions from "~/utilities/permsisions";
const config = useRuntimeConfig();

const missingDataReturnMessage = {
    statusCode: 400,
    body: "Not all parameters found"
}


export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const config = useRuntimeConfig()
    if (typeof(body.login) === 'undefined') { return missingDataReturnMessage}
    if (typeof(body.password) === 'undefined') {return missingDataReturnMessage}
    const user = await mongoose.connection.db.collection('hotel-users').findOne({"login" : body.login})
    if (user === null) {
        setResponseStatus(event,203,"Wrong password or email")
        return
    }
    const result: boolean = await bcrypt.compare(body.password,user.password)
    if (result === false) {
        setResponseStatus(event,203,"Wrong password or email")
        return
    }
    try {
        let token = jwt.verify(user.token,config.jwt_secret)
    }
    catch (e) {
        let newToken = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30),
            data: body.email
            },
            config.jwt_secret
        )
        user.token = newToken
        await mongoose.connection.db.collection('hotel-users').updateOne({"login" : body.login},{$set:{"token":newToken}})
    }
    
    setResponseStatus(event,202,"OK")
    setCookie(event,'token',user.token)
})