<template>
    <div class="flex flex-col p-4 items-center w-full montserrat">
        <div class="flex flex-col">
            <h1 class="text-3xl justify-center w-full">Piętro {{ floor_number }}</h1>
            <div class="flex flex-row justify-between">
                <div id="green-filter" class="w-4 h-4 bg-green-500 rounded-sm cursor-pointer" @click="applyGreen">
                    
                </div>
                <div id="red-filter" class="w-4 h-4 bg-red-500 rounded-sm cursor-pointer" @click="applyRed">

                </div>
                <div id="gray-filter" class="w-4 h-4 bg-gray-500 rounded-sm cursor-pointer" @click="applyGrey">
                    
                </div>
            </div>
        </div>
        <UDivider v-if="!hide_naxuy_rooms" class="prevent-select my-4 cursor-pointer" @click="MEGAOPENrooms">Pokoje [{{ rooms.length }}]</UDivider>
        <div v-if="displayRooms && !hide_naxuy_rooms"
            class="grid 2xl:grid-cols-12 xl:grid-cols-10 grid-cols-6 w-full place-items-center justify-center h-full"
            >
            <div v-if="displayRooms && !hide_naxuy_rooms" v-for="(room, roomIndex) in rooms" :key="roomIndex"
                class="mb-3 room-card text-white flex-col flex items-center justify-center rounded-lg cursor-pointer w-12 h-12  xl:w-24 xl:h-24 text-sm xl:text-sm 2xl:text-2xl flex-grow bg-gray-500"
                :class="[setRoomColor(roomIndex), room.alarm ? 'alarm' : '']" @click="openRoomModal(roomIndex)">
                {{ room.room_number }}
                <div class="flex flex-row 2xl:w-2/3 w-5/6 justify-center text-center text-sm 2xl:pt-4">
                    <p class="w-1/5" v-if="eShouldDisplay(roomIndex)">E</p>
                    <p class="w-1/5" v-if="kShouldDisplay(roomIndex)">K</p>
                    <p class="w-1/5" v-if="iShouldDisplay(roomIndex)">I</p>
                    <p class="w-1/5" v-if="pShouldDisplay(roomIndex)">P</p>
                    <p class="w-1/5" v-if="aShouldDisplay(roomIndex)">A</p>
                </div>
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
        <UTabs :items="roomModalItems" :default-index="openedRoom.defaultIndex" class="px-2 mt-2">
            <template #item="{ item }">
                <UCard @submit.prevent="() => onSubmit(item.key === 'account' ? accountForm : passwordForm)" class="mb-2">
                    <template #header>
                        <div class="flex flex-row h-10 w-full justify-center">
                            <UButton v-if="isAdmin" label="Submit" @click="submitEdit"></UButton>
                            <UButton label="Cancel" color="red" class="ml-2" @click="isOpenRoomModal = false"></UButton>
                            <UInput v-model="openedRoom.room_number" v-maska data-maska="#####" class="text-xl w-24 mb-2 mx-2"
                            placeholder="Room number" size="l"/>
                            <UButton v-if="openedRoom.alarm" icon="i-heroicons-bell" color="red" @click="toggleAlarm" class="mr-2"/>
                            <UButton v-else icon="i-heroicons-bell" color="gray" @click="toggleAlarm" class="mr-2"/>
                            <UButton label="" @click="requestEdit">
                                <img src="~/assets/svg/tg-white.png" class="w-6 h-6">
                            </UButton>
                        </div>
                    </template>
                    <div v-if="item.key === 'I'" class="flex justify-center flex-col items-center p-6">
                        <UInput v-model="openedRoom.macAddress" v-maska data-maska="**:**:**:**:**:**" placeholder="MAC:Address" />
                        <div class="m-2 flex flex-col items-center">
                            <div class="flex flex-row">
                                <div class="pr-2 h-20 w-20">
                                    <img :src="imageLibrary.AccessPointImage" @click="AcessPointstate" class="cursor-pointer"/>
                                </div>
                                <div class="pr-2 h-20 w-20">
                                    <img :src="imageLibrary.TVImage" @click="TVstate" class="cursor-pointer">
                                </div>
                                <div class="h-20 w-20">
                                    <img :src="imageLibrary.LockImage" @click="Lockstate" class="cursor-pointer"/>
                                </div>
                            </div>
                            <div class="flex flex-row">
                                <div class="h-20 w-20">
                                    <img :src="imageLibrary.PhoneImage" @click="Phonestate" class="cursor-pointer"/>
                                </div>
                                <div class="pr-2 h-20 w-20">
                                    <img :src="imageLibrary.BathPhoneImage" @click="BathPhonestate" class="cursor-pointer">
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col mx-4 2xl:mx-0 items-center justify-center">
                                <UTextarea v-model="openedRoom.Icomment" placeholder="Comment" class="pb-2" size="xl"/>
                        </div>
                    </div>
                    <div v-if="item.key === 'P'">
                        <div class="m-2 flex flex-col items-center">
                            <div class="flex flex-row">
                                <div class="pr-2 h-20 w-20">
                                    <img :src="imageLibrary.BroomImage" @click="Broomstate" class="cursor-pointer"/>
                                </div>
                                <div class="pr-2 h-20 w-20">
                                    <img :src="imageLibrary.BedImage" @click="Bedstate" class="cursor-pointer"/>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col mx-4 2xl:mx-0 items-center justify-center">
                                <UTextarea v-model="openedRoom.Pcomment" placeholder="Comment" class="pb-2" size="xl"/>
                        </div>
                    </div>
                    <div v-if="item.key === 'K'">
                        <div class="m-2 flex flex-col items-center">
                            <div class="flex flex-row">
                                <div class="pr-2 h-20 w-20">
                                    <img :src="imageLibrary.ShowerImage" @click="Showerstate" class="cursor-pointer"/>
                                </div>
                                <div class="pr-2 h-20 w-20">
                                    <img :src="imageLibrary.BidetImage" @click="Bidetstate" class="cursor-pointer"/>
                                </div>
                                <div class="pr-2 h-20 w-20">
                                    <img :src="imageLibrary.ToiletImage" @click="Toiletstate" class="cursor-pointer"/>
                                </div>
                            </div>
                            <div class="flex flex-row">
                                <div class="pr-2 h-20 w-20">
                                    <img :src="imageLibrary.SinkImage" @click="Sinkstate" class="cursor-pointer"/>
                                </div>
                                <div class="pr-2 h-20 w-20">
                                    <img :src="imageLibrary.RadiatorImage" @click="Radiatorstate" class="cursor-pointer"/>
                                </div>
                                <div class="pr-2 h-20 w-20">
                                    <img :src="imageLibrary.DoorImage" @click="Doorstate" class="cursor-pointer"/>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col mx-4 2xl:mx-0 items-center justify-center">
                                <UTextarea v-model="openedRoom.Kcomment" placeholder="Comment" class="pb-2" size="xl"/>
                        </div>
                    </div>
                    <div v-if="item.key === 'E'">
                        <div class="m-2 flex flex-col items-center">
                            <div class="flex flex-row">
                                <div class="pr-2 h-20 w-20">
                                    <img :src="imageLibrary.SocketImage" @click="Socketstate" class="cursor-pointer"/>
                                </div>
                                <div class="pr-2 h-20 w-20">
                                    <img :src="imageLibrary.BulbImage" @click="Bulbstate" class="cursor-pointer"/>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col mx-4 2xl:mx-0 items-center justify-center">
                                <UTextarea v-model="openedRoom.Ecomment" placeholder="Comment" class="pb-2" size="xl"/>
                        </div>
                    </div>
                    <div v-if="item.key === 'A'">
                        <div class="m-2 flex flex-col items-center">
                            <div class="flex flex-row">
                                <div class="pr-2 h-20 w-20">
                                    <img :src="imageLibrary.GuardImage" @click="Guardstate" class="cursor-pointer"/>
                                </div>
                                <div class="pr-2 h-20 w-20">
                                    <img :src="imageLibrary.AdminImage" @click="Adminstate" class="cursor-pointer"/>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col mx-4 2xl:mx-0 items-center justify-center">
                                <UTextarea v-model="openedRoom.Acomment" placeholder="Comment" class="pb-2" size="xl"/>
                        </div>
                    </div>
                </UCard>
            </template>
            <template #default="{item,index,selected}">
                <div class="flex items-center gap-2 relative truncate">
                    <UIcon :name="item.icon" class="w-4 h-4 flex-shrink-0" />
                    <span class="truncate">{{ item.key }}</span>

                    <span v-if="selected" class="absolute -right-4 w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400" />
                </div>
            </template>
        </UTabs>
    </UModal>
    <!-- corridors modal -->
    <UModal v-model="isOpenCorridorModal" class="w-60" :ui="{ container: 'items-start' }">
        <button></button>
        <div class="flex justify-center flex-col items-center p-6">
            <UInput v-model="openedCorridor.accessPointNumber" v-maska data-maska="#####" class="text-xl w-24 mb-2"
                placeholder="Room number" />
            <div>
                <img :src="imageLibrary.CorridorImage" @click="CorridorAPState" class="cursor-pointer">
            </div>
            <UInput v-model="openedCorridor.macAddress" v-maska data-maska="**:**:**:**:**:**" placeholder="MAC:Address" class="pb-2"/>
            <UInput v-model="openedCorridor.comment" placeholder="Comment"  />
            <div class="w-full justify-between flex mt-4">
                <UButton label="Submit" @click="submitCorridorEdit"></UButton>
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
const userPermissions = ref({})
const user = ref({})
const isAdmin = ref(false)
const isRoot = ref(false)
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
// Objects
const openedRoom = ref({})
const openedCorridor = ref({})
const imageLibrary = ref({})
// Modals vars
const isOpenRoomModal = ref(false)
const isOpenCorridorModal = ref(false)

