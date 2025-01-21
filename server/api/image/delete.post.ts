import jwt from 'jsonwebtoken';
import fs from 'fs';
import TokenDecoder from '~/utilities/tokendecoder';
const unauthorizedReturn = (event: any) => {
    setResponseStatus(event,401,"Unauthorized")
}

export default defineEventHandler(async (event) => {
    const cookie = getCookie(event,'token');
    const storage = useStorage('images');
    const type = event.headers.get('type') || "";
    if (type === "") {
        setResponseStatus(event,400,"Bad Request");
        return;
    }
    const decoder = new TokenDecoder(cookie || "");
    const user = await decoder.decode();
    if (!user) {
        unauthorizedReturn(event);
        return;
    }
    const body = await readBody(event);
    let keys = await storage.getKeys();
    if (type === "room") {
        keys = keys.filter((key) => key.startsWith(body.room_number))
    }
    if (type === "kitchen") {
        keys = keys.filter((key) => key.startsWith(`${body.floor_number}_${body.kitchen_name}`))
    }
    let key = keys[body.imageIndex];
    storage.removeItem(key);
    return `deleted ${key}`
})