import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
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
    const floors = await mongoose.connection.db.collection('hotel-floors').find({}).toArray()
    floors.forEach(async (floor) => {
        floor.rooms.forEach((room:any) => {
            room.hasBroom = 'unknown'
            room.hasSink = 'unknown'
            room.hasToilet = 'unknown'
            room.hasRadiator = 'unknown'
            room.hasBidet = 'unknown'
            room.hasShower = 'unknown'
            room.hasSocket = 'unknown'
            room.hasBulb = 'unknown'
        })
        await mongoose.connection.db.collection('hotel-floors').updateOne({_id: floor._id},{$set: {rooms: floor.rooms}})
    })

})