// FIlters
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
                isRoot.value = userPermissions.value.root
            }
        })
    }
    const querry = useRoute().query
    floor_number.value = querry.floor_number
    getUser()
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
    let userGroup = user.value.group
    if (userGroup.it) {
        if (room.hasAccessPoint === "Yes" && room.hasBathPhone === "Yes" && room.hasBathPhone === "Yes" && room.hasTV === "Yes" && room.hasLock === "Yes") {
            return 'bg-green-500'
        }
        else if (room.hasAccessPoint === "No" || room.hasBathPhone === "No" || room.hasBathPhone === "No" || room.hasTV === "No" || room.hasLock === "No") {
            return 'bg-red-500'
        }
        else {
            return 'bg-gray-500'
        }
    }
    if (userGroup.pokojowki) {
        if (room.hasBroom === "Yes") {
            return 'bg-green-500'
        }
        else if (room.hasBroom === "No") {
            return 'bg-red-500'
        }
        else {
            return 'bg-gray-500'
        }
    }
    if (userGroup.hydraulicy) {
        if (room.hasSink === "Yes" && room.hasToilet === "Yes" && room.hasRadiator === "Yes" && room.hasBidet === "Yes" && room.hasShower === "Yes" && room.hasDoor === "Yes") {
            return 'bg-green-500'
        }
        else if (room.hasSink === "No" || room.hasToilet === "No" || room.hasRadiator === "No" || room.hasBidet === "No" || room.hasShower === "No" || room.hasDoor === "Yes") {
            return 'bg-red-500'
        }
        else {
            return 'bg-gray-500'
        }
    }
    if (userGroup.elektrycy) {
        if (room.hasSocket === "Yes" && room.hasBulb === "Yes") {
            return 'bg-green-500'
        }
        else if (room.hasSocket === "No" || room.hasBulb === "No") {
            return 'bg-red-500'
        }
        else {
            return 'bg-gray-500'
        }
    }
}
const openRoomModal = (room_number) => {
    room_number = rooms.value[room_number].room_number
    axios.post('/api/rooms/info', { "floor_number": floor_number.value, "room_number": room_number }).then((response) => {
        openedRoom.value.alarm = response.data.alarm
        openedRoom.value.hasLock = response.data.hasLock
        openedRoom.value = {
            "floor_number": floor_number.value,
            "room_number": room_number,
            "hasAccessPoint": response.data.hasAccessPoint,
            "hasBathPhone": response.data.hasBathPhone,
            "hasPhone": response.data.hasPhone,
            "hasTV": response.data.hasTV,
            "comment": response.data.comment,
            "macAddress": response.data.macAddress,
            "alarm": response.data.alarm,
            "hasLock": response.data.hasLock,
            "hasBroom": response.data.hasBroom,
            "hasSink": response.data.hasSink,
            "hasToilet": response.data.hasToilet,
            "hasRadiator": response.data.hasRadiator,
            "hasBidet": response.data.hasBidet,
            "hasShower": response.data.hasShower,
            "hasSocket": response.data.hasSocket,
            "hasBulb": response.data.hasBulb,
            "hasBed": response.data.hasBed,
            'hasGuard' : response.data.hasGuard,
            'hasAdmin' : response.data.hasAdmin,
            'hasDoor' : response.data.hasDoor,
            'Ecomment' : response.data.Ecomment,
            'Kcomment' : response.data.Kcomment,
            'Icomment' : response.data.Icomment,
            'Pcomment' : response.data.Pcomment,
            'Acomment' : response.data.Acomment,
        }

        switch(openedRoom.value.hasAccessPoint) {
            case "Yes":
                imageLibrary.value.AccessPointImage = '/img/pngs/wifi-green.png'
                break;
            case "No":
                imageLibrary.value.AccessPointImage = '/img/pngs/wifi-red.png'
                break;
            default:
                imageLibrary.value.AccessPointImage = '/img/pngs/wifi-gray.png'
                break;
        }
        switch(openedRoom.value.hasBathPhone) {
            case "Yes":
                imageLibrary.value.BathPhoneImage = '/img/pngs/bath-green.png'
                break;
            case "No":
                imageLibrary.value.BathPhoneImage = '/img/pngs/bath-red.png'
                break;
            default:
                imageLibrary.value.BathPhoneImage = '/img/pngs/bath-gray.png'
                break;
        }
        switch(openedRoom.value.hasPhone) {
            case "Yes":
                imageLibrary.value.PhoneImage = '/img/pngs/phone-green.png'
                break;
            case "No":
                imageLibrary.value.PhoneImage = '/img/pngs/phone-red.png'
                break;
            default:
                imageLibrary.value.PhoneImage = '/img/pngs/phone-gray.png'
                break;
        }
        switch(openedRoom.value.hasTV) {
            case "Yes":
                imageLibrary.value.TVImage = '/img/pngs/tv-green.png'
                break;
            case "No":
                imageLibrary.value.TVImage = '/img/pngs/tv-red.png'
                break;
            default:
                imageLibrary.value.TVImage = '/img/pngs/tv-gray.png'
                break;
        }
        switch(openedRoom.value.hasLock) {
            case "Yes":
                imageLibrary.value.LockImage = '/img/pngs/lock-green.png'
                break;
            case "No":
                imageLibrary.value.LockImage = '/img/pngs/lock-red.png'
                break;
            default:
                imageLibrary.value.LockImage = '/img/pngs/lock-gray.png'
                break;
        }
        switch(openedRoom.value.hasBroom) {
            case "Yes":
                imageLibrary.value.BroomImage = '/img/pngs/broom-green.png'
                break;
            case "No":
                imageLibrary.value.BroomImage = '/img/pngs/broom-red.png'
                break;
            default:
                imageLibrary.value.BroomImage = '/img/pngs/broom-gray.png'
                break;
        }
        switch(openedRoom.value.hasSink) {
            case "Yes":
                imageLibrary.value.SinkImage = '/img/pngs/sink-green.png'
                break;
            case "No":
                imageLibrary.value.SinkImage = '/img/pngs/sink-red.png'
                break;
            default:
                imageLibrary.value.SinkImage = '/img/pngs/sink-gray.png'
                break;
        }
        switch(openedRoom.value.hasToilet) {
            case "Yes":
                imageLibrary.value.ToiletImage = '/img/pngs/toilet-green.png'
                break;
            case "No":
                imageLibrary.value.ToiletImage = '/img/pngs/toilet-red.png'
                break;
            default:
                imageLibrary.value.ToiletImage = '/img/pngs/toilet-gray.png'
                break;
        }
        switch(openedRoom.value.hasRadiator) {
            case "Yes":
                imageLibrary.value.RadiatorImage = '/img/pngs/radiator-green.png'
                break;
            case "No":
                imageLibrary.value.RadiatorImage = '/img/pngs/radiator-red.png'
                break;
            default:
                imageLibrary.value.RadiatorImage = '/img/pngs/radiator-gray.png'
                break;
        }
        switch(openedRoom.value.hasBidet) {
            case "Yes":
                imageLibrary.value.BidetImage = '/img/pngs/bidet-green.png'
                break;
            case "No":
                imageLibrary.value.BidetImage = '/img/pngs/bidet-red.png'
                break;
            default:
                imageLibrary.value.BidetImage = '/img/pngs/bidet-gray.png'
                break;
        }
        switch(openedRoom.value.hasShower) {
            case "Yes":
                imageLibrary.value.ShowerImage = '/img/pngs/shower-green.png'
                break;
            case "No":
                imageLibrary.value.ShowerImage = '/img/pngs/shower-red.png'
                break;
            default:
                imageLibrary.value.ShowerImage = '/img/pngs/shower-gray.png'
                break;
        }
        switch(openedRoom.value.hasSocket) {
            case "Yes":
                imageLibrary.value.SocketImage = '/img/pngs/socket-green.png'
                break;
            case "No":
                imageLibrary.value.SocketImage = '/img/pngs/socket-red.png'
                break;
            default:
                imageLibrary.value.SocketImage = '/img/pngs/socket-gray.png'
                break;
        }
        switch(openedRoom.value.hasBulb) {
            case "Yes":
                imageLibrary.value.BulbImage = '/img/pngs/bulb-green.png'
                break;
            case "No":
                imageLibrary.value.BulbImage = '/img/pngs/bulb-red.png'
                break;
            default:
                imageLibrary.value.BulbImage = '/img/pngs/bulb-gray.png'
                break;
        }
        switch(openedRoom.value.hasBed) {
            case "Yes":
                imageLibrary.value.BedImage = '/img/pngs/bed-green.png'
                break;
            case "No":
                imageLibrary.value.BedImage = '/img/pngs/bed-red.png'
                break;
            default:
                imageLibrary.value.BedImage = '/img/pngs/bed-gray.png'
                break;
        }
        switch(openedRoom.value.hasGuard) {
            case "Yes":
                imageLibrary.value.GuardImage = '/img/pngs/guard-green.png'
                break;
            case "No":
                imageLibrary.value.GuardImage = '/img/pngs/guard-red.png'
                break;
            default:
                imageLibrary.value.GuardImage = '/img/pngs/guard-gray.png'
                break;
        }
        switch(openedRoom.value.hasAdmin) {
            case "Yes":
                imageLibrary.value.AdminImage = '/img/pngs/reception-green.png'
                break;
            case "No":
                imageLibrary.value.AdminImage = '/img/pngs/reception-red.png'
                break;
            default:
                imageLibrary.value.AdminImage = '/img/pngs/reception-gray.png'
                break;
        }
        switch(openedRoom.value.hasDoor) {
            case "Yes":
                imageLibrary.value.DoorImage = '/img/pngs/door-green.png'
                break;
            case "No":
                imageLibrary.value.DoorImage = '/img/pngs/door-red.png'
                break;
            default:
                imageLibrary.value.DoorImage = '/img/pngs/door-gray.png'
                break;
        }
    })
    openedRoom.value.defaultIndex = 0
    if (user.value.group.it) {
        openedRoom.value.defaultIndex = 2
    }
    else if (user.value.group.electrycy) {
        openedRoom.value.defaultIndex = 0
    }
    else if (user.value.group.hydraulicy) {
        openedRoom.value.defaultIndex = 1
    }
    else if (user.value.group.pokojowki) {
        openedRoom.value.defaultIndex = 3
    }
    isOpenRoomModal.value = true
}
const setCorridorAPColor = (corridorIndex) => {
    let corridorAP = corridors.value[corridorIndex]
    if (corridorAP.APStatus === 'Yes') {
        return 'bg-green-500'
    }
    else if (corridorAP.APStatus === 'No') {
        return 'bg-red-500'
    }
    else {
        return 'bg-gray-500'
    }
}
const OpenCorridorModal = (corridor_number) => {
    corridor_number = corridors.value[corridor_number].accessPointNumber
    axios.post('/api/corridors/info', { "floor_number": floor_number.value, "corridor_number": corridor_number }).then((response) => {
        openedCorridor.value.accessPointNumber = corridor_number
        openedCorridor.value.macAddress = response.data.macAddress
        openedCorridor.value.comment = response.data.comment
        openedCorridor.value.APStatus = response.data.APStatus
        switch(openedCorridor.value.APStatus) {
            case "Yes":
                imageLibrary.value.CorridorImage = '/img/pngs/wifi-green.png'
                break;
            case "No":
                imageLibrary.value.CorridorImage = '/img/pngs/wifi-red.png'
                break;
            default:
                imageLibrary.value.CorridorImage = '/img/pngs/wifi-gray.png'
                break;
        }
    })
    openedCorridor.value.AccessPointNumber = corridor_number
    isOpenCorridorModal.value = true
}
const setCinemaColor = () => {
    return 'bg-gray-500'
    // TODO: implement
}
const openCinemaModal = () => {
    // TODO: implement
}
// #region States
const TVstate = () => {
    if (openedRoom.value.hasTV === 'unknown') {
        openedRoom.value.hasTV = 'Yes'
        imageLibrary.value.TVImage = 'img/pngs/tv-green.png'
    }
    else if (openedRoom.value.hasTV === 'Yes') {
        openedRoom.value.hasTV = 'No'
        imageLibrary.value.TVImage = 'img/pngs/tv-red.png'
    }
    else {
        openedRoom.value.hasTV = 'unknown'
        imageLibrary.value.TVImage = 'img/pngs/tv-gray.png'
    }
}
const AcessPointstate = () => {
    if (openedRoom.value.hasAccessPoint === 'unknown') {
        openedRoom.value.hasAccessPoint = 'Yes'
        imageLibrary.value.AccessPointImage = 'img/pngs/wifi-green.png'
    }
    else if (openedRoom.value.hasAccessPoint === 'Yes') {
        openedRoom.value.hasAccessPoint = 'No'
        imageLibrary.value.AccessPointImage = 'img/pngs/wifi-red.png'
    }
    else {
        openedRoom.value.hasAccessPoint = 'unknown'
        imageLibrary.value.AccessPointImage = 'img/pngs/wifi-gray.png'
    }
}
const Phonestate = () => {
    if (openedRoom.value.hasPhone === 'unknown') {
        openedRoom.value.hasPhone = 'Yes'
        imageLibrary.value.PhoneImage = 'img/pngs/phone-green.png'
    }
    else if (openedRoom.value.hasPhone === 'Yes') {
        openedRoom.value.hasPhone = 'No'
        imageLibrary.value.PhoneImage = 'img/pngs/phone-red.png'
    }
    else {
        openedRoom.value.hasPhone = 'unknown'
        imageLibrary.value.PhoneImage = 'img/pngs/phone-gray.png'
    }
}
const BathPhonestate = () => {
    if (openedRoom.value.hasBathPhone === 'unknown') {
        openedRoom.value.hasBathPhone = 'Yes'
        imageLibrary.value.BathPhoneImage = 'img/pngs/bath-green.png'
    }
    else if (openedRoom.value.hasBathPhone === 'Yes') {
        openedRoom.value.hasBathPhone = 'No'
        imageLibrary.value.BathPhoneImage = 'img/pngs/bath-red.png'
    }
    else {
        openedRoom.value.hasBathPhone = 'unknown'
        imageLibrary.value.BathPhoneImage = 'img/pngs/bath-gray.png'
    }
}
const Lockstate = () => {
    if (openedRoom.value.hasLock === 'unknown') {
        openedRoom.value.hasLock = 'Yes'
        imageLibrary.value.LockImage = 'img/pngs/lock-green.png'
    }
    else if (openedRoom.value.hasLock === 'Yes') {
        openedRoom.value.hasLock = 'No'
        imageLibrary.value.LockImage = 'img/pngs/lock-red.png'
    }
    else {
        openedRoom.value.hasLock = 'unknown'
        imageLibrary.value.LockImage = 'img/pngs/lock-gray.png'
    }
}
const Broomstate = () => {
    if (openedRoom.value.hasBroom === 'unknown') {
        openedRoom.value.hasBroom = 'Yes'
        imageLibrary.value.BroomImage = 'img/pngs/broom-green.png'
    }
    else if (openedRoom.value.hasBroom === 'Yes') {
        openedRoom.value.hasBroom = 'No'
        imageLibrary.value.BroomImage = 'img/pngs/broom-red.png'
    }
    else {
        openedRoom.value.hasBroom = 'unknown'
        imageLibrary.value.BroomImage = 'img/pngs/broom-gray.png'
    }
}
const Bedstate = () => {
    if (openedRoom.value.hasBed === 'unknown') {
        openedRoom.value.hasBed = 'Yes'
        imageLibrary.value.BedImage = 'img/pngs/bed-green.png'
    }
    else if (openedRoom.value.hasBed === 'Yes') {
        openedRoom.value.hasBed = 'No'
        imageLibrary.value.BedImage = 'img/pngs/bed-red.png'
    }
    else {
        openedRoom.value.hasBed = 'unknown'
        imageLibrary.value.BedImage = 'img/pngs/bed-gray.png'
    
    }
}
const Sinkstate = () => {
    if (openedRoom.value.hasSink === 'unknown') {
        openedRoom.value.hasSink = 'Yes'
        imageLibrary.value.SinkImage = 'img/pngs/sink-green.png'
    }
    else if (openedRoom.value.hasSink === 'Yes') {
        openedRoom.value.hasSink = 'No'
        imageLibrary.value.SinkImage = 'img/pngs/sink-red.png'
    }
    else {
        openedRoom.value.hasSink = 'unknown'
        imageLibrary.value.SinkImage = 'img/pngs/sink-gray.png'
    }
}
const Toiletstate = () => {
    if (openedRoom.value.hasToilet === 'unknown') {
        openedRoom.value.hasToilet = 'Yes'
        imageLibrary.value.ToiletImage = 'img/pngs/toilet-green.png'
    }
    else if (openedRoom.value.hasToilet === 'Yes') {
        openedRoom.value.hasToilet = 'No'
        imageLibrary.value.ToiletImage = 'img/pngs/toilet-red.png'
    }
    else {
        openedRoom.value.hasToilet = 'unknown'
        imageLibrary.value.ToiletImage = 'img/pngs/toilet-gray.png'
    }
}
const Radiatorstate = () => {
    if (openedRoom.value.hasRadiator === 'unknown') {
        openedRoom.value.hasRadiator = 'Yes'
        imageLibrary.value.RadiatorImage = 'img/pngs/radiator-green.png'
    }
    else if (openedRoom.value.hasRadiator === 'Yes') {
        openedRoom.value.hasRadiator = 'No'
        imageLibrary.value.RadiatorImage = 'img/pngs/radiator-red.png'
    }
    else {
        openedRoom.value.hasRadiator = 'unknown'
        imageLibrary.value.RadiatorImage = 'img/pngs/radiator-gray.png'
    }
}
const Bidetstate = () => {
    if (openedRoom.value.hasBidet === 'unknown') {
        openedRoom.value.hasBidet = 'Yes'
        imageLibrary.value.BidetImage = 'img/pngs/bidet-green.png'
    }
    else if (openedRoom.value.hasBidet === 'Yes') {
        openedRoom.value.hasBidet = 'No'
        imageLibrary.value.BidetImage = 'img/pngs/bidet-red.png'
    }
    else {
        openedRoom.value.hasBidet = 'unknown'
        imageLibrary.value.BidetImage = 'img/pngs/bidet-gray.png'
    }
}
const Showerstate = () => {
    if (openedRoom.value.hasShower === 'unknown') {
        openedRoom.value.hasShower = 'Yes'
        imageLibrary.value.ShowerImage = 'img/pngs/shower-green.png'
    }
    else if (openedRoom.value.hasShower === 'Yes') {
        openedRoom.value.hasShower = 'No'
        imageLibrary.value.ShowerImage = 'img/pngs/shower-red.png'
    }
    else {
        openedRoom.value.hasShower = 'unknown'
        imageLibrary.value.ShowerImage = 'img/pngs/shower-gray.png'
    }
}
const Socketstate = () => {
    if (openedRoom.value.hasSocket === 'unknown') {
        openedRoom.value.hasSocket = 'Yes'
        imageLibrary.value.SocketImage = 'img/pngs/socket-green.png'
    }
    else if (openedRoom.value.hasSocket === 'Yes') {
        openedRoom.value.hasSocket = 'No'
        imageLibrary.value.SocketImage = 'img/pngs/socket-red.png'
    }
    else {
        openedRoom.value.hasSocket = 'unknown'
        imageLibrary.value.SocketImage = 'img/pngs/socket-gray.png'
    }
}
const Bulbstate = () => {
    if (openedRoom.value.hasBulb === 'unknown') {
        openedRoom.value.hasBulb = 'Yes'
        imageLibrary.value.BulbImage = 'img/pngs/bulb-green.png'
    }
    else if (openedRoom.value.hasBulb === 'Yes') {
        openedRoom.value.hasBulb = 'No'
        imageLibrary.value.BulbImage = 'img/pngs/bulb-red.png'
    }
    else {
        openedRoom.value.hasBulb = 'unknown'
        imageLibrary.value.BulbImage = 'img/pngs/bulb-gray.png'
    }
}
const CorridorAPState = () => {
    if (openedCorridor.value.APStatus === 'unknown') {
        openedCorridor.value.APStatus = 'Yes'
        imageLibrary.value.CorridorImage = 'img/pngs/wifi-green.png'
    }
    else if (openedCorridor.value.APStatus === 'Yes') {
        openedCorridor.value.APStatus = 'No'
        imageLibrary.value.CorridorImage = 'img/pngs/wifi-red.png'
    }
    else {
        openedCorridor.value.APStatus = 'unknown'
        imageLibrary.value.CorridorImage = 'img/pngs/wifi-gray.png'
    }
}
const Guardstate = () => {
    if (openedRoom.value.hasGuard === 'unknown') {
        openedRoom.value.hasGuard = 'Yes'
        imageLibrary.value.GuardImage = 'img/pngs/guard-green.png'
    }
    else if (openedRoom.value.hasGuard === 'Yes') {
        openedRoom.value.hasGuard = 'No'
        imageLibrary.value.GuardImage = 'img/pngs/guard-red.png'
    }
    else {
        openedRoom.value.hasGuard = 'unknown'
        imageLibrary.value.GuardImage = 'img/pngs/guard-gray.png'
    }
}
const Adminstate = () => {
    if (openedRoom.value.hasAdmin === 'unknown') {
        openedRoom.value.hasAdmin = 'Yes'
        imageLibrary.value.AdminImage = 'img/pngs/reception-green.png'
    }
    else if (openedRoom.value.hasAdmin === 'Yes') {
        openedRoom.value.hasAdmin = 'No'
        imageLibrary.value.AdminImage = 'img/pngs/reception-red.png'
    }
    else {
        openedRoom.value.hasAdmin = 'unknown'
        imageLibrary.value.AdminImage = 'img/pngs/reception-gray.png'
    }
}
const Doorstate = () => {
    if (openedRoom.value.hasDoor === 'unknown') {
        openedRoom.value.hasDoor = 'Yes'
        imageLibrary.value.DoorImage = 'img/pngs/door-green.png'
    }
    else if (openedRoom.value.hasDoor === 'Yes') {
        openedRoom.value.hasDoor = 'No'
        imageLibrary.value.DoorImage = 'img/pngs/door-red.png'
    }
    else {
        openedRoom.value.hasDoor = 'unknown'
        imageLibrary.value.DoorImage = 'img/pngs/door-gray.png'
    }
}
// #endregion

