<template>
    <div class="flex flex-col p-4 items-center w-full">
        <div class="flex flex-col">
            <h1 class="text-3xl justify-center w-full">Piętro {{ floor_number }}</h1>
            <div class="flex flex-row justify-between">
                <div id="green-filter" class="w-4 h-4 bg-green-500 rounded-sm cursor-pointer" @click="applyGreen">
                    
                </div>
                <div id="red-filter" class="w-4 h-4 bg-red-500 rounded-sm cursor-pointer" @click="applyRed">

                </div>
                <div id="gray-filter" class="w-4 h-4 bg-gray-500 rounded-sm cursor-pointer" @click="applyGrey">
                    
                </div>
                <!--
                <div class="w-4 h-4 bg-white rounded-sm cursor-pointer outline dark:outline-none outline-gray-500" @click="resetFilters">
                    
                </div>
                -->
            </div>
        </div>
        <UDivider v-if="!hide_naxuy_rooms" class="prevent-select my-4 cursor-pointer" @click="MEGAOPENrooms">Pokoje [{{ rooms.length }}]</UDivider>
        <div v-if="displayRooms && !hide_naxuy_rooms"
            class="grid 2xl:grid-cols-12 xl:grid-cols-10 grid-cols-6 w-full place-items-center justify-center h-full"
            >
            <div v-if="displayRooms && !hide_naxuy_rooms" v-for="(room, roomIndex) in rooms" :key="roomIndex"
                class="mb-3 room-card text-white flex items-center justify-center rounded-lg cursor-pointer w-12 h-12  xl:w-24 xl:h-24 text-sm xl:text-sm 2xl:text-2xl flex-grow bg-gray-500"
                :class="setRoomColor(roomIndex)" @click="openRoomModal(roomIndex)">
                {{ room.room_number }}
            </div>
            <div class="xl:w-24 xl:h-24 w-12 h-12  mb-3 room-card bg-gray-500 text-white flex items-center justify-center rounded-lg cursor-pointer"
                @click="createNewRoom()" v-if="isAdmin">
                <span class="text-center text-6xl">+</span>
            </div>
        </div>
        <UDivider v-if="!hide_naxuy_corridor" class="prevent-select my-4 cursor-pointer" @click="MEGAOPENcorrdior">Korytarz [{{ corridors.length }} AP]</UDivider>
        <div v-if="displayCorridor"
            class="grid 2xl:grid-cols-12 xl:grid-cols-10 grid-cols-6 w-full place-items-center justify-center h-full">
            <div v-if="displayCorridor"
                v-for="(corridor, corridorIndex) in corridors" 
                :key="corridorIndex"
                class="mb-3 room-card text-white flex items-center justify-center rounded-lg cursor-pointer w-12 h-12  xl:w-24 xl:h-24 text-sm xl:text-sm 2xl:text-2xl flex-grow bg-gray-500"
                :class="setCorridorAPColor(corridorIndex)"
                @click="OpenCorridorModal(corridorIndex)">
                {{ corridor.accessPointNumber }}
            </div>
            <div class="xl:w-24 xl:h-24 w-12 h-12  mb-3 room-card bg-gray-500 text-white flex items-center justify-center rounded-lg cursor-pointer"
                @click="createNewCorridorAcessPoint()" v-if="isAdmin">
                <span class="text-center text-6xl">+</span>
            </div>
        </div>
        <UDivider v-if="hasCinemas && !hide_naxuy_cinema" class="prevent-select my-4 cursor-pointer" @click="MEGAOPENcinema">Kina</UDivider>
        <div v-if="displayCinemas"
            class="grid 2xl:grid-cols-12 xl:grid-cols-10 grid-cols-6 w-full place-items-center justify-center h-full">
            <!--<div v-if="displayCinemas"
                v-for="(cinema, cinemaIndex) in cinemas" 
                :key="cinemaIndex"
                class="mb-3 room-card text-white flex items-center justify-center rounded-lg cursor-pointer w-12 h-12  xl:w-24 xl:h-24 text-sm xl:text-sm 2xl:text-2xl flex-grow bg-gray-500"
                :class="setCinemaColor(cinemaIndex)"
                @click="openCinemaModal(cinemaIndex)">
                {{ cinema.number}}
            </div>-->
            <div class="xl:w-24 xl:h-24 w-12 h-12  mb-3 room-card bg-gray-500 text-white flex items-center justify-center rounded-lg cursor-pointer"
                @click="createNewCorridorAcessPoint()"
                v-if="isAdmin"
                >
                <span class="text-center text-6xl">+</span>
            </div>
        </div>
        <UDivider v-if="hasConferenceRooms && !hide_naxuy_conference_rooms" class="prevent-select my-4 cursor-pointer" @click="MEGAOPENconference_rooms">Sale konferencyjne</UDivider>
        <UDivider v-if="hasRestaurants && !hide_naxuy_restaurants" class="prevent-select my-4 cursor-pointer" @click="MEGAOPENrestaurants">Restauracje</UDivider>
        <UDivider v-if="hasPlayrooms" class="prevent-select my-4 cursor-pointer">Bawialni</UDivider>
    </div>
    <!-- rooms modal-->
    <UModal v-model="isOpenRoomModal" class="w-60" :ui="{ container: 'items-start' }">
        <button></button>
        <div class="flex justify-center flex-col items-center p-6">
            <UInput v-model="openedRoomNumber" v-maska data-maska="#####" class="text-xl w-24 mb-2"
                placeholder="Room number" />
            <UInput v-model="openedRoomAcessPointMAC" v-maska data-maska="**:**:**:**:**:**" placeholder="MAC:Address" />
            <div class="m-2 flex flex-col">
                <div class="flex flex-row">
                    <div class="pr-2">
                        <img v-if="isAcessPointGreen()" src="~/assets/pngs/wifi-green.png" @click="AcessPointstate"
                            class="cursor-pointer" />
                        <img v-if="isAcessPointGray()" src="~/assets/pngs/wifi-gray.png" @click="AcessPointstate"
                            class="cursor-pointer" />
                        <img v-if="isAcessPointRed()" src="~/assets/pngs/wifi-red.png" @click="AcessPointstate"
                            class="cursor-pointer" />
                    </div>
                    <div class="pr-2">
                        <img v-if="isTvGreen()" src="~/assets/pngs/tv-green.png" @click="TVstate" class="cursor-pointer" />
                        <img v-if="isTvGray()" src="~/assets/pngs/tv-gray.png" @click="TVstate" class="cursor-pointer" />
                        <img v-if="isTvRed()" src="~/assets/pngs/tv-red.png" @click="TVstate" class="cursor-pointer" />
                    </div>
                </div>
                <div class="flex flex-row">
                    <div class="pr-2">
                        <img v-if="isBathPhoneGreen()" src="~/assets/pngs/bath-green.png" @click="BathPhonestate"
                            class="cursor-pointer" />
                        <img v-if="isBathPhoneGray()" src="~/assets/pngs/bath-gray.png" @click="BathPhonestate"
                            class="cursor-pointer" />
                        <img v-if="isBathPhoneRed()" src="~/assets/pngs/bath-red.png" @click="BathPhonestate"
                            class="cursor-pointer" />
                    </div>
                    <div>
                        <img v-if="isPhoneGreen()" src="~/assets/pngs/phone-green.png" @click="Phonestate"
                            class="cursor-pointer" />
                        <img v-if="isPhoneGray()" src="~/assets/pngs/phone-gray.png" @click="Phonestate"
                            class="cursor-pointer" />
                        <img v-if="isPhoneRed()" src="~/assets/pngs/phone-red.png" @click="Phonestate"
                            class="cursor-pointer" />
                    </div>
                </div>
            </div>
            <div class="w-full justify-between flex mt-4">
                <UButton label="Submit" @click="submitEdit"></UButton>
                <div class="flex flex-col mx-4 2xl:mx-0">
                    <UTextarea v-model="openedRoomComment" placeholder="Comment" class="pb-2" size="xs"/>
                </div>

                <UButton label="Cancel" color="red" @click="isOpenRoomModal = false"></UButton>
            </div>
        </div>
    </UModal>
    <!-- corridors modal -->
    <UModal v-model="isOpenCorridorModal" class="w-60" :ui="{ container: 'items-start' }">
        <button></button>
        <div class="flex justify-center flex-col items-center p-6">
            <UInput v-model="openedCorrdior.accessPointNumber" v-maska data-maska="#####" class="text-xl w-24 mb-2"
                placeholder="Room number" />
            <UInput v-model="openedCorrdior.macAddress" v-maska data-maska="**:**:**:**:**:**" placeholder="MAC:Address" class="pb-2"/>
            <UInput v-model="openedCorrdior.comment" placeholder="Comment"  />
            <div class="w-full justify-between flex mt-4">
                <UButton label="Submit" @click="submitCorridorEdit"></UButton>
                <div class="flex flex-col mx-4 2xl:mx-0">
                </div>
                <UButton label="Cancel" color="red" @click="isOpenCorridorModal = false"></UButton>
            </div>
        </div>
    </UModal>
