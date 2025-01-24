import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bot from "~/utilities/bot";
import Logger from "~/utilities/logger";
import { User } from "~/types/user";
import { Room } from "~/types/room";
import Floor from "~/model/floor";
const unauthorizedReturn = (event: any) => {
    setResponseStatus(event,401,"Unauthorized")
}

function prettifyText (text: string) : string {
    if( text == undefined) {
        return "⬛"
    }
    text = text.replaceAll('Yes','🟩')
    text = text.replaceAll('No','🟥')
    text = text.replaceAll('unknown','🟨')
    return text
}

const getPosition = (user: User) => {
    if (user.group.it) {
        return "Informatyk"
    }
    if (user.group.elektrycy) {
        return "Elektryk"
    }
    if (user.group.konserwatorzy) {
        return "Konserwator"
    }
    if (user.group.pokojowki) {
        return "Pokojówka"
    }

}


const getChatID = (request: "E" | "K" | "I" | "P" | "A") => {
    switch (request) {
        case "E":
            return "-1002137267212"
        case "K":
            return "-1002137267212"
        case "I":
            return "-1002137267212"
        case "P":
            return "-1002137267212"
        default:
            return "-4743981768"
    }
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
    const body = await readBody(event) as Room;
    // @ts-ignore
    const user = await mongoose.connection.db.collection('hotel-users').findOne({token: token}) as User;
    if (user === null) {
        setResponseStatus(event,401,"Unauthorized")
        return
    }
    const floors = await mongoose.connection.db.collection('hotel-floors').find({}).toArray()
    const floor = floors.find((floor) => floor.floor_number == body.floorNumber)
    if (floor === null || floor === undefined) {
        setResponseStatus(event,404,"Not Found")
        return
    }
    // @ts-ignore
    const room = floor.rooms.find((room) => room.roomNumber == body.roomNumber) as Room;
    let tgMessage = `--------${body.roomNumber}--------\n`
    // TODO: REFACTOR THIS #region REFACTOR

    // ELEKTRYCY
    const eFields = [
        { key: "hasSocket", label: "Gniazdka" },
        { key: "hasBulb", label: "Żarówki" },
        { key: "hasFreezer", label: "Lodówka" },
        { key: "hasDryer", label: "Suszarka" },
        { key: "hasMirror", label: "Lusterko" },
        { key: "hasAC", label: "Klimatyzacja" },
        { key: "Ecomment", label: "Komentarz" }, // No prettifyText applied for comments
    ]
    eFields.forEach(({ key, label }) => {
        let roomValue = room.elektrycy[key];
        let bodyValue = body.elektrycy[key];
    
        // Handle prettifyText logic dynamically
        const displayRoomValue = (key === "Ecomment") ? roomValue : prettifyText(roomValue);
        const displayBodyValue = (key === "Ecomment") ? bodyValue : prettifyText(bodyValue);
    
        if (roomValue != bodyValue) {
            tgMessage += `${label}: ${displayRoomValue} --> ${displayBodyValue}\n`;
        }
    });
    if (tgMessage !== `--------${body.roomNumber}--------\n`) {
        tgMessage += `${getPosition(user)} | (${user.surname} ${user.name})\n`
        tgMessage += "------------------------\n";
        bot.telegram.sendMessage(getChatID("E"), tgMessage);
    }
    tgMessage = `--------${body.roomNumber}--------\n`


    // KONSERWATORZY
    const kFields = [
        { key: "hasShower", label: "Prysznic" },
        { key: "hasToilet", label: "Toaleta" },
        { key: "hasRadiator", label: "Grzejnik" },
        { key: "hasBidet", label: "Bidet" },
        { key: "hasSink", label: "Zmywarka" },
        { key: "hasDoor", label: "Drzwi" },
        { key: "hasDrain", label: "Kratka Balkon" },
        { key: "hasWallpaper", label: "Tapety" },
        { key: "hasTiles", label: "Płytki + Kamień" },
        { key: "hasSilicone", label: "Silikony" },
        { key: "hasCeiling", label: "Sufit" },
        { key: "hasVent", label: "Kratka Wentylacyjna" },
        { key: "hasRevisionDoor", label: "Drzwiczki Rewizyjne" },
        { key: "hasToiletDoor", label: "Drzwi do Toalety" },
        { key: "hasWindow", label: "Szyby" },
        { key: "hasCeilingPainting", label: "Malowanie Sufitu" },
        { key: "hasKey", label: "Klucz" },
        { key: "Kcomment", label: "Komentarz" }, // No prettifyText applied for comments
    ]
    kFields.forEach(({ key, label }) => {
        let roomValue = room.konserwatorzy[key];
        let bodyValue = body.konserwatorzy[key];
        if (key === 'hasKey' && roomValue === undefined) {
            roomValue = 'unknown';
        }
        // Handle prettifyText logic dynamically
        const displayRoomValue = (key === "Kcomment") ? roomValue : prettifyText(roomValue);
        const displayBodyValue = (key === "Kcomment") ? bodyValue : prettifyText(bodyValue);
    
        if (roomValue != bodyValue) {
            tgMessage += `${label}: ${displayRoomValue} --> ${displayBodyValue}\n`;
        }
    });
    if (tgMessage !== `--------${body.roomNumber}--------\n`) {
        tgMessage += `${getPosition(user)} | (${user.surname} ${user.name})\n`
        tgMessage += "------------------------\n";
        bot.telegram.sendMessage(getChatID("K"), tgMessage);
    }
    tgMessage = `--------${body.roomNumber}--------\n`

    // INFORMATYCY
    const fields = [
        { key: "hasAccessPoint", label: "Access Point" },
        { key: "hasBathPhone", label: "Laz. Telefon" },
        { key: "hasPhone", label: "Telefon" },
        { key: "hasTV", label: "TV" },
        { key: "Icomment", label: "Kommentarz" }, // No prettifyText applied for comments
        { key: "hasLock", label: "Zamek" },
        { key: "macAddress", label: "MAC Address" }, // No prettifyText applied for MAC
    ];
    
    fields.forEach(({ key, label }) => {
        const roomValue = room.informatycy[key];
        const bodyValue = body.informatycy[key];
    
        // Handle prettifyText logic dynamically
        const displayRoomValue = (key === "Icomment" || key === "macAddress") ? roomValue : prettifyText(roomValue);
        const displayBodyValue = (key === "Icomment" || key === "macAddress") ? bodyValue : prettifyText(bodyValue);
    
        if (roomValue != bodyValue) {
            tgMessage += `${label}: ${displayRoomValue} --> ${displayBodyValue}\n`;
        }
    });
    if (tgMessage !== `--------${body.roomNumber}--------\n`) {
        tgMessage += `${getPosition(user)} | (${user.surname} ${user.name})\n`
        tgMessage += "------------------------\n";
        bot.telegram.sendMessage(getChatID("I"), tgMessage);
    }
    tgMessage = `--------${body.roomNumber}--------\n`

    // POKOJOWE
    const pFields = [
        { key: "hasCarpet", label: "Wykładzina" },
        { key: "hasBed", label: "Meble" },
        { key: "hasCurtains", label: "Firany" },
        { key: "hasPainting", label: "Obrazy" },
        { key: "hasSafe", label: "Sejf" },
        { key: "hasBroom", label: "Szczotka" },
        { key: "hasKettle", label: "Czajnik" },
        { key: "Pcomment", label: "Komentarz" }, // No prettifyText applied for comments
    ]
    pFields.forEach(({ key, label }) => {
        const roomValue = room.pokojowe[key];
        const bodyValue = body.pokojowe[key];
    
        // Handle prettifyText logic dynamically
        const displayRoomValue = (key === "Pcomment") ? roomValue : prettifyText(roomValue);
        const displayBodyValue = (key === "Pcomment") ? bodyValue : prettifyText(bodyValue);
    
        if (roomValue != bodyValue) {
            tgMessage += `${label}: ${displayRoomValue} --> ${displayBodyValue}\n`;
        }
    });
    if (tgMessage !== `--------${body.roomNumber}--------\n`) {
        tgMessage += `${getPosition(user)} | (${user.surname} ${user.name})\n`
        tgMessage += "------------------------\n";
        bot.telegram.sendMessage(getChatID("P"), tgMessage);
    }
    tgMessage = `--------${body.roomNumber}--------\n`

    sendBody(body,token)
})

const sendBody = async (data : Room,token: string) => {
    let roomNumber = Number.parseInt(data.roomNumber)
    let floorNumber = Number.parseInt(data.floorNumber)
    const floor = await Floor.findOne({floor_number: floorNumber})
    if (!floor) {
        return
    }
    // @ts-ignore
    const roomRecord = floor.rooms.find(
        (item) => item.roomNumber === roomNumber
    ) as Room;
    const newRoomRecord = {
        ...roomRecord,
        ...data
    } as Room;
    // remove old room record
    floor.rooms.remove(roomRecord)
    // add new room record
    floor.rooms.push(newRoomRecord)
    await Floor.updateOne({floor_number: floorNumber}, {$set: {rooms: floor.rooms}})
    mongoose.connection.db.collection('hotel-logs').insertOne({
        "ID" : await Logger.getID(),
        "type" : "modify",
        "event" : `Room #${roomNumber} was modified`,
        "user" : await Logger.search(token),
        "timestamp" : Date.now(),
        "details" : data
    })
    return {
        statusCode: 200,
        body: "OK"
    }
}