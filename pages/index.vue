<template>
    <div class="flex m-8 flex-col">
    <div class="flex flex-col">
        <UModal v-model="isOpen" class="w-60" :ui="{ container: 'items-start' }">
            <div class="p-8 flex flex-col">
                <UInput color="white" variant="outline" placeholder="Login" v-model="login" class="pt-4"></UInput>
                <UInput color="white" variant="outline" placeholder="Password" v-model="password" class="pt-4"></UInput>
                <UButton block label="Login" @click="onLoginFormSubmit" class="mt-4 align-middle self-center"></UButton>
            </div>
        </UModal>
        <UModal v-model="isOpenRoomModal" class="w-60" :ui="{ container: 'items-start' }">
            <div class="p-6 flex justify-center flex-col items-center">
                <UInput v-model="openedRoomNumber" class="text-xl w-24" placeholder="Room number"/>
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
                        <UInput v-model="openedRoomAcessPointMAC" v-maska data-maska="**:**:**:**:**:**" placeholder="MAC:Address"/>
                    </div>
                    <UButton label="Cancel" color="red" @click="isOpenRoomModal = false"></UButton>
                </div>
            </div>
        </UModal>
        <div class="flex items-end justify-end" v-if="!islogged">
            <UButton label="Login" @click="isOpen = true" class="self-end items-end justify-end"></UButton>
        </div>
        <div class="flex items-end justify-end" v-if="islogged">
            <UButton label="Log out" @click="deleteCookie" class="self-end items-end justify-end"></UButton>
        </div>
    </div>
    <div class="flex flex-col items-center">
        <span class="text-4xl justify-center prevent_select">Piętra</span>
        <div v-if="pending">Loading...</div>
        <div v-else class="w-full flex flex-col-reverse">
            <div class="text-2xl bg-black rounded-3xl flex text-center justify-center h-16 items-center cursor-pointer" @click="addFloor">
                <span class="self-center text-5xl font-black">+</span>
            </div>
            <div v-for="(floor,floor_index) in floors" :key="floor_index">
                <div class="text-2xl bg-black rounded-3xl flex justify-center items-center cursor-pointer flex-col px-6 my-4 w-full">
                    <span class="self-center my-4 prevent_select" @click="toggleFloorMenu(floor_index)">Piętro #{{ floor.floor_number }}</span>
                    <div
                        v-if="openFloorIndex === floor_index"
                        class="grid 2xl:grid-cols-5 grid-cols-3 w-full place-items-center justify-center"
                    >
                    <div
                        v-for="(room, roomIndex) in floor.rooms"
                        :key="roomIndex"
                        class="mb-6 room-card text-white flex items-center justify-center rounded-lg cursor-pointer w-20 h-20  xl:w-24 xl:h-24 text-l xl:text-sm 2xl:text-2xl flex-grow bg-gray-800"
                        :class="setRoomColor(roomIndex)"
                        @click="openRoomModal(floor_index,roomIndex)"
                    >
                        # {{ room.room_number }}
                    </div>
                    <div
                        class="xl:w-24 xl:h-24 w-20 h-20  mb-6 room-card bg-gray-800 text-white flex items-center justify-center rounded-lg cursor-pointer"
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

const login = ref('')
const password = ref('')

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

const toast = useToast()

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
    }
    // load floors from api
    loadFloors()
})

const loadFloors = () => {
    axios.get('/api/floors').then((response) => {
        const new_floors = response.data.body.sort((a,b) => a.floor_number - b.floor_number)
        new_floors.forEach(floor => {
            floor.rooms.sort((a,b) => a.room_number - b.room_number)
        });
        floors.value = new_floors
        pending.value = false
    })
}
const onLoginFormSubmit = () => {
    axios.post('/api/users/login', {
        login: login.value,
        password: password.value
    }).then((response) => {
        if (response.status === 202) {
            useCookie('token', response.data.token)
            islogged.value = true
            toast.add({
                icon: "i-heroicons-check-circle",
                description: "Sucessfully logged in.",
                id: "onLoginFormSubmit",
                timeout: 6000,
                title: "Login",
            })
            isOpen.value = false
        }
        else {
            toast.add({
                icon: "i-heroicons-exclamation",
                color: "red",
                description: "Wrong login or password.",
                id: "onLoginFormSubmit",
                timeout: 6000,
                title: "Login",
            })
        }
    })
}
const deleteCookie = () => {
    let cookie = useCookie('token')
    cookie.value = null
    islogged.value = false
}
const addFloor = () => {
    axios.post('/api/floors').then((response) => {
        loadFloors()
    })
}
const toggleFloorMenu = (index) => {
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
        console.log(response.data)
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
        return 'bg-gray-800'
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