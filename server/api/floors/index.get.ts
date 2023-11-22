import mongoose from "mongoose";

export default defineEventHandler(async (event) => {
   
    let floors = await mongoose.connection.db.collection('hotel-floors').find().toArray()
    return {
        statusCode: 200,
        body: floors
    }
})