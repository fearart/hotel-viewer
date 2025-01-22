import mongoose from "mongoose";


const InformatycySchema = new mongoose.Schema({
    hasAccessPoint: { type: 'string', required: false },
    hasBathPhone: { type: 'string', required: false },
    hasPhone: { type: 'string', required: false },
    hasTV: { type: 'string', required: false },
    hasLock: { type: 'string', required: false },
    macAddress: { type: 'string', required: false },
    Icomment: { type: 'string', required: false },
})

const ElektrycySchema = new mongoose.Schema({
    hasSocket: { type: 'string', required: false },
    hasBulb: { type: 'string', required: false },
    hasFreezer: { type: 'string', required: false },
    hasDryer: { type: 'string', required: false },
    hasMirror: { type: 'string', required: false },
    hasAC: { type: 'string', required: false },
    Ecomment: { type: 'string', required: false },
})

const KonserwatorzySchema = new mongoose.Schema({
    hasShower: { type: 'string', required: false },
    hasToilet: { type: 'string', required: false },
    hasRadiator: { type: 'string', required: false },
    hasBidet: { type: 'string', required: false },
    hasSink: { type: 'string', required: false },
    hasDoor: { type: 'string', required: false },
    hasDrain: { type: 'string', required: false },
    hasWallpaper: { type: 'string', required: false },
    hasTiles: { type: 'string', required: false },
    hasJoints: { type: 'string', required: false },
    hasSilicone: { type: 'string', required: false },
    hasCeiling: { type: 'string', required: false },
    hasVent: { type: 'string', required: false },
    hasRevisionDoor: { type: 'string', required: false },
    hasToiletDoor: { type: 'string', required: false },
    hasWindow: { type: 'string', required: false },
    hasCeilingPainting: { type: 'string', required: false },
    Kcomment: { type: 'string', required: false },
})

const PokojoweSchema = new mongoose.Schema({
    hasCarpet: { type: 'string', required: false },
    hasBed: { type: 'string', required: false },
    hasCurtains: { type: 'string', required: false },
    hasPainting: { type: 'string', required: false },
    hasSafe: { type: 'string', required: false },
    hasBroom: { type: 'string', required: false },
    hasKettle: { type: 'string', required: false },
    Pcomment: { type: 'string', required: false },
})

const AdministracjaSchema = new mongoose.Schema({
    isApproved: { type: 'string', required: false },
    isApprovedBy: { type: 'string', required: false },
    isApprovedDate: { type: 'date', required: false },
    Acomment: { type: 'string', required: false },
})

const CorridorSchema = new mongoose.Schema({
    corridorNumber: { type: Number, required: false },
    informatycy: { type: InformatycySchema, required: false },
    elektrycy: { type: ElektrycySchema, required: false },
    konserwatorzy: { type: KonserwatorzySchema, required: false },
    pokojowe: { type: PokojoweSchema, required: false },
    administracja: { type: AdministracjaSchema, required: false },
})
const RoomSchema = new mongoose.Schema({
    roomNumber: { type: Number, required: false },
    informatycy: { type: InformatycySchema, required: false },
    elektrycy: { type: ElektrycySchema, required: false },
    konserwatorzy: { type: KonserwatorzySchema, required: false },
    pokojowe: { type: PokojoweSchema, required: false },
    administracja: { type: AdministracjaSchema, required: false },
})

const FloorSchema = new mongoose.Schema({
    floorNumber: { type: Number, required: true },
    rooms: { type: [RoomSchema], required: true },
    corridor: { type: [CorridorSchema], required: true },
    cinemas: { type: [mongoose.Schema.Types.Mixed], required: true },
    conferenceRooms: { type: [mongoose.Schema.Types.Mixed], required: true },
    restaurants: { type: [mongoose.Schema.Types.Mixed], required: true },
    kitchens: { type: [mongoose.Schema.Types.Mixed], required: true },
    coffeeBrakes: { type: [mongoose.Schema.Types.Mixed], required: true },
})
export default mongoose.model('hotel-floors', FloorSchema);

