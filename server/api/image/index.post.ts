import process from "process";
import TokenDecoder from "~/utilities/tokendecoder";
import fs from 'fs';
import sharp from 'sharp';
const config = useRuntimeConfig();
const unauthorizedReturn = (event: any) => {
    setResponseStatus(event,401,"Unauthorized")
}


export default defineEventHandler(async (event) => {
    const data = await readMultipartFormData(event) || [];
    const file = data[0];
    const room_number = data[1].data.toString();
    const token = data[2].data.toString();
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
    await sharp(file.data)
        .jpeg({ quality: 60 })
        .toBuffer().then((data) => {
            fs.writeFile(`${process.cwd()}/public/images/${fileName}`,data,(err) => {
                if (err) {
                    console.log(err);
                    setResponseStatus(event,500,"Internal Server Error");
                    return;
                }
                setResponseStatus(event,200,"OK");
            })
        })
})