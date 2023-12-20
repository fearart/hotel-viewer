import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bot from "~/utilities/bot";
import axios from "axios";
const store = new Map()
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
    if (body.room_number === undefined || body.floor_number === undefined || body.hasAccessPoint === undefined || body.hasTV === undefined ||
        body.hasPhone === undefined || body.hasBathPhone === undefined || body.macAddress === undefined || body.alarm === undefined ||
        body.hasLock === undefined || body.hasBroom === undefined || body.hasBed === undefined || body.hasSink === undefined || body.hasToilet === undefined ||
        body.hasRadiator === undefined || body.hasShower === undefined || body.hasBidet === undefined || body.hasSocket === undefined ||
        body.hasBulb === undefined || body.Ecomment === undefined || body.Kcomment === undefined ||
        body.Icomment === undefined || body.Pcomment === undefined || body.Acomment === undefined) {
        setResponseStatus(event,400,"Bad Request")
        }
    const user = await mongoose.connection.db.collection('hotel-users').findOne({token: token})
    if (user === null) {
        setResponseStatus(event,401,"Unauthorized")
        return
    }
    const floors = await mongoose.connection.db.collection('hotel-floors').find({}).toArray()
    const floor = floors.find((floor) => floor.floor_number == body.floor_number)
    if (floor === null || floor === undefined) {
        setResponseStatus(event,404,"Not Found")
        return
    }
    const room = floor.rooms.find((room: any) => room.room_number == body.room_number)
    let tgMessage = `------------${body.room_number}------------\n`
    if (room.hasAccessPoint !== body.hasAccessPoint) {
        tgMessage += `AP: ${room.hasAccessPoint} --> ${body.hasAccessPoint}\n`
    }
    if (room.hasTV !== body.hasTV) {
        tgMessage += `TV: ${room.hasTV} --> ${body.hasTV}\n`
    }
    if (room.hasPhone !== body.hasPhone) {
        tgMessage += `Telefon: ${room.hasPhone} --> ${body.hasPhone}\n`
    }
    if (room.hasBathPhone !== body.hasBathPhone) {
        tgMessage += `Telefon mały: ${room.hasBathPhone} --> ${body.hasBathPhone}\n`
    }
    if (room.hasLock !== body.hasLock) {
        tgMessage += `Zamek: ${room.hasLock} --> ${body.hasLock}\n`
    }
    if (room.Icomment !== body.Icomment) {
        tgMessage += `Kommentarz: ${room.Icomment} --> ${body.Icomment}\n`
    }
    if (room.macAddress !== body.macAddress) {
        tgMessage += `MAC: ${room.macAddress} --> ${body.macAddress}\n`
    }
    if (tgMessage !== `------------${body.room_number}------------\n`) {
        const user = await mongoose.connection.db.collection('hotel-users').findOne({token: token})
        if (user === null) {
            setResponseStatus(event,401,"Unauthorized")
            return
        }
        let group = "" 
        if (user.group.it) {
            group += "Informatyk "
        }
        if (user.group.pokojowki) {
            group += "Pokojówka "
        }
        if (user.group.elektrycy) {
            group += "Elektryk "
        }
        if (user.group.konserwatorzy) {
            group += "Konserwator "
        }
        tgMessage += `${group} (${user.name}\t ${user.surname}) \n`
        bot.telegram.sendMessage("-1002137267212",tgMessage,{reply_to_message_id: 3})
        tgMessage = `------------${body.room_number}------------\n`
    }
    if (room.hasSink !== body.hasSink) {
        tgMessage += `Zlew: ${room.hasSink} --> ${body.hasSink}\n`
    }
    if (room.hasToilet !== body.hasToilet) {
        tgMessage += `Toaleta: ${room.hasToilet} --> ${body.hasToilet}\n`
    }
    if (room.hasRadiator !== body.hasRadiator) {
        tgMessage += `Grzejnik: ${room.hasRadiator} --> ${body.hasRadiator}\n`
    }
    if (room.hasShower !== body.hasShower) {
        tgMessage += `Prysznic: ${room.hasShower} --> ${body.hasShower}\n`
    }
    if (room.hasBidet !== body.hasBidet) {
        tgMessage += `Bidet: ${room.hasBidet} --> ${body.hasBidet}\n`
    }
    if (room.Kcomment !== body.Kcomment) {
        tgMessage += `Kommentarz: ${room.Kcomment} --> ${body.Kcomment}\n`
    }
    if (tgMessage !== `------------${body.room_number}------------\n`) {
        const user = await mongoose.connection.db.collection('hotel-users').findOne({token: token})
        if (user === null) {
            setResponseStatus(event,401,"Unauthorized")
            return
        }
        let group = "" 
        if (user.group.it) {
            group += "Informatyk "
        }
        if (user.group.pokojowki) {
            group += "Pokojówka "
        }
        if (user.group.elektrycy) {
            group += "Elektryk "
        }
        if (user.group.konserwatorzy) {
            group += "Konserwator "
        }
        tgMessage += `${group} (${user.name}\t ${user.surname}) \n`
        bot.telegram.sendMessage("-1002137267212",tgMessage,{reply_to_message_id: 7})
        tgMessage = `------------${body.room_number}------------\n`
    }
    if (room.hasSocket !== body.hasSocket) {
        tgMessage += `Gniazdko: ${room.hasSocket} --> ${body.hasSocket}\n`
    }
    if (room.hasBulb !== body.hasBulb) {
        tgMessage += `Żarówka: ${room.hasBulb} --> ${body.hasBulb}\n`
    }
    if (room.Ecomment !== body.Ecomment) {
        tgMessage += `Kommentarz: ${room.Ecomment} --> ${body.Ecomment}\n`
    }
    if (tgMessage !== `------------${body.room_number}------------\n`) {
        const user = await mongoose.connection.db.collection('hotel-users').findOne({token: token})
        if (user === null) {
            setResponseStatus(event,401,"Unauthorized")
            return
        }
        let group = "" 
        if (user.group.it) {
            group += "Informatyk "
        }
        if (user.group.pokojowki) {
            group += "Pokojówka "
        }
        if (user.group.elektrycy) {
            group += "Elektryk "
        }
        if (user.group.hydraulicy) {
            group += "Konserwator "
        }
        tgMessage += `${group} (${user.name}\t ${user.surname}) \n`
        bot.telegram.sendMessage("-1002137267212",tgMessage,{reply_to_message_id: 9})
        tgMessage = `------------${body.room_number}------------\n`
    }
    if (room.hasBroom !== body.hasBroom) {
        tgMessage += `Sprzątanie: ${room.hasBroom} --> ${body.hasBroom}\n`
    }
    if (room.hasBed !== body.hasBed) {
        tgMessage += `Łóżko: ${room.hasBed} --> ${body.hasBed}\n`
    }
    if (room.Pcomment !== body.Pcomment) {
        tgMessage += `Kommentarz: ${room.Pcomment} --> ${body.Pcomment}\n`
    }
    if (tgMessage !== `------------${body.room_number}------------\n`) {
        const user = await mongoose.connection.db.collection('hotel-users').findOne({token: token})
        if (user === null) {
            setResponseStatus(event,401,"Unauthorized")
            return
        }
        let group = "" 
        if (user.group.it) {
            group += "Informatyk "
        }
        if (user.group.pokojowki) {
            group += "Pokojówka "
        }
        if (user.group.elektrycy) {
            group += "Elektryk "
        }
        if (user.group.konserwatorzy) {
            group += "Konserwator "
        }
        tgMessage += `${group} (${user.name}\t ${user.surname}) \n`
        bot.telegram.sendMessage("-1002137267212",tgMessage,{reply_to_message_id: 5})
        tgMessage = `------------${body.room_number}------------\n`
    }
})
