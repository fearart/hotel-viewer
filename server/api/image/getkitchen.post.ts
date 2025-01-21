import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import TokenDecoder from '~/utilities/tokendecoder';
const unauthorizedReturn = (event: any) => {
    setResponseStatus(event,401,"Unauthorized")
}

export default defineEventHandler(async (event) => {
    const cookie = getCookie(event,'token');
    const storage = useStorage('images');
    const decoder = new TokenDecoder(cookie || "");
    const user = await decoder.decode();
    if (!user) {
        unauthorizedReturn(event);
        return;
    }
    const body = await readBody(event);
    if (body.floor_number === undefined || body.kitchen_name === undefined) { setResponseStatus(event,400,"Bad Request"); return }
    let keys = await storage.getKeys();
    keys = keys.filter((key) => key.startsWith(`${body.floor_number}_${body.kitchen_name}`))
    console.log(keys)
    let simages : Array<string> = [];
    for (let i = 0; i < keys.length; i++) {
        let buffer: Buffer | null = await storage.getItemRaw(keys[i]);
        if (buffer) {
            simages.push(buffer.toString('base64'));
        }
    }
    return simages;
})