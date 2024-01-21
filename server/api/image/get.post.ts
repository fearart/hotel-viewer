import jwt from 'jsonwebtoken';
import { useCookie } from "nuxt/app";
import fs from 'fs';
import path from 'path';
const unauthorizedReturn = (event: any) => {
    setResponseStatus(event,401,"Unauthorized")
}

export default defineEventHandler(async (event) => {
    const cookie = getCookie(event,'token');
    try {
        jwt.verify(cookie || "",useRuntimeConfig().jwt_secret);
    }
    catch {
        unauthorizedReturn(event);
        return;
    }
    const body = await readBody(event);
    if (body.room_number === undefined) { setResponseStatus(event,400,"Bad Request"); return }

    let files = fs.readdirSync(process.cwd() + '/public/images');
    let images = files.filter((file) => {
        return file.startsWith(body.room_number)
    })
    for (let i = 0; i < images.length; i++) {
        images[i] = path.join('/images',images[i]);
    }
    return images;
})