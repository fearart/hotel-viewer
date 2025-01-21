<template>
    <div class="flex m-2 flex-col font-gost">
    <div class="flex flex-col">
        <UModal v-model="isOpenRoomModal" class="w-60" :ui="{ container: 'items-start' }">
            <div class="flex justify-center flex-col items-center p-6">
                <UInput v-model="openedRoomNumber" v-maska data-maska="#####" class="text-xl w-24 mb-2" placeholder="Room number"/>
                <UInput v-model="openedRoomAcessPointMAC" v-maska data-maska="**:**:**:**:**:**" placeholder="MAC:Address"/>
                <div class="m-2 flex flex-col">
                    <div class="flex flex-row">
                        <div class="pr-2">
                            <img v-if="isAcessPointGreen()" src="~/assets/pngs/wifi-green.png" @click="AcessPointstate" class="cursor-pointer"/>
                            <img v-if="isAcessPointGray()" src="~/assets/pngs/wifi-gray.png" @click="AcessPointstate" class="cursor-pointer"/>
                            <img v-if="isAcessPointRed()" src="~/assets/pngs/wifi-red.png" @click="AcessPointstate" class="cursor-pointer"/>
                        </div>
                        <div class="pr-2">
                            <img v-if="isTvGreen()" src="~/assets/pngs/tv-green.png" @click="TVstate" class="cursor-pointer"/>
                            <img v-if="isTvGray()" src="~/assets/pngs/tv-gray.png" @click="TVstate" class="cursor-pointer"/>
                            <img v-if="isTvRed()" src="~/assets/pngs/tv-red.png" @click="TVstate" class="cursor-pointer"/>
                        </div>
                    </div>
                    <div class="flex flex-row">
                        <div class="pr-2">
                            <img v-if="isBathPhoneGreen()" src="~/assets/pngs/bath-green.png" @click="BathPhonestate" class="cursor-pointer"/>
                            <img v-if="isBathPhoneGray()" src="~/assets/pngs/bath-gray.png" @click="BathPhonestate" class="cursor-pointer"/>
                            <img v-if="isBathPhoneRed()" src="~/assets/pngs/bath-red.png" @click="BathPhonestate" class="cursor-pointer"/>
                        </div>
                        <div>
                            <img v-if="isPhoneGreen()" src="~/assets/pngs/phone-green.png" @click="Phonestate" class="cursor-pointer"/>
                            <img v-if="isPhoneGray()" src="~/assets/pngs/phone-gray.png" @click="Phonestate" class="cursor-pointer"/>
                            <img v-if="isPhoneRed()" src="~/assets/pngs/phone-red.png" @click="Phonestate" class="cursor-pointer"/>
                        </div>
                    </div>
                </div>
                <div class="w-full justify-between flex mt-4">
                    <UButton label="Submit" @click="submitEdit"></UButton>
                    <div class="flex flex-col mx-4 2xl:mx-0">
                        <UInput v-model="openedRoomComment" placeholder="Comment" class="pb-2"/>
                    </div>
                    
                    <UButton label="Cancel" color="red" @click="isOpenRoomModal = false"></UButton>
                </div>
            </div>
        </UModal>
        <!-- Outdated login
            <div class="flex items-end justify-end" v-if="!islogged">
                <UButton label="Login" @click="isOpen = true" class="self-end items-end justify-end"></UButton>
            </div>
        -->
        <!--
        <div class="flex items-end justify-end" v-if="islogged">
            <ClientOnly>
                <UButton
                :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
                color="gray"
                variant="ghost"
                aria-label="Theme"
                @click="isDark = !isDark"
                class="mr-2"
                />

                <template #fallback>
                <div class="w-8 h-8" />
                </template>
            </ClientOnly>
            <UButton label="Log out" @click="deleteCookie" class="self-end items-end justify-end"></UButton>
        </div>
        -->
    </div>
    <div class="flex flex-col items-center">
        <div v-if="pending && islogged">Loading...</div>
        <div v-else class="w-full flex flex-col-reverse justify-center">
            <div v-if="islogged" class="text-2xl rounded-3xl flex text-center justify-center h-16 items-center cursor-pointer" @click="addFloor">
                <span class="self-center text-5xl font-black">+</span>
            </div>
            <div v-for="(floor,floor_index) in floors" :key="floor_index">
                <div class="text-2xl outline-2 rounded-3xl flex justify-center items-center cursor-pointer flex-col dark:bg-gray-800 w-60 mb-4">
                    <span class="self-center my-4 prevent_select" @click="toggleFloorMenu(floor_index)">Piętro {{ floor.floor_number }}</span>
                    <div
                        v-if="openFloorIndex === floor_index"
                        class="grid 2xl:grid-cols-12 xl:grid-cols-10 grid-cols-6 w-full place-items-center justify-center"
                    >
                    <div
                        v-for="(room, roomIndex) in floor.rooms"
                        :key="roomIndex"
                        class="mb-3 room-card text-white flex items-center justify-center rounded-lg cursor-pointer w-12 h-12  xl:w-24 xl:h-24 text-sm xl:text-sm 2xl:text-2xl flex-grow bg-gray-500"
                        :class="setRoomColor(roomIndex)"
                        @click="openRoomModal(floor_index,roomIndex)"
                    >
                        {{ room.room_number }}
                    </div>
                    <div
                        class="xl:w-24 xl:h-24 w-12 h-12  mb-6 room-card bg-gray-500 text-white flex items-center justify-center rounded-lg cursor-pointer"
                        @click="createNew(floor_index)"
                    >
                        <span class="text-center text-6xl">+</span>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
