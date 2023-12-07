import mongoose, { mongo } from "mongoose";
import jwt from 'jsonwebtoken';
import fs from 'fs';
import excel from 'exceljs';

const config = useRuntimeConfig();

const unauthorizedReturn = (event: any) => {
    setResponseStatus(event,401,"Unauthorized")
}
export default defineEventHandler(async (event) => {
    return
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
    const body = await readMultipartFormData(event)
    // get data from body
    if (body === null) { setResponseStatus(event,400,"Bad Request"); return }
    if (body === undefined) { setResponseStatus(event,400,"Bad Request"); return }
    if (body[0] === undefined) { setResponseStatus(event,400,"Bad Request"); return }
    if (body[0].data === undefined) { setResponseStatus(event,400,"Bad Request"); return }
    fs.writeFileSync('test.xlsx',body[0].data)
    const workbook = new excel.Workbook();
    await workbook.xlsx.readFile('test.xlsx');
    const sheets: Array<Object>= []
    workbook.eachSheet((sheet, id) => {
        const sheetName = sheet.name
        const sheetObj = {
            "name" : sheetName,
            "floor_number" : workbook.worksheets.indexOf(sheet)+1,
        }
        const rooms: Array<Object> = []
        sheet.eachRow((row, rowNumber) => {
            const rowObject = {}
            let hasap = "unknown"
            if (row.getCell(2).value !== null) { hasap = "Yes" }
            Object.assign(rowObject, {"room_number" : row.getCell(3).value})
            Object.assign(rowObject, {"macAddress" : row.getCell(2).value})
            Object.assign(rowObject, {"hasAccessPoint" : hasap})
            Object.assign(rowObject, {"hasTV" : "unknown"})
            Object.assign(rowObject, {"hasPhone" : "unknown"})
            Object.assign(rowObject, {"hasBathPhone" : "unknown"})
            Object.assign(rowObject, {"comment" : ""})
            rooms.push(rowObject)
        })
        rooms.shift()
        rooms.forEach((item) => {
            if (typeof(item.room_number) !== 'number') {
                rooms.splice(rooms.indexOf(item),1)
            }
            })
        rooms.pop()
        rooms.pop()
        Object.assign(sheetObj, {"rooms" : rooms})
        let corridor: Array<Object> = []
        sheet.eachRow((row,rowNumber) => {
            const corridorObject = {}
            Object.assign(corridorObject, {"macAddress" : row.getCell(4).value})
            Object.assign(corridorObject, {"accessPointNumber" : row.getCell(3).value})
            Object.assign(corridorObject, {"comment" : ""})
            corridor.push(corridorObject)
        })
        corridor.shift()
        corridor.pop()
        corridor.pop()
        Object.assign(sheetObj,{'corridor' : corridor})
        sheets.push(sheetObj)
    });
    mongoose.connection.db.collection('hotel-floors').deleteMany({})
    mongoose.connection.db.collection('hotel-floors').insertMany(sheets)

    fs.writeFileSync('test.json',JSON.stringify(sheets))

    setResponseStatus(event,200,"OK")
})