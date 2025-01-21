import jwt from 'jsonwebtoken';
const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    if (typeof(body.token) === 'undefined') return false;
    try {
        jwt.verify(body.token,config.jwt_secret)
        return true
    }
    catch {
        return false
    }
})