</template>
<script setup>
import axios from 'axios';

// Base data
const floor_number = ref(0)
const floor = ref(null)
const rooms = ref([])
const savedRooms = ref([])
const corridors = ref([])
const savedCorridors = ref([])
const cinemas = ref([])
const userPermissions = ref({})
const isAdmin = ref(false)

// Floor part
const displayRooms = ref(false)

const displayCorridor = ref(false)

const hasCinemas = ref(false)
const displayCinemas = ref(false)

const hasConferenceRooms = ref(false)
const displayConferenceRooms = ref(false)

const hasRestaurants = ref(false)
const displayRestaurants = ref(false)

const hasPlayrooms = ref(false)
const displayPlayrooms = ref(false)
// useless shit
const hide_naxuy_cinema = ref(false)
const hide_naxuy_corridor = ref(false)
const hide_naxuy_rooms = ref(false)
const hide_naxuy_conference_rooms = ref(false)
const hide_naxuy_restaurants = ref(false)
// Rooms part
const openedRoomNumber = ref(0)
const openedRoomFloorNumber = ref(0)
const openedRoomHasTV = ref('NoData')
const openedRoomHasPhone = ref('NoData')
const openedRoomHasBathPhone = ref('NoData')
const openedRoomHasAcessPoint = ref('NoData')
const openedRoomComment = ref('NoData')
const openedRoomAcessPointMAC = ref('NoData')

