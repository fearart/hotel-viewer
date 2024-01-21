import process from "process";
import TokenDecoder from "~/utilities/tokendecoder";
import sharp from 'sharp';
const unauthorizedReturn = (event: any) => {
    setResponseStatus(event,401,"Unauthorized")
}


export default defineEventHandler(async (event) => {
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
    await sharp(file.data)
        .webp({ quality: 60 })
        .toBuffer().then((data : any) => {
            // ^ deprecated
            storage.setItemRaw(fileName,data);
        })
})
