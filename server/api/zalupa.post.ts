import mongoose from "mongoose";

export default defineEventHandler(async (event) => {
    const backup = await mongoose.connection.db.collection('hotel-floors').find().toArray()
    for (let i = 0; i < backup.length; i++) {
        const result = []
        for (let j=0; j<backup[i].corridor.length; j++) {
            if (backup[i].corridor[j].macAddress !== null && backup[i].corridor[j].accessPointNumber !== null) {
                const corridorObject = {}
                Object.assign(corridorObject, {"macAddress" : backup[i].corridor[j].macAddress})
                Object.assign(corridorObject, {"accessPointNumber" : backup[i].corridor[j].accessPointNumber})
                Object.assign(corridorObject, {"comment" : ""})
                result.push(corridorObject)
            }
        }
        let set_object = { 
            "name" : backup[i].name,
            "floor_number" : backup[i].floor_number,
            "rooms" : backup[i].rooms,
            "corridor" : result
        }
        await mongoose.connection.db.collection('hotel-floors').updateOne({"name" : backup[i].name},{$set : set_object})
    }
});