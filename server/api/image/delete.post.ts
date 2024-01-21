import jwt from 'jsonwebtoken';
import fs from 'fs';
const unauthorizedReturn = (event: any) => {
    setResponseStatus(event,401,"Unauthorized")
}

export default defineEventHandler(async (event) => {
    const cookie = getCookie(event,'token');
    const storage = useStorage('images');
    try {
        jwt.verify(cookie || "",useRuntimeConfig().jwt_secret);
    }
    catch {
        unauthorizedReturn(event);
        return;
    }
    const body = await readBody(event);
    let keys = await storage.getKeys();
    keys = keys.filter((key) => key.startsWith(body.room_number))
    console.log();
    let key = keys[body.imageIndex];
    storage.removeItem(key);
    return `deleted ${key}`
    setResponseStatus(event,200,"OK");
})