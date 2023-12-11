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
    if (typeof(body.login) === 'undefined') { return missingDataReturnMessage}
    if (typeof(body.password) === 'undefined') {return missingDataReturnMessage}
    const user = await mongoose.connection.db.collection('hotel-users').findOne({"login" : body.login})
    if (user === null) {
        setResponseStatus(event,401,"Wrong password or email")
        return
    }

    const result: boolean = await bcrypt.compare(body.password,user.password)
    if (result === false) {
        setResponseStatus(event,401,"Wrong password or email")
        return
    }
    console.log(new Permissions(user.permissions).canRead())
    setResponseStatus(event,202,"OK")
    setCookie(event,'token',user.token)
})