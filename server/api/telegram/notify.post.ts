import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bot from "~/utilities/bot";
const store = new Map()
const unauthorizedReturn = (event: any) => {
    setResponseStatus(event,401,"Unauthorized")
}

export default defineEventHandler(async (event) => {
    return
    const config = useRuntimeConfig();
    await mongoose.connect(config.mongodb_uri);
    let token = getCookie(event,'token')
    if (!token) {
        unauthorizedReturn(event)
        return
    }
    try {
        jwt.verify(token,config.jwt_secret)
    }
    catch {
        unauthorizedReturn(event)
        return
    }
    const body = await readBody(event)
    store.set(token.substring((token.length / 2)+24,token.length),body)
    if (body.floor_number === undefined || body.room_number === undefined || body.hasPhone === undefined || body.hasTV === undefined || body.hasAccessPoint === undefined || body.hasBathPhone === undefined || body.comment === undefined,body.macAddress === undefined,body.alarm === undefined,body.hasLock === undefined) {
        setResponseStatus(event,400,"Bad Request")
        return
    }
    bot.telegram.sendMessage(config.telegram_chat_id_dev,
`\\-\\-\\-\\-\\-\\-\\-**№${body.room_number}**\\-\\-\\-\\-\\-\\-\\-
${Date().toString().slice(0,24)}
Komentarz: ${body.comment}
`,
    {
        parse_mode: 'MarkdownV2',
      }
)
})