const openedCorrdior = ref({})

// Modals vars
const isOpenRoomModal = ref(false)
const isOpenCorridorModal = ref(false)

// FIlters
const filterApplied = ref(false)
const greenFilter = ref(false)
const redFilter = ref(false)
const grayFilter = ref(false)
// Methods
onMounted(() => {
    const token = useCookie('token').value
    if (token === null || token === undefined) {
        navigateTo("/login")
    }
    else {
        axios.post('/api/users/permissions', { "token": token }).then((response) => {
            if (Object.keys(response.data).length === 0) {
                userPermissions.value = {
                    "root": false,
                    "admin": false,
                }
            }
            else {
                userPermissions.value = response.data
                isAdmin.value = userPermissions.value.admin
            }
        })
    }
    const querry = useRoute().query
    floor_number.value = querry.floor_number
    getFloorInfo()
})
const getFloorInfo = () => {
    axios.get('api/floors/')
        .then((response) => {
            let floors = response.data.body
            floor.value = floors.find(floor => floor.floor_number == floor_number.value)
            if (typeof (floor.value.rooms) !== undefined) {
                rooms.value = floor.value.rooms
                rooms.value.sort((a, b) => {
                    return a.room_number - b.room_number
                })
                savedRooms.value = rooms.value
            }
            if (typeof (floor.value.cinemas) !== undefined || (userPermissions.admin === true || userPermissions.root === true)) {
                if (userPermissions.value.admin === true || userPermissions.value.root === true || typeof (floor.value.cinemas) === Array) {
                    hasCinemas.value = true
                }
            }
            if (typeof (floor.value.conference_rooms) !== undefined) {
                hasConferenceRooms.value = true
            }
            if (typeof (floor.value.restaurants) !== undefined) {
                hasRestaurants.value = true
            }
            if (typeof (floor.value.playrooms) === Array) {
                hasPlayrooms.value = true
            }
            if (typeof (floor.value.corridor) !== undefined) {
                corridors.value = floor.value.corridor
                corridors.value.sort((a, b) => {
                    return a.AccessPointNumber - b.AccessPointNumber
                })
                savedCorridors.value = corridors.value
            }
        })
        .catch((error) => {
            console.log(error)
        })
}
const setRoomColor = (roomIndex) => {
    let room = rooms.value[roomIndex]
    if (room.hasTV === 'Yes' && room.hasPhone === 'Yes' && room.hasBathPhone === 'Yes' && room.hasAccessPoint === 'Yes') {
        return 'bg-green-500'
    }
    else if (room.hasTV === 'No' || room.hasPhone === 'No' || room.hasBathPhone === 'No' || room.hasAccessPoint === 'No') {
        return 'bg-red-500'
    }
    else {
        return 'bg-gray-500'
    }
}
const openRoomModal = (room_number) => {
    openedRoomFloorNumber.value = floor_number
    room_number = rooms.value[room_number].room_number
    axios.post('/api/rooms/info', { "floor_number": floor_number.value, "room_number": room_number }).then((response) => {
        openedRoomHasAcessPoint.value = response.data.hasAccessPoint
        openedRoomHasBathPhone.value = response.data.hasBathPhone
        openedRoomHasPhone.value = response.data.hasPhone
        openedRoomHasTV.value = response.data.hasTV
        openedRoomComment.value = response.data.comment
        openedRoomAcessPointMAC.value = response.data.macAddress
    })
    openedRoomNumber.value = room_number
    isOpenRoomModal.value = true
}
const setCorridorAPColor = (corridorIndex) => {
    let corridorAP = corridors.value[corridorIndex]
    if (corridorAP.macAddress === '') {
        return 'bg-gray-500'
    }
    else {
        return 'bg-green-500'
    }
}
const OpenCorridorModal = (corridor_number) => {
    console.log(corridor_number)
    corridor_number = corridors.value[corridor_number].accessPointNumber
    console.log(corridor_number)
    axios.post('/api/corridors/info', { "floor_number": floor_number.value, "corridor_number": corridor_number }).then((response) => {
        openedCorrdior.value.accessPointNumber = corridor_number
        openedCorrdior.value.macAddress = response.data.macAddress
        openedCorrdior.value.comment = response.data.comment
    })
    openedCorrdior.value.AccessPointNumber = corridor_number
    isOpenCorridorModal.value = true
}
const setCinemaColor = () => {
    return 'bg-gray-500'
    // TODO: implement
}
const openCinemaModal = () => {
    // TODO: implement
}
const TVstate = () => {
    if (openedRoomHasTV.value === 'unknown') {
        openedRoomHasTV.value = 'Yes'
    }
    else if (openedRoomHasTV.value === 'Yes') {
        openedRoomHasTV.value = 'No'
    }
    else {
        openedRoomHasTV.value = 'unknown'
    }
}
const AcessPointstate = () => {
    if (openedRoomHasAcessPoint.value === 'unknown') {
        openedRoomHasAcessPoint.value = 'Yes'
    }
    else if (openedRoomHasAcessPoint.value === 'Yes') {
        openedRoomHasAcessPoint.value = 'No'
    }
    else {
        openedRoomHasAcessPoint.value = 'unknown'
    }
}
const Phonestate = () => {
    if (openedRoomHasPhone.value === 'unknown') {
        openedRoomHasPhone.value = 'Yes'
    }
    else if (openedRoomHasPhone.value === 'Yes') {
        openedRoomHasPhone.value = 'No'
    }
    else {
        openedRoomHasPhone.value = 'unknown'
    }
}
const BathPhonestate = () => {
    if (openedRoomHasBathPhone.value === 'unknown') {
        openedRoomHasBathPhone.value = 'Yes'
    }
    else if (openedRoomHasBathPhone.value === 'Yes') {
        openedRoomHasBathPhone.value = 'No'
    }
    else {
        openedRoomHasBathPhone.value = 'unknown'
    }
}
const isTvGreen = () => {
    if (openedRoomHasTV.value === 'Yes') {
        return true
    }
    return false
}
const isTvGray = () => {
    if (openedRoomHasTV.value === 'unknown') {
        return true
    }
    return false
}
const isTvRed = () => {
    if (openedRoomHasTV.value === 'No') {
        return true
    }
    return false
}
const isPhoneGreen = () => {
    if (openedRoomHasPhone.value === 'Yes') {
        return true
    }
    return false
}
const isPhoneGray = () => {
    if (openedRoomHasPhone.value === 'unknown') {
        return true
    }
    return false
}
const isPhoneRed = () => {
    if (openedRoomHasPhone.value === 'No') {
        return true
    }
    return false
}
const isBathPhoneGreen = () => {
    if (openedRoomHasBathPhone.value === 'Yes') {
        return true
    }
    return false
}
const isBathPhoneGray = () => {
    if (openedRoomHasBathPhone.value === 'unknown') {
        return true
    }
    return false
}
const isBathPhoneRed = () => {
    if (openedRoomHasBathPhone.value === 'No') {
        return true
    }
    return false
}
const isAcessPointGreen = () => {
    if (openedRoomHasAcessPoint.value === 'Yes') {
        return true
    }
    return false
}
const isAcessPointGray = () => {
    if (openedRoomHasAcessPoint.value === 'unknown') {
        return true
    }
    return false
}
const isAcessPointRed = () => {
    if (openedRoomHasAcessPoint.value === 'No') {
        return true
    }
    return false
}