const submitEdit = () => {
    axios.post('/api/rooms/modify', { "floor_number": floor_number.value, "room_number": openedRoom.value.room_number, 
                                        "hasAccessPoint": openedRoom.value.hasAccessPoint, "hasBathPhone": openedRoom.value.hasBathPhone, 
                                        "hasPhone": openedRoom.value.hasPhone, "hasTV": openedRoom.value.hasTV, 
                                        "comment": openedRoom.value.comment, "macAddress": openedRoom.value.macAddress, 
                                        "alarm" : openedRoom.value.alarm, "hasLock" : openedRoom.value.hasLock,
                                        "hasBroom" : openedRoom.value.hasBroom, "hasSink" : openedRoom.value.hasSink,
                                        "hasToilet" : openedRoom.value.hasToilet, "hasRadiator" : openedRoom.value.hasRadiator,
                                        "hasBidet" : openedRoom.value.hasBidet, "hasShower" : openedRoom.value.hasShower,
                                        "hasSocket" : openedRoom.value.hasSocket, "hasBulb" : openedRoom.value.hasBulb,
                                        'hasBed' : openedRoom.value.hasBed, 'hasGuard' : openedRoom.value.hasGuard,
                                        'hasAdmin' : openedRoom.value.hasAdmin, 'hasDoor': openedRoom.value.hasDoor,
                                        'Ecomment' : openedRoom.value.Ecomment, 'Kcomment' : openedRoom.value.Kcomment, 
                                        'Icomment' : openedRoom.value.Icomment, 'Pcomment' : openedRoom.value.Pcomment, 
                                        'Acomment' : openedRoom.value.Acomment
                                    })
    .then((response) => {
        getFloorInfo()
        isOpenRoomModal.value = false
    })
}
const submitCorridorEdit = () => {
    axios.post('/api/corridors/modify',{ "floor_number": floor_number.value, "accessPointNumber": openedCorridor.value.accessPointNumber, "macAddress": openedCorridor.value.macAddress, "comment": openedCorridor.value.comment, "APStatus" : openedCorridor.value.APStatus }).then((response) => {
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
// region Open/Close
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
// endregion

const applyGreen = () => {
    greenFilter.value = !greenFilter.value
    refreshFilter()
}
const applyRed = () => {
    redFilter.value = !redFilter.value
    refreshFilter()
}
const applyGrey = () => {
    grayFilter.value = !grayFilter.value
    refreshFilter()
}
const refreshFilter = () => {
    rooms.value = []
    corridors.value = []
    console.log(user.value.group)
    if (greenFilter.value) {
        savedRooms.value.forEach((value) => {
            if (user.value.group.it) {
                if (value.hasAccessPoint === "Yes" && value.hasBathPhone === "Yes" && value.hasPhone === "Yes" && value.hasTV === "Yes" && value.hasLock === "Yes") {
                    rooms.value.push(value)
                }
            }
            if (user.value.group.pokojowki) {
                if (value.hasBroom === "Yes" && value.hasBed === "Yes") {
                    rooms.value.push(value)
                }
            }
            if (user.value.group.hydraulicy) {
                if (value.hasSink === "Yes" && value.hasToilet === "Yes" && value.hasRadiator === "Yes" && value.hasBidet === "Yes" && value.hasShower === "Yes" && value.hasDoor === "Yes") {
                    rooms.value.push(value)
                }
            }
            if (user.value.group.elektrycy) {
                if (value.hasSocket === "Yes" && value.hasBulb === "Yes") {
                    rooms.value.push(value)
                }
            }
        })
    }
    if (redFilter.value) {
        savedRooms.value.forEach((value) => {
            if (user.value.group.it) {
                if (value.hasAccessPoint === "No" || value.hasBathPhone === "No" || value.hasPhone === "No" || value.hasTV === "No" || value.hasLock === "No") {
                    rooms.value.push(value)
                }
            }
            if (user.value.group.pokojowki) {
                if (value.hasBroom === "No" || value.hasBed === "No") {
                    rooms.value.push(value)
                }
            }
            if (user.value.group.hydraulicy) {
                if (value.hasSink === "No" || value.hasToilet === "No" || value.hasRadiator === "No" || value.hasBidet === "No" || value.hasShower === "No") {
                    rooms.value.push(value)
                }
            }
            if (user.value.group.elektrycy) {
                if (value.hasSocket === "No" || value.hasBulb === "No") {
                    rooms.value.push(value)
                }
            }
        })
    }
    if (grayFilter.value) {
        savedRooms.value.forEach((value) => {
            if (user.value.group.it) {
                if (value.hasAccessPoint === "unknown" || value.hasBathPhone === "unknown" || value.hasPhone === "unknown" || value.hasTV === "unknown" || value.hasLock === "unknown") {
                    rooms.value.push(value)
                }
            }
            if (user.value.group.pokojowki) {
                if (value.hasBroom === "unknown" || value.hasBed === "unknown") {
                    rooms.value.push(value)
                }
            }
            if (user.value.group.hydraulicy) {
                if (value.hasSink === "unknown" || value.hasToilet === "unknown" || value.hasRadiator === "unknown" || value.hasBidet === "unknown" || value.hasShower === "unknown") {
                    rooms.value.push(value)
                }
            }
            if (user.value.group.elektrycy) {
                if (value.hasSocket === "unknown" || value.hasBulb === "unknown") {
                    rooms.value.push(value)
                }
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
const toggleAlarm = () => {
    openedRoom.value.alarm = !openedRoom.value.alarm
}
const requestEdit = () => {
    axios.post('/api/telegram/notify', { "floor_number": floor_number.value, "room_number": openedRoom.value.room_number, 
                                        "hasAccessPoint": openedRoom.value.hasAccessPoint, "hasBathPhone": openedRoom.value.hasBathPhone, 
                                        "hasPhone": openedRoom.value.hasPhone, "hasTV": openedRoom.value.hasTV,
                                        "macAddress": openedRoom.value.macAddress, 
                                        "alarm" : openedRoom.value.alarm, "hasLock" : openedRoom.value.hasLock,
                                        "hasBroom" : openedRoom.value.hasBroom, "hasSink" : openedRoom.value.hasSink,
                                        "hasToilet" : openedRoom.value.hasToilet, "hasRadiator" : openedRoom.value.hasRadiator,
                                        "hasBidet" : openedRoom.value.hasBidet, "hasShower" : openedRoom.value.hasShower,
                                        "hasSocket" : openedRoom.value.hasSocket, "hasBulb" : openedRoom.value.hasBulb,
                                        'hasBed' : openedRoom.value.hasBed, 'hasAdmin' : openedRoom.value.hasAdmin,
                                        'hasGuard' : openedRoom.value.hasGuard, 'Ecomment' : openedRoom.value.Ecomment,
                                        'Kcomment' : openedRoom.value.Kcomment, 'Icomment' : openedRoom.value.Icomment,
                                        'Pcomment' : openedRoom.value.Pcomment, 'Acomment' : openedRoom.value.Acomment,
                                        'hasDoor' : openedRoom.value.hasDoor})
    .then((response) => {
        getFloorInfo()
        isOpenRoomModal.value = false
    })

}
const roomModalItems = [
    {
        label: "Elektrycy",
        icon: "i-heroicons-bolt-20-solid",
        key: 'E'
    },
    {
        label: "Hydraulicy",
        icon: 'i-heroicons-wrench-screwdriver-20-solid',
        key: 'K'
    },
    {
        label: 'Informatycy',
        icon: 'i-heroicons-wifi-20-solid',
        key: 'I'
    },
    {
        label: "Pokojówki",
        icon: 'i-ion-bed',
        key: 'P'
    },
    {
        label: "Administacja",
        icon: 'i-material-symbols-notifications-active',
        key: 'A'
    },/*
    {
        label: "Konserwatorzy",
        icon: 'i-heroicons-wrench-screwdriver-20-solid',
        key: 'ks'
    },*/
]
const getUser = () => {
    const token = useCookie('token').value
    axios.get('/api/users/').then((response) => {
        let users = response.data
        user.value = users.find(user => user.token == token)
    })
}
const eShouldDisplay = (index) => {
    let room = rooms.value[index]
    if (room.hasSocket === "No" || room.hasBulb === "No") {
        return true
    }
    else {
        return false
    }
}
const kShouldDisplay = (index) => {
    let room = rooms.value[index]
    if (room.hasSink === "No" || room.hasToilet === "No" || room.hasRadiator === "No" || room.hasBidet === "No" || room.hasShower === "No") {
        return true
    }
    else {
        return false
    }
}
const iShouldDisplay = (index) => {
    let room = rooms.value[index]
    if (room.hasAccessPoint === "No" || room.hasBathPhone === "No" || room.hasPhone === "No" || room.hasTV === "No" || room.hasLock === "No") {
        return true
    }
    else {
        return false
    }
}
const pShouldDisplay = (index) => {
    let room = rooms.value[index]
    if (room.hasBroom === "No") {
        return true
    }
    else {
        return false
    }
}
const aShouldDisplay = (index) => {
    let room = rooms.value[index]
    if (room.hasAdmin === "No" || room.hasGuard === "No") {
        return true
    }
    else {
        return false
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
@keyframes alarm {
    0% {
        color:rgb(239 68 68); /* bg-red-500 */
    }
    50% {
        color: #fff; /* bg-gray-500 */
    }
    100% {
        color: rgb(239 68 68); /* bg-red-500 */
    }
}
.alarm {
    animation: alarm 1s infinite;
}
</style>