</template>
<style scoped>

</style>

<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';

const islogged = ref(false)
const isOpen = ref(false)
const isOpenRoomModal = ref(false)
const colorMode = useColorMode()

const isDark = computed({
  get () {
    return colorMode.value === 'dark'
  },
  set () {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})


const floors = ref([])
const pending = ref(true)
const openFloorIndex = ref(null)

const openedRoomNumber = ref(0)
const openedRoomFloorNumber = ref(0)
const openedRoomHasTV = ref('NoData')
const openedRoomHasPhone = ref('NoData')
const openedRoomHasBathPhone = ref('NoData')
const openedRoomHasAcessPoint= ref('NoData')
const openedRoomComment = ref('NoData')
const openedRoomAcessPointMAC = ref('NoData')

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

onMounted(async () => {
    const tokenCookie = useCookie('token')
    if (typeof(tokenCookie.value) === 'string') {
        islogged.value = true
        loadFloors()
    }
    else {
        navigateTo('/login')
    }
    // load floors from api
})

const loadFloors = () => {
    axios.get('/api/floors').then((response) => {
        const new_floors = response.data.body.sort((a,b) => a.floor_number - b.floor_number)
        floors.value = new_floors
        pending.value = false
    })
}
const deleteCookie = () => {
    let cookie = useCookie('token')
    cookie.value = null
    islogged.value = false
    navigateTo('/login')
}
const addFloor = () => {
    axios.post('/api/floors').then((response) => {
        loadFloors()
    })
}
const toggleFloorMenu = (index) => {
    navigateTo(`/floor?floor_number=${index+1}`)
    reloadNuxtApp({
        path: `/floor?floor_number=${index+1}`,
        ttl: 1000, // default 10000
    });
    return
    openFloorIndex.value = openFloorIndex.value === index ? null : index
}
const createNew = (index) => {
    axios.put('/api/rooms/create',{"floor_number" : index+1}).then((response) => {
        loadFloors()
    })
}
const openRoomModal = (floor_number,room_number) => {
    openedRoomFloorNumber.value = floor_number
    room_number = floors.value[floor_number].rooms[room_number].room_number
    axios.post('/api/rooms/info',{"floor_number" : floor_number, "room_number" : room_number}).then((response) => {
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
const submitEdit = () => {
    axios.post('/api/rooms/modify',{"floor_number" : openedRoomFloorNumber.value, "room_number" : openedRoomNumber.value, "hasAccessPoint" : openedRoomHasAcessPoint.value, "hasBathPhone" : openedRoomHasBathPhone.value, "hasPhone" : openedRoomHasPhone.value, "hasTV" : openedRoomHasTV.value, "comment" : openedRoomComment.value, "macAddress" : openedRoomAcessPointMAC.value}).then((response) => {
        loadFloors()
        isOpenRoomModal.value = false
    })
}

const setRoomColor = (roomIndex) => {
    let room = floors.value[openFloorIndex.value].rooms[roomIndex]
    if (room.hasTV === 'unknown' && room.hasPhone === 'unknown' && room.hasBathPhone === 'unknown' && room.hasAccessPoint === 'unknown') {
        return 'bg-gray-500'
    }
    else if (room.hasTV === 'Yes' && room.hasPhone === 'Yes' && room.hasBathPhone === 'Yes' && room.hasAccessPoint === 'Yes') {
        return 'bg-green-500'
    }
    else {
        return 'bg-red-500'
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



</script>

<style scoped>
.prevent_select {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
}
.unknown {
    background-color: rgb(58, 58, 58);
}
.no {
    background-color: red;
}
.yes {
    background-color: rgb(42, 250, 0);
}
</style>