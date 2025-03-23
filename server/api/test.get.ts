import mongoose from "mongoose";
import { IFloor } from "~/types/floor";
import type { Room } from "~/types/room";


export default defineEventHandler(async (event) => {
  let floors = await mongoose.connection.db.collection('hotel-floors').find().toArray()
  let TotalRooms: Room[] = [];
  let reBuildedRooms = [];
  floors.forEach((floor: IFloor) => {
    reBuildedRooms = floor.rooms.map((room: Room) => {
      return {
        roomNumber: room.roomNumber,
        informatycy: transformSection(room.informatycy),
        elektrycy: transformSection(room.elektrycy),
        konserwatorzy: transformSection(room.konserwatorzy),
        pokojowe: transformSection(room.pokojowe),
        administracja: transformSection(room.administracja)
      };
    }) as Room[];
    TotalRooms = TotalRooms.concat(reBuildedRooms);
  });
  TotalRooms = TotalRooms.sort((a, b) => a.roomNumber - b.roomNumber);
  const flattenedJSON = TotalRooms.map(room => flattenJSON(room));
  const csv = jsonToCSV(flattenedJSON);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  return new Response(blob, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename=rooms.csv',
    },
  });

  
  function transformSection(section: any) {
    const keys = Object.keys(section);
    const transformed = {};
    keys.forEach(key => {
      transformed[key] = StatusDecoder(section[key]);
    });
    return transformed;
  }
  function StatusDecoder(status: string) {
    if (status === 'Yes') return 'OK'
    if (status === 'No') return 'Błąd'
    if (status === 'unknown') return "Niema"
    return status
  }
  function flattenJSON(obj: any, parentKey = '', result = {}) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && !key.endsWith('_id') && !key.endsWith('macAddress') && !key.startsWith('administracja')){
        const newKey = parentKey ? `${parentKey}_${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          flattenJSON(obj[key], newKey, result);
        } else {
          result[newKey] = obj[key];
        }
      }
    }
    return result;
  }
  function jsonToCSV(flattenedJSON) {
    const headers = Object.keys(flattenedJSON[0]);
    const csvRows = [];
  
    // Add headers and rows
    const colsArr = ['Numer pokoju','Access Point','Telefon Laz.','Telefon','Telewizor','Zamek',"Uwagi Inf.",
                    'Gniazdka','Oświetlenie','Lodówka','Suszarka','Lusterko','Klimatyzacja','Uwagi elek.',
                    'Prysznic','Miska WC','Grzejnik','Bidet','Umywalka','Drzwi Wejśćiowe','Kratka Balkon','Tapety','Płytki + Fugi','Sylikony','Sufit','Kratki went.','Drzwickzki rew.','Drzwi Toaleta','Okna','Malowanie Sufitu','Kluszę','Uwagi Kons.',
                    'Wykładziny','Meble','Firany i Zasłony','Obrazy','Sejf','Czajnik','Uwagi Pok.']
    csvRows.push(colsArr.join(','));
    for (const obj of flattenedJSON) {
      const values = headers.map(header => JSON.stringify(obj[header], replacer));
      csvRows.push(values.join(','));
    }
  
    return csvRows.join('\n');
  }
  
  function replacer(key, value) {
    if (value === null) {
      return '';
    }
    return value;
  }
  return TotalRooms;
  
});
