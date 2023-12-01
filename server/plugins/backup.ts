import { Nitro } from "nitropack";
import mongoose from "mongoose";
import fs from 'fs';
export default async (_nitroApp: Nitro) => {
    const buffer = new Date(fs.readFileSync('backup-date.txt','utf-8').toString()) 
    const config = useRuntimeConfig();
    const date = new Date()
    // compare if day is different from last backup
    if (date.getDay() === buffer.getDay()) {
        console.log("Backup already done today at "+ new Date(buffer).getHours() + ":" + new Date(buffer).getMinutes())
    }
    else {
        try {
            await mongoose.connect(config.mongodb_uri);
            const main = await mongoose.connection.collection('hotel-floors').find().toArray()
            main.forEach((item) => {
                delete item._id 
            })
            await mongoose.connection.db.collection('hotel-floors-backup').deleteMany({})
            await mongoose.connection.collection('hotel-floors-backup').insertMany(main)
            fs.writeFileSync('backup-date.txt',date.toString())
            console.log("Backup successful")
        } catch (e) {
            console.error(e);
        }
    }
};