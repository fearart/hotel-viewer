import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bot from "~/utilities/bot";
import axios from "axios";
const unauthorizedReturn = (event: any) => {
    setResponseStatus(event,401,"Unauthorized")
}

export default defineEventHandler(async (event) => {
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
    if (body.floor_number === undefined || body.room_number === undefined || body.hasPhone === undefined || body.hasTV === undefined || body.hasAccessPoint === undefined || body.hasBathPhone === undefined || body.comment === undefined,body.macAddress === undefined,body.alarm === undefined,body.hasLock === undefined) {
        setResponseStatus(event,400,"Bad Request")
        return
    }
    const floors = await mongoose.connection.db.collection('hotel-floors').find().toArray()
    const floor = floors.find((element: any) => element.floor_number == body.floor_number)
    if (floor === null || floor === undefined) {
        setResponseStatus(event,404,"Not Found")
        return
    }
    const rooms = floor.rooms
    bot.telegram.sendMessage(config.telegram_chat_id,
`Zatwierdzenie zmian w №${body.room_number} | ${Date().toString().slice(0,24)}
  Bylo:
    AP: ${rooms.find((element: any) => element.room_number == body.room_number).hasAccessPoint}
    TV: ${rooms.find((element: any) => element.room_number == body.room_number).hasTV}
    Telefon: ${rooms.find((element: any) => element.room_number == body.room_number).hasPhone}
    Telefon w lazience: ${rooms.find((element: any) => element.room_number == body.room_number).hasBathPhone}
    Komentarz: ${rooms.find((element: any) => element.room_number == body.room_number).comment}
    MAC: ${rooms.find((element: any) => element.room_number == body.room_number).macAddress}
    Alarm: ${rooms.find((element: any) => element.room_number == body.room_number).alarm}
    Lock: ${rooms.find((element: any) => element.room_number == body.room_number).hasLock}


  Jest:
    AP: ${body.hasAccessPoint}
    TV: ${body.hasTV}
    Telefon: ${body.hasPhone}
    Telefon w lazience: ${body.hasBathPhone}
    Komentarz: ${body.comment}
    MAC: ${body.macAddress}
    Alarm: ${body.alarm}
    Lock: ${body.hasLock}
    `,
    {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Tak', callback_data: 'yes' },
              { text: 'Nie', callback_data: 'no' }
            ]
          ]
        }
      }
    )
    bot.action('yes', async (ctx) => {
        ctx.deleteMessage()
        const floor = await mongoose.connection.db.collection('hotel-floors').findOne({floor_number: body.floor_number})
        if (floor === null) {
            setResponseStatus(event,404,"Not Found")
            return
        }
        let rooms = []
        try {
            rooms = floor.rooms
        }
        catch {
            rooms = []
        }
        let room_number = 1
        if (rooms.length == 0) {
            room_number = Number.parseInt(`${body.floor_number}001`)
        }
        else {
            room_number = Number.parseInt(body.room_number)
        }
        let room = {
            'room_number' : room_number,
            'hasAccessPoint' : body.hasAccessPoint,
            'hasTV' : body.hasTV,
            "hasPhone" : body.hasPhone,
            'hasBathPhone' : body.hasBathPhone,
            "comment" : body.comment,
            "macAddress" : body.macAddress,
            "alarm" : body.alarm,
            'hasLock' : body.hasLock
        }

        // delete old room  
        rooms = rooms.filter((room:any) => room.room_number != room_number)
        rooms.push(room)
        let floor_obj = Object.assign(floor, {rooms: rooms})
        console.log(floor_obj)
        //mongoose.connection.db.collection('hotel-floors').replaceOne({floor_number: body.floor_number},floor_obj,{upsert: true})
        ctx.reply(`Zmiany w №${body.room_number} zostaly zatwierdzone`)
    })
    bot.action('no', async (ctx) => {
        ctx.deleteMessage()
        ctx.reply(`Zmiany w №${body.room_number} zostaly odrzucone`)
    })
})