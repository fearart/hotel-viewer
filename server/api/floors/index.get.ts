import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
const config = useRuntimeConfig();
const unauthorizedReturn = (event: any) => {
    setResponseStatus(event,401,"Unauthorized")
}


export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    await mongoose.connect(config.mongodb_uri);
    let floors = await mongoose.connection.db.collection('hotel-floors').find().toArray()
    return {
        statusCode: 200,
        body: floors
    }
})