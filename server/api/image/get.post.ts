import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
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
    if (body.room_number === undefined) { setResponseStatus(event,400,"Bad Request"); return }
    let keys = await storage.getKeys();
    keys = keys.filter((key) => key.startsWith(body.room_number))
    let simages : Array<string> = [];
    for (let i = 0; i < keys.length; i++) {
        let buffer: Buffer | null = await storage.getItemRaw(keys[i]);
        if (buffer) {
            simages.push(buffer.toString('base64'));
        }
    }
    return simages;
})