import Floor from "~/model/floor"
import type { OldRoom } from "~/types/oldroom";
import type { OldCorridor } from "~/types/oldcorridor";
import type { Room } from "~/types/room";
import type { Corridor } from "~/types/corridor";


export default defineEventHandler(async (event) => {
  const floors = await Floor.find({});
  const allRooms = []; // Array to hold all transformed rooms
  for (let floorIndex = 0; floorIndex < floors.length; floorIndex++) {
    let rooms = floors[floorIndex].rooms;

    for (let roomIndex = 0; roomIndex < rooms.length; roomIndex++) {
      let room = rooms[roomIndex] as OldRoom;
      let newRoom = {
        roomNumber: room.room_number,
        alarm: room.alarm ?? false,
        informatycy: {
          hasAccessPoint: room.hasAccessPoint,
          hasBathPhone: room.hasBathPhone,
          hasPhone: room.hasPhone,
          hasTV: room.hasTV,
          hasLock: room.hasLock,
          macAddress: room.macAddress,
          Icomment: room.Icomment,
          _id: '',
        },
        elektrycy: {
          hasSocket: room.hasSocket ?? "unknown",
          hasBulb: room.hasBulb ?? "unknown",
          hasFreezer: "unknown",
          hasDryer: "unknown",
          hasMirror: "unknown",
          hasAC: "unknown",
          Ecomment: room.Ecomment ?? "",
          _id: '',
        },
        konserwatorzy: {
          hasShower: room.hasShower ?? "unknown",
          hasToilet: room.hasToilet ?? "unknown",
          hasRadiator: room.hasRadiator ?? "unknown",
          hasBidet: room.hasBidet ?? "unknown",
          hasSink: room.hasSink ?? "unknown",
          hasDoor: room.hasDoor ?? "unknown",
          hasDrain: "unknown",
          hasWallpaper: "unknown",
          hasTiles: "unknown",
          hasJoints: "unknown",
          hasSilicone: "unknown",
          hasCeiling: "unknown",
          hasVent: "unknown",
          hasRevisionDoor: "unknown",
          hasToiletDoor: "unknown",
          hasWindow: "unknown",
          hasCeilingPainting: "unknown",
          Kcomment: room.Kcomment ?? "",
          _id: '',
        },
        pokojowe: {
          hasCarpet: "unknown",
          hasBed: room.hasBed ?? "unknown",
          hasCurtains: "unknown",
          hasPainting: "unknown",
          hasSafe: "unknown",
          hasBroom: room.hasBroom ?? "unknown",
          hasKettle: "unknown",
          Pcomment: room.Pcomment ?? "",
          _id: '',
        },
        administracja: {
          isApproved: "No",
          isApprovedBy: "unknown",
          isApprovedDate: null,
          Acomment: "unknown",
          _id: '',
        },
      } as Room;

      allRooms.push(newRoom); // Add processed room to the array
    }
  }

  return allRooms; // Return all transformed rooms
});