const submitEdit = () => {
    axios.post('/api/rooms/modify', { "floor_number": floor_number.value, "room_number": openedRoomNumber.value, "hasAccessPoint": openedRoomHasAcessPoint.value, "hasBathPhone": openedRoomHasBathPhone.value, "hasPhone": openedRoomHasPhone.value, "hasTV": openedRoomHasTV.value, "comment": openedRoomComment.value, "macAddress": openedRoomAcessPointMAC.value }).then((response) => {
        getFloorInfo()
        isOpenRoomModal.value = false
    })
}
const submitCorridorEdit = () => {
    axios.post('/api/corridors/modify',{ "floor_number": floor_number.value, "accessPointNumber": openedCorrdior.value.AccessPointNumber, "macAddress": openedCorrdior.value.macAddress, "comment": openedCorrdior.value.comment }).then((response) => {
        getFloorInfo()
        isOpenCorridorModal.value = false
    })
}
const createNewRoom = () => {
    axios.put('/api/rooms/create', { "floor_number": floor_number.value }).then((response) => {
        getFloorInfo()
    })
}
const createNewCorridorAcessPoint = () => {
    axios.put('/api/corridors/create', { "floor_number": floor_number.value }).then((response) => {
        getFloorInfo()
    })
}
const MEGAOPENrooms = () => {
    if (displayRooms.value === true) {
        displayRooms.value = false
        hide_naxuy_cinema.value = false
        hide_naxuy_corridor.value = false
        hide_naxuy_conference_rooms.value = false
        hide_naxuy_restaurants.value = false
    }
    else {
        displayRooms.value = true
        hide_naxuy_cinema.value = true
        hide_naxuy_corridor.value = true
        hide_naxuy_conference_rooms.value = true
        hide_naxuy_restaurants.value = true
        displayCinemas.value = false
    }
}
const MEGAOPENcorrdior = () => {
    if (displayCorridor.value === true) {
        displayCorridor.value = false
        hide_naxuy_cinema.value = false
        hide_naxuy_rooms.value = false
        hide_naxuy_conference_rooms.value = false
        hide_naxuy_restaurants.value = false
    }
    else {
        displayCorridor.value = true
        hide_naxuy_cinema.value = true
        hide_naxuy_rooms.value = true
        hide_naxuy_conference_rooms.value = true
        hide_naxuy_restaurants.value = true
        displayCinemas.value = false
    }
}
const MEGAOPENcinema = () => {
    if (displayCinemas.value === true) {
        displayCinemas.value = false
        hide_naxuy_corridor.value = false
        hide_naxuy_rooms.value = false
        hide_naxuy_conference_rooms.value = false
        hide_naxuy_restaurants.value = false
    }
    else {
        displayCinemas.value = true
        hide_naxuy_corridor.value = true
        hide_naxuy_rooms.value = true
        hide_naxuy_conference_rooms.value = true
        hide_naxuy_restaurants.value = true
        displayCorridor.value = false
        displayRooms.value = false
    }
}
const MEGAOPENconference_rooms = () => {
    if (displayConferenceRooms.value === true) {
        displayConferenceRooms.value = false
        hide_naxuy_cinema.value = false
        hide_naxuy_rooms.value = false
        hide_naxuy_corridor.value = false
        hide_naxuy_restaurants.value = false
    }
    else {
        displayConferenceRooms.value = true
        hide_naxuy_cinema.value = true
        hide_naxuy_rooms.value = true
        hide_naxuy_corridor.value = true
        hide_naxuy_restaurants.value = true
        displayCinemas.value = false
    }
}
const MEGAOPENrestaurants = () => {
    if (displayRestaurants.value === true) {
        displayRestaurants.value = false
        hide_naxuy_cinema.value = false
        hide_naxuy_rooms.value = false
        hide_naxuy_conference_rooms.value = false
        hide_naxuy_corridor.value = false
    }
    else {
        displayRestaurants.value = true
        hide_naxuy_cinema.value = true
        hide_naxuy_rooms.value = true
        hide_naxuy_conference_rooms.value = true
        hide_naxuy_corridor.value = true
        displayCinemas.value = false
    }
}   
const applyGreen = () => {
    greenFilter.value = !greenFilter.value
    refreshFilter()
    /*
    if (!filterApplied.value) {
        savedRooms.value = rooms.value
        savedCorridors.value = corridors.value
        // remove from rooms all rooms that don't have all fields as "Yes"
        rooms.value = rooms.value.filter((room) => {
            return room.hasTV === "Yes" && room.hasAccessPoint === "Yes" && room.hasPhone === "Yes" && room.hasBathPhone === "Yes";
        })
        console.log(corridors.value[0])
        corridors.value = corridors.value.filter((value) => {
            return value.macAddress.length === 17
        })
        filterApplied.value = true
    }
    else {
        rooms.value = savedRooms.value
        corridors.value = savedCorridors.value
        filterApplied.value = false
    }*/
}
const applyRed = () => {
    redFilter.value = !redFilter.value
    refreshFilter()
    /*
    if (!filterApplied.value) {
        savedRooms.value = rooms.value
        savedCorridors.value = corridors.value
        rooms.value = rooms.value.filter((room) => {
            return room.hasTV === "No" && room.hasAccessPoint === "No" && room.hasPhone === "No" && room.hasBathPhone === "No";
        })
        corridors.value.filter((corridor) => {
            corridor.macAddress.length === 17
        })
        filterApplied.value = true
    }
    else {
        rooms.value = savedRooms.value
        corridors.value = savedCorridors.value
        filterApplied.value = false
    }*/
}
const applyGrey = () => {
    grayFilter.value = !grayFilter.value
    refreshFilter()
    /*
    if (!filterApplied.value) {
        savedRooms.value = rooms.value
        savedCorridors.value = corridors.value
        rooms.value = rooms.value.filter((room) => {
            return room.hasTV === "unknown" && room.hasAccessPoint === "unknown" && room.hasPhone === "unknown" && room.hasBathPhone === "unknown";
        })
        corridors.value = corridors.value.filter((corridor) => {
            console.log(corridor.macAddress.length)
            corridor.macAddress.length === 17
        })
        filterApplied.value = true
    }
    else {
        rooms.value = savedRooms.value
        corridors.value = savedCorridors.value
        filterApplied.value = false
    }*/
}
const resetFilters = () => {/*
    rooms.value = savedRooms.value
    corridors.value = savedCorridors.value
    filterApplied.value = false
    redFilter.value = false
    grayFilter.value = false
    greenFilter.value = false
    document.getElementById('green-filter').classList.remove('outline')
    document.getElementById('green-filter').classList.remove('outline-sky-500')
    document.getElementById('red-filter').classList.remove('outline')
    document.getElementById('red-filter').classList.remove('outline-sky-500')
    document.getElementById('gray-filter').classList.remove('outline')
    document.getElementById('gray-filter').classList.remove('outline-sky-500')*/
}
const refreshFilter = () => {
    rooms.value = []
    corridors.value = []
    if (greenFilter.value) {
        savedRooms.value.forEach((value) => {
            if (value.hasAccessPoint === "Yes", value.hasBathPhone === "Yes", value.hasPhone === "Yes",value.hasTV === "Yes") {
                rooms.value.push(value)
            }
        })
    }
    if (redFilter.value) {
        savedRooms.value.forEach((value) => {
            if (value.hasAccessPoint === "No", value.hasBathPhone === "No", value.hasPhone === "No",value.hasTV === "No") {
                rooms.value.push(value)
            }
        })
    }
    if (grayFilter.value) {
        savedRooms.value.forEach((value) => {
            if (value.hasAccessPoint === "unknown", value.hasBathPhone === "unknown", value.hasPhone === "unknown",value.hasTV === "unknown") {
                rooms.value.push(value)
            }
        })
    }
    if (!greenFilter.value && !redFilter.value && !grayFilter.value) {
        rooms.value = savedRooms.value
        corridors.value = savedCorridors.value
    }
    rooms.value.sort((a, b) => {
        return a.room_number - b.room_number
    })
    corridors.value.sort((a, b) => {
        return a.AccessPointNumber - b.AccessPointNumber
    })
    setFilterOutline()
}
const setFilterOutline = () => {
    if (greenFilter.value) {
        document.getElementById('green-filter').classList.add('outline')
        document.getElementById('green-filter').classList.add('outline-sky-500')
    }
    else {
        document.getElementById('green-filter').classList.remove('outline')
        document.getElementById('green-filter').classList.remove('outline-sky-500')
    }
    if (redFilter.value) {
        document.getElementById('red-filter').classList.add('outline')
        document.getElementById('red-filter').classList.add('outline-sky-500')
    }
    else {
        document.getElementById('red-filter').classList.remove('outline')
        document.getElementById('red-filter').classList.remove('outline-sky-500')
    }
    if (grayFilter.value) {
        document.getElementById('gray-filter').classList.add('outline')
        document.getElementById('gray-filter').classList.add('outline-sky-500')
    }
    else {
        document.getElementById('gray-filter').classList.remove('outline')
        document.getElementById('gray-filter').classList.remove('outline-sky-500')
    }
}
</script>
<style scoped>
.prevent-select {
    -webkit-touch-callout: none;
    /* iOS Safari */
    -webkit-user-select: none;
    /* Safari */
    -khtml-user-select: none;
    /* Konqueror HTML */
    -moz-user-select: none;
    /* Old versions of Firefox */
    -ms-user-select: none;
    /* Internet Explorer/Edge */
    user-select: none;
    /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
}
</style>