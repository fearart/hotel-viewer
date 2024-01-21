import jwt from 'jsonwebtoken';
import fs from 'fs';
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
    if (body.image === undefined) { setResponseStatus(event,400,"Bad Request"); return }

    fs.unlinkSync(process.cwd() + '/public' + body.image);
    setResponseStatus(event,200,"OK");
})