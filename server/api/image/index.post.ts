import TokenDecoder from "~/utilities/tokendecoder";
import Logger from "~/utilities/logger";
import mongoose from "mongoose";
import sharp from 'sharp';
const unauthorizedReturn = (event: any) => {
    setResponseStatus(event,401,"Unauthorized")
}


export default defineEventHandler(async (event) => {
    const type = event.headers.get('type') || "";
    if (type === "") {
        setResponseStatus(event,400,"Bad Request");
        return;
    }
    if (type === "room") {
        const data = await readMultipartFormData(event) || [];
        const file = data[0];
        const room_number = data[1].data.toString();
        const token = data[2].data.toString();
        const storage = useStorage('images');
        if (!file.type?.startsWith('image')) {
            setResponseStatus(event,400,"Bad Request");
            return;
        }
        const decoder = new TokenDecoder(token);
        const user = await decoder.decode();
        if (!user) {
            unauthorizedReturn(event);
            return;
        }
        const fileName = `${room_number}_${Date.now()}_${user.login}.${file.type.split('/')[1]}`;
        mongoose.connection.db.collection('hotel-logs').insertOne({
            "event" : `Image was added.`,
            "type" : "image",
            "timestamp" : Date.now(),
            "user" : user.login,
            "details" : `Image was added to room ${room_number}. Image: ${fileName}`,
            'ID' : await Logger .getID()
            
        })
        await sharp(file.data)
            .webp({ quality: 60 })
            .toBuffer().then((data : any) => {
                // ^ deprecated
                storage.setItemRaw(fileName,data);
            })
    }
    if (type === "kitchen") {
        const data = await readMultipartFormData(event) || [];
        const file = data[0];
        const kitchen_name = data[1].data.toString();
        const token = data[2].data.toString();
        const floor_number = data[3].data.toString();
        const storage = useStorage('images');
        if (!file.type?.startsWith('image')) {
            setResponseStatus(event,400,"Bad Request");
            return;
        }
        const decoder = new TokenDecoder(token);
        const user = await decoder.decode();
        if (!user) {
            unauthorizedReturn(event);
            return;
        }
        const fileName = `${floor_number}_${kitchen_name}_${Date.now()}_${user.login}.${file.type.split('/')[1]}`;
        mongoose.connection.db.collection('hotel-logs').insertOne({
            "event" : `Image was added.`,
            "type" : "image",
            "timestamp" : Date.now(),
            "user" : user.login,
            "details" : `Image was added to kitchen ${kitchen_name}. Image: ${fileName}`,
            'ID' : await Logger.getID()
            
        })
        await sharp(file.data)
            .webp({ quality: 60 })
            .toBuffer().then((data : any) => {
                // ^ deprecated
                storage.setItemRaw(fileName,data);
            })
    }
})
