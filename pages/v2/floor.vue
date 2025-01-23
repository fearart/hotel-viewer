<template>
  <div class="flex flex-col p-4 items-center w-full montserrat">
      <div class="flex flex-col">
          <h1 class="text-3xl justify-center w-full min-w-32 text-center">Piętro {{ floor_number }}</h1>
          <div class="flex flex-row justify-between">
              <div id="green-filter" class="w-4 h-4 bg-green-500 rounded-sm cursor-pointer" @click="applyGreen">
                  
              </div>
              <div id="red-filter" class="w-4 h-4 bg-red-500 rounded-sm cursor-pointer" @click="applyRed">

              </div>
              <div id="gray-filter" class="w-4 h-4 bg-gray-500 rounded-sm cursor-pointer" @click="applyGrey">
                  
              </div>
              <UIcon name="i-material-symbols:find-in-page" class="w-4 h-4 cursor-pointer" @click="openSearchForm"/>
              <div  class="w-4 h-4 bg-sky-500 rounded-sm cursor-pointer p-0 m-0 text-center" @click=""><p class="text-xs">I</p></div>
          </div>
      </div>
      <UDivider class="prevent-select my-4 cursor-pointer " @click="toggleRooms"><div class="flex flex-col align-center"><p>Pokoje [{{ rooms.length }}]</p> <p>{{ calculateRoomsPercentage() }}% </p></div></UDivider>
      <div v-if="displayRooms"
          class="grid 2xl:grid-cols-12 xl:grid-cols-10 grid-cols-6 w-full place-items-center justify-center h-full"
          >
          <div v-if="displayRooms" v-for="(room, roomIndex) in rooms" :key="roomIndex"
              class="mb-3 room-card text-white flex-col flex items-center justify-center rounded-lg cursor-pointer w-12 h-12  xl:w-24 xl:h-24 text-sm xl:text-sm 2xl:text-2xl flex-grow bg-gray-500"
              :class="[setRoomColor(roomIndex), room.alarm ? 'alarm' : '']" @click="openRoomModal(roomIndex)">
              {{ room.roomNumber }}
              <div class="flex flex-row 2xl:w-2/3 w-5/6 justify-center text-center text-sm 2xl:pt-4">
                  <p class="w-1/5" v-if="eShouldDisplay(roomIndex)">E</p>
                  <p class="w-1/5" v-if="kShouldDisplay(roomIndex)">K</p>
                  <p class="w-1/5" v-if="iShouldDisplay(roomIndex)">I</p>
                  <p class="w-1/5" v-if="pShouldDisplay(roomIndex)">P</p>
                  <p class="w-1/2" v-if="roomAccepted(roomIndex)">✓</p>
              </div>
          </div>
          <div class="xl:w-24 xl:h-24 w-12 h-12  mb-3 room-card bg-gray-500 text-white flex items-center justify-center rounded-lg cursor-pointer"
              @click="createNewRoom()" v-if="isAdmin">
              <span class="text-center text-6xl">+</span>
          </div>
      </div>
      <UDivider class="prevent-select my-4 cursor-pointer" @click="toggleCorridor">Korytarz [{{ corridors.length }}]</UDivider>
      <div v-if="displayCorridor"
          class="grid 2xl:grid-cols-12 xl:grid-cols-10 grid-cols-6 w-full place-items-center justify-center h-full">
          <div v-if="displayCorridor"
              v-for="(corridor, corridorIndex) in corridors" 
              :key="corridorIndex"
              class="mb-3 room-card text-white flex-col flex items-center justify-center rounded-lg cursor-pointer w-12 h-12  xl:w-24 xl:h-24 text-sm xl:text-sm 2xl:text-2xl flex-grow bg-gray-500"
              :class="setCorridorAPColor(corridorIndex), (corridor.alarm ? 'alarm' : '')"
              @click="OpenCorridorModal(corridorIndex)">
              {{ corridor.corridorNumber }}
              <div class="flex flex-row 2xl:w-2/3 w-5/6 justify-center text-center text-sm 2xl:pt-4">
                  <p class="w-1/5" v-if="eShouldDisplayCorridor(corridorIndex,corridors)">E</p>
                  <p class="w-1/5" v-if="iShouldDisplayCorridor(corridorIndex,corridors)">I</p>
              </div>
          </div>
          <div class="xl:w-24 xl:h-24 w-12 h-12  mb-3 room-card bg-gray-500 text-white flex items-center justify-center rounded-lg cursor-pointer"
              @click="createNewCorridorAcessPoint()" v-if="isAdmin">
              <span class="text-center text-6xl">+</span>
          </div>
      </div>
      <UDivider class="prevent-select my-4 cursor-pointer" @click="toggleCinemas">Kina</UDivider>
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
      <UDivider class="prevent-select my-4 cursor-pointer" @click="toggleConferenceRooms">Sale konferencyjne</UDivider>
      <UDivider class="prevent-select my-4 cursor-pointer" @click="toggleRestaurants">Restauracje</UDivider>
      <UDivider class="prevent-select my-4 cursor-pointer">Bawialni</UDivider>
      <UDivider class="prevent-select my-4 cursor-pointer" @click="toggleKitchens">Kuchnie</UDivider>
      <div v-if="displayKitchens">
          <div v-for="(kitchen, kitchegnIndex) in kitchens" :key="kitchenIndex" 
              class="mb-3 room-card text-white flex items-center justify-center rounded-lg cursor-pointer w-12 h-12  xl:w-24 xl:h-24 text-sm xl:text-sm 2xl:text-2xl flex-grow bg-gray-500"
              @click="openKitchenModal(kitchen.name)"
              >
              {{ kitchen.name}}
          </div>
          <div class="xl:w-24 xl:h-24 w-12 h-12  mb-3 room-card bg-gray-500 text-white flex items-center justify-center rounded-lg cursor-pointer"
              @click="createNewKitchen()"
              v-if="isAdmin"
              >
              <span class="text-center text-6xl">+</span>
          </div>
      </div>
  </div>
  <!-- rooms modal-->
  <RoomModal v-model:isOpen="isOpenRoomModal" @close="handleRoomClose" @update:isOpenRoom="handleRoomClose" :user="user" :activeRoom="openedRoom"/>
  <!-- corridors modal -->
  <CorridorModal v-model:isOpen="isOpenCorridorModal" @close="handleCorridorClose" @update:isOpen="handleCorridorClose" :user="user" :activeCorridor="openedCorridor"/>
  <!-- photo gallery modal -->
  <UModal v-model="isOpenPhotoGallery" class="w-60" :ui="{ container: 'items-start' }">
      <div class="flex flex-col p-4">
          <div class="flex justify-end w-full">
              <UButton label="Zamknij okno" icon="i-heroicons-x-mark" color="red" variant="ghost" @click="isOpenPhotoGallery = false" class="right-0 top-0 m-2"/>
          </div>
          <div v-for="(image,imageIndex) in roomImages" class="p-4">
              <div class="border-sky-400 border-y-2 flex flex-col">
                  <div class="w-full justify-end flex">
                      <UButton label="Usuń" icon="i-heroicons-x-mark" color="red" variant="ghost" @click="deleteImage(imageIndex)"></UButton>
                  </div>
                  <img :src="image" class="mt-2">
              </div>
          </div>
          <div class="loader" v-if="roomImageLoading">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
          </div>
          <p v-if="roomImages.length === 0 && !roomImageLoading">Brak zdjęć w bazie</p>
      </div>
  </UModal>
  <!-- kitchen modal -->
  <UModal v-model="isOpenKitchenModal" class="w-60" :ui="{ container: 'items-start'}">
  <div class="p-4">
      <button></button>
      <div class="flex justify-center flex-col items-center">
          <div class="w-full justify-around flex mt-4">
              <UButton label="Submit" @click="submitKitchenEdit"></UButton>
              <UButton label="Cancel" color="red" @click="isOpenKitchenModal = false"></UButton>
          </div>
          <UInput v-model="openedKitchen.name" class="text-xl w-24 mb-2"
              placeholder="Kitchen name" />
          <div>
              <!-- params -->
          </div>
          <UInput v-model="openedKitchen.comment" placeholder="Comment"  />
      </div>
      <div class="flex flex-row justify-evenly mt-4">
          <form>
              <div class="file-input">
                  <input
                      type="file"
                      name="file-input"
                      id="file-input"
                      class="file-input__input"
                      v-on:change="kitchenFileUpload"
                  />
                  <label class="file-input__label" for="file-input">
                      <svg
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="upload"
                      class="svg-inline--fa fa-upload fa-w-16"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      >
                      <path
                          fill="currentColor"
                          d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"
                      ></path>
                      </svg>
                      <span>Dodaj zdjęcie</span>
                  </label>
              </div>
          </form>
          <UButton label="Zdjęcia" icon="i-heroicons-photo-16-solid" @click="openKitchenGallery"/>
      </div>
  </div>
  </UModal>
  <!-- kitchen gallery modal -->
  <UModal v-model="isOpenKitchenGallery" class="w-60" :ui="{container: 'items-start'}">
      <div class="flex flex-col p-4">
          <div class="flex justify-end w-full">
              <UButton label="Zamknij okno" icon="i-heroicons-x-mark" color="red" variant="ghost" @click="isOpenKitchenGallery = false" class="right-0 top-0 m-2"/>
          </div>
          <div v-for="(image,imageIndex) in kitchenImages" class="p-4">
              <div class="border-sky-400 border-y-2 flex flex-col">
                  <div class="w-full justify-end flex">
                      <UButton label="Usuń" icon="i-heroicons-x-mark" color="red" variant="ghost" @click="deleteKitchenImage(imageIndex)"></UButton>
                  </div>
                  <img :src="image" class="mt-2">
              </div>
          </div>
          <div class="loader" v-if="roomImageLoading">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
          </div>
          <p v-if="kitchenImages.length === 0 && !roomImageLoading">Brak zdjęć w bazie</p>
      </div>
  </UModal>
  <!-- Mac Search -->
  <UModal v-model="isOpenSearchForm" class="w-60" :ui="{container: 'items-start'}">
      <div class="p-4">
          <button></button>
          <div class="flex flex-col space-y-4">
          <div class="flex justify-center w-full">Znajdź urządzenie za MAC</div>
              <UInput v-model="searchMac" v-maska data-maska="**:**:**:**:**:**" placeholder="MAC:Address" class="pb-2"/>
              <UButton label="Szukaj" @click="searchMacAddress"></UButton>
          </div>
          <div v-if="currentFoundMac.type !== null" class="mt-4 text-center w-full">
              <p v-if="currentFoundMac.type == 'room'">-P-{{ currentFoundMac.data.room_number }}</p>
              <p v-else-if="currentFoundMac.type == 'corridor'">-K-{{ currentFoundMac.data.accessPointNumber }}</p>
              <p v-else>Brak wyników</p>
          </div>
      </div>
  </UModal>
</template>
<script setup lang="ts">
import CorridorModal from '@/modals/CorridorModal.vue';
import RoomModal from '@/modals/RoomModal.vue';
import axios from 'axios';
import { eShouldDisplayCorridor, iShouldDisplayCorridor } from '@/utilities/corridorUtilities'
import type { User } from '~/types/user';
import type { Room } from '~/types/room';
import type { Corridor } from '~/types/corridor';
// Base data
const floor_number = ref(0)
const floor = ref(null)
const rooms = ref<Room[]>([])
const savedRooms = ref<Room[]>([])
const corridors = ref<Corridor[]>([])
const savedCorridors = ref<Corridor[]>([])
const userPermissions = ref({})
const user = ref<User>({})
const isAdmin = ref(false)
const isRoot = ref(false)
const enhancedMode = ref(false)
const timeout = ref(null)
const toast = useToast()
defineEmits(['closeCorridorModal'])
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

const hasKitchens = ref(false)
const displayKitchens = ref(false)

// useless shit
const hide_naxuy_cinema = ref(false)
const hide_naxuy_corridor = ref(false)
const hide_naxuy_rooms = ref(false)
const hide_naxuy_conference_rooms = ref(false)
const hide_naxuy_restaurants = ref(false)
const hide_naxuy_kitchens = ref(false)
// Objects
// @ts-ignore
const openedRoom = ref<Room>({})
// @ts-ignore
const openedCorridor = ref<Corridor>({})
// @ts-ignore
const openedKitchen = ref({})
const roomImages = ref([])
const roomImageLoading = ref(false) 
const currentFoundMac = ref({})
const searchMac = ref("")

const kitchenImages = ref([])
// Modals vars
const isOpenPhotoGallery = ref(false)
const isOpenRoomModal = ref(false)
const isOpenCorridorModal = ref(false)
const isOpenKitchenModal = ref(false)
const isOpenKitchenGallery = ref(false)
const isOpenSearchForm = ref(false)
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
const getFloorInfo = async () => {
  try {
    const response = await $fetch('/api/floors/')
    const floors = response.body
    floor.value = floors.find(floor => floor.floor_number == floor_number.value)
    
    if (typeof (floor.value.rooms) !== undefined) {
      rooms.value = floor.value.rooms
      rooms.value.sort((a, b) => a.roomNumber - b.roomNumber)
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
      corridors.value.sort((a, b) => a.corridorNumber - b.corridorNumber)
      savedCorridors.value = corridors.value
    }

    if (typeof (floor.value.kitchens) !== undefined) {
      hasKitchens.value = true
      kitchens.value = floor.value.kitchens
      console.log(kitchens.value[0])
    }
  } catch (error) {
    console.log(error)
  }
}
const setRoomColor = (roomIndex: number) => {
  let room = rooms.value[roomIndex] as Room;
  let userGroup = user.value.group
  if (userGroup.it) {   
    let { _id, Icomment, macAddress, ...values} = room.informatycy
    if (Object.values(values).every(value => value === "Yes")) {
      return 'bg-green-500'
    }
    else if (Object.values(values).some(value => value === "No")) {
      return 'bg-red-500'
    }
    else {
      return 'bg-gray-500'
    }
  }

  if (userGroup.pokojowki) {
    let { _id, Pcomment, ...values} = room.pokojowe
    if (Object.values(values).every(value => value === "Yes")) {
      return 'bg-green-500'
    }
    else if (Object.values(values).some(value => value === "No")) {
      return 'bg-red-500'
    }
    else {
      return 'bg-gray-500'
    }   
  }
  if (userGroup.konserwatorzy) {
    let { _id, Kcomment, ...values} = room.konserwatorzy
    if (Object.values(values).every(value => value === "Yes")) {
      return 'bg-green-500'
    }
    else if (Object.values(values).some(value => value === "No")) {
      return 'bg-red-500'
    }
    else {
      return 'bg-gray-500'
    }
  }
  if (userGroup.elektrycy) {
    let { _id, Ecomment, ...values} = room.elektrycy
    if (Object.values(values).every(value => value === "Yes")) {
      return 'bg-green-500'
    }
    else if (Object.values(values).some(value => value === "No")) {
      return 'bg-red-500'
    }
    else {
      return 'bg-gray-500'
    }   
  }
}
const openRoomModal = (roomIndex: number) => {
  axios.post('/api/rooms/info', { "floorNumber": floor_number.value, "roomNumber": rooms.value[roomIndex].roomNumber }).then((response) => {
    const res = response.data
    openedRoom.value = res
    openedRoom.value.floorNumber = floor_number.value
    isOpenRoomModal.value = true
  })
}
const handleRoomClose = () => {
  isOpenRoomModal.value = false
  getFloorInfo()
}   
const openSearchForm = () => {
  isOpenSearchForm.value = !isOpenSearchForm.value
}
const setCorridorAPColor = (corridorIndex: number) => {
  let corridorObject = corridors.value[corridorIndex]
  let userGroup = user.value.group
  if (userGroup.it) {
    if (!iShouldDisplayCorridor(corridorIndex,corridors.value)) {
      return 'bg-green-500'
    }
    else if (Object.values(corridorObject.informatycy).some(value => value === "No")) {
      return 'bg-red-500'
    }
    else {
      return 'bg-gray-500'
    }
  }
}
const OpenCorridorModal = (corridorIndex: number) => {
  axios.post('/api/corridors/info', { "floorNumber": floor_number.value, "corridorNumber": corridors.value[corridorIndex].corridorNumber }).then((response) => {
    const corridor = response.data
    openedCorridor.value = corridor
    openedCorridor.value.floorNumber = floor_number.value
    isOpenCorridorModal.value = true
  })
}
const handleCorridorClose= () => {
  isOpenCorridorModal.value = false
  getFloorInfo()
}
const openKitchenModal = (kitchen_name) => {
  let kitchen = {}
  kitchens.value.forEach((k) => {
      if (k.name === kitchen_name) {
          kitchen = k
          return
      }
  })
  openedKitchen.value = kitchen
  isOpenKitchenModal.value = true
}
const setCinemaColor = () => {
  return 'bg-gray-500'
  // TODO: implement
}
const openCinemaModal = () => {
  // TODO: implement
}

const submitKitchenEdit = () => {
  axios.post('/api/kitchen/modify',{'floor_number': floor_number.value, "name" : openedKitchen.value.name, "comment" : openedKitchen.value.comment}).then((response) => {
      getFloorInfo()
      isOpenKitchenModal.value = false
  }) 
}
const createNewRoom = () => {
  axios.put('/api/rooms/create', { "floorNumber": floor_number.value }).then((response) => {
      getFloorInfo()
  })
}
const createNewCorridorAcessPoint = () => {
  axios.put('/api/corridors/create', { "floor_number": floor_number.value }).then((response) => {
      getFloorInfo()
  })
}
const createNewKitchen = () => {
  axios.put('/api/kitchens/create', { "floor_number": floor_number.value }).then((response) => {
      getFloorInfo()
  })

}
// #region Open/Close
const toggleRooms = () => {
  displayRooms.value = !displayRooms.value
}
const toggleCorridor = () => {
  displayCorridor.value = !displayCorridor.value
}
const toggleCinemas = () => {
  displayCinemas.value = !displayCinemas.value
}
const toggleConferenceRooms = () => {
  displayConferenceRooms.value = !displayConferenceRooms.value
}
const toggleRestaurants = () => {
  displayRestaurants.value = !displayRestaurants.value
}
const togglePlayrooms = () => {
  displayPlayrooms.value = !displayPlayrooms.value
}
const toggleKitchens = () => {
  displayKitchens.value = !displayKitchens.value
}

// #endregion

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
  if (greenFilter.value) {
      savedRooms.value.forEach((value) => {
          if (user.value.group.it) {
              let { _id, Icomment, macAddress, ...values} = value.informatycy
              if (Object.values(values).every(value => value === "Yes")) {
                  rooms.value.push(value)
              } 
          }
          if (user.value.group.pokojowki) {
              let { _id, Pcomment, ...values} = value.pokojowe
              if (Object.values(values).every(value => value === "Yes")) {
                  rooms.value.push(value)
              }
          }
          if (user.value.group.hydraulicy) {
              let { _id, Hcomment, ...values} = value.hydraulicy
              if (Object.values(values).every(value => value === "Yes")) {
                  rooms.value.push(value)
              }
          }
          if (user.value.group.elektrycy) {
              let { _id, Ecomment, ...values} = value.elektrycy
              if (Object.values(values).every(value => value === "Yes")) {
                  rooms.value.push(value)
              }
          }
      })
  }
  if (redFilter.value) {
      savedRooms.value.forEach((value) => {
          if (user.value.group.it) {
              let { _id, Icomment, macAddress, ...values} = value.informatycy
              if (Object.values(values).some(value => value === "No")) {
                  rooms.value.push(value)
              }
          }
          if (user.value.group.pokojowki) {
              let { _id, Pcomment, ...values} = value.pokojowe
              if (Object.values(values).some(value => value === "No")) {
                  rooms.value.push(value)
              }
          }
          if (user.value.group.konserwatorzy) {
              let { _id, Hcomment, ...values} = value.konserwatorzy
              if (Object.values(values).some(value => value === "No")) {
                  rooms.value.push(value)
              }
          }
          if (user.value.group.elektrycy) {
              let { _id, Ecomment, ...values} = value.elektrycy
              if (Object.values(values).some(value => value === "No")) {
                  rooms.value.push(value)
              }
          }
      })
  }
  if (grayFilter.value) {
      savedRooms.value.forEach((value) => {
          if (user.value.group.it) {
              let { _id, Icomment, macAddress, ...values} = value.informatycy
              if (Object.values(values).some(value => value === "unknown")) {
                  rooms.value.push(value)
              }
          }
          if (user.value.group.pokojowki) {
              let { _id, Pcomment, ...values} = value.pokojowe
              if (Object.values(values).some(value => value === "unknown")) {
                  rooms.value.push(value)
              }
          }
          if (user.value.group.konserwatorzy) {
              let { _id, Kcomment, ...values} = value.konserwatorzy
              if (Object.values(values).some(value => value === "unknown")) {
                  rooms.value.push(value)
              }
          }
          if (user.value.group.elektrycy) {
              let { _id, Ecomment, ...values} = value.elektrycy
              if (Object.values(values).some(value => value === "unknown")) {
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
      return a.roomNumber - b.roomNumber
  })
  corridors.value.sort((a, b) => {
      return a.corridorNumber - b.corridorNumber
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
const searchMacAddress = () => {
  axios.post('/api/search/mac',{'macAddress' : searchMac.value.toUpperCase()}).then((response) => {
      console.log(response)
      if (Object.keys(response.data).length === 0){
          currentFoundMac.value = {
              'data' : null,
              'type' : null
          }
          console.log("found nothing")
          return
      }
      if (response.data.type === "room") {
          currentFoundMac.value = {
              'data' : response.data,
              'type' : 'room'
          }
      }
      else if (response.data.type === "corridor") {
          currentFoundMac.value = {
              'data' : response.data,
              'type' : 'corridor'
          }
      }
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
      user.value = users.find((user : User) => user.token == token)
  })
}
const eShouldDisplay = (index: number) => {
  let room = rooms.value[index] as Room;
  const { Ecomment, _id, ...params } = room.elektrycy;
  
  for (const key in params) {
    if (params[key as keyof typeof params] !== "Yes") {
      return true;
    }
  }
  return false;
}
const kShouldDisplay = (index: number) => {
  let room = rooms.value[index] as Room;
  const { Kcomment, _id, ...params } = room.konserwatorzy;
  for (const key in params) {
    if (params[key as keyof typeof params] !== "Yes") {
        console.log(params[key as keyof typeof params])
      return true;
    }
  }
  return false;
}
const iShouldDisplay = (index: number) => {
  let room = rooms.value[index] as Room;
  const { Icomment, macAddress, _id, ...params } = room.informatycy;
  console.log(params)
  for (const key in params) {
    if (params[key as keyof typeof params] !== "Yes") {
      return true;
    }
  }
  return false;
}
const pShouldDisplay = (index: number) => {
  let room = rooms.value[index] as Room;
  const { Pcomment, _id, ...params } = room.pokojowe;
  for (const key in params) {
    if (params[key as keyof typeof params] !== "Yes") {
      return true;
    }
  }
  return false;
}
const aShouldDisplay = (index: number) => {
  let room = rooms.value[index] as Room;
  const { Acomment, ...params } = room.administracja;
  for (const key in params) {
    if (params[key as keyof typeof params] !== "Yes") {
      return true;
    }
  }
  return false;
}

const roomFileUpload = (event) => {
  const file = event.target.files[0]
  const formData = new FormData()
  formData.append('file', file)
  formData.append('room_number', openedRoom.value.room_number)
  formData.append('token', useCookie('token').value)
  axios.post('/api/image', formData, {
      headers: {
          'Content-Type': 'multipart/form-data',
          'type' : "room"
      }

  }).then((response) => {
      getFloorInfo()
          toast.add({
          color: "green",
          description: "Zdjęnie dodane",
          id: "imgadded",
          timeout: 3000,
          title: "Success",
      })
  })
}
const kitchenFileUpload = (event) => {
  const file = event.target.files[0]
  const formData = new FormData()
  formData.append('file', file)
  formData.append('kitchen_name', openedKitchen.value.name)
  formData.append('token', useCookie('token').value)
  formData.append('floor_number', floor_number.value)
  axios.post('/api/image', formData, {
      headers: {
          'Content-Type': 'multipart/form-data',
          'type' : "kitchen"
      }

  }).then((response) => {
      getFloorInfo()
          toast.add({
          color: "green",
          description: "Zdjęnie dodane",
          id: "imgadded",
          timeout: 3000,
          title: "Success",
      })
  })

}
const openPhotoGallery = () => {
  roomImages.value = []
  roomImageLoading.value = true
  axios.post('/api/image/get', { "room_number": openedRoom.value.room_number }).then((response) => {
      response.data.forEach((image) => {
          roomImages.value.push(`data:image/webp;base64,${image}`)
      })
  })
  roomImageLoading.value = false
  isOpenPhotoGallery.value = true
  isOpenRoomModal.value = false
}
const openKitchenGallery = () => {
  kitchenImages.value = []
  roomImageLoading.value = true
  axios.post('/api/image/getkitchen', {"floor_number" : floor_number.value, "kitchen_name": openedKitchen.value.name }).then((response) => {
      response.data.forEach((image) => {
          kitchenImages.value.push(`data:image/webp;base64,${image}`)
      })
  })
  roomImageLoading.value = false
  isOpenKitchenGallery.value = true
  isOpenKitchenModal.value = false
}
const deleteImage = (imageIndex: number) => {
  axios.post('/api/image/delete', { "imageIndex": imageIndex, 'room_number': openedRoom.value.room_number },
  {
      headers: {
          'type' : 'room'
      }
  }).then((response) => {
      getFloorInfo()
      isOpenPhotoGallery.value = false
      isOpenRoomModal.value = true
  })
}
const deleteKitchenImage = (imageIndex: number) => {
  axios.post('/api/image/delete', { "imageIndex": imageIndex, 'floor_number': floor_number.value, 'kitchen_name': openedKitchen.value.name },
  {
      headers: {
          'type' : 'kitchen'
      }
  }).then((response) => {
      getFloorInfo()
      isOpenKitchenGallery.value = false
      isOpenKitchenModal.value = true
  })
}

const calculateRoomsPercentage = () => {
  let total_rooms = Number.parseInt(rooms.value.length);
  let okay_rooms = 0;
  
  for (let room of rooms.value) {
    const { elektrycy, konserwatorzy, informatycy, pokojowe, administracja } = room;
    
    // Filter out _id and macAddress fields before checking values
    const isElektrycyOk = Object.entries(elektrycy)
      .filter(([key]) => !['_id', 'Ecomment'].includes(key))
      .every(([, value]) => value === "Yes");
      
    const isKonserwatorzyOk = Object.entries(konserwatorzy)
      .filter(([key]) => !['_id', 'Kcomment'].includes(key))
      .every(([, value]) => value === "Yes");
      
    const isInformatycyOk = Object.entries(informatycy)
      .filter(([key]) => !['_id', 'macAddress', 'Icomment'].includes(key))
      .every(([, value]) => value === "Yes");
      
    const isPokojoweOk = Object.entries(pokojowe)
      .filter(([key]) => !['_id', 'Pcomment'].includes(key))
      .every(([, value]) => value === "Yes");

    if (isElektrycyOk && isKonserwatorzyOk && isInformatycyOk && isPokojoweOk) {
      okay_rooms++;
    }
  }
  return String(Number.parseFloat((okay_rooms / total_rooms) * 100).toFixed(2));
}
const calculateCorridorsPercentage = () => {
  let total_corridors = Number.parseInt(corridors.value.length);
  let okay_corridors = 0;

  for (let corridor of corridors.value) {
    const isInformatycyOk = Object.entries(corridor.informatycy)
      .filter(([key]) => !['_id', 'macAddress', 'Icomment'].includes(key))
      .every(([, value]) => value === "Yes");

    if (isInformatycyOk) {
      okay_corridors++;
    }
  }
  return String(Number.parseFloat((okay_corridors / total_corridors) * 100).toFixed(2));
}
const roomAccepted = (index: number) => {
  let room = rooms.value[index] as Room;
  return room.administracja.isApproved === 'Yes';
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
<style scoped lang="scss">
.file-input__input {
width: 0.1px;
height: 0.1px;
opacity: 0;
overflow: hidden;
position: absolute;
z-index: -1;
}

.file-input__label {
min-width: 150px;
cursor: pointer;
display: inline-flex;
justify-content: center;
align-items: center;
border-radius: 4px;
font-size: 14px;
font-weight: 600;
color: #4245A8;
font-size: 14px;
padding: 10px 12px;
border: 2px dotted #4245A8;
}

.file-input__label:hover {
background-color: rgba(66, 69, 168, 0.25);
}

.file-input__label svg {
height: 16px;
margin-right: 4px;
}

</style>
<style scoped>
.loader {
  position: relative;
  left: 50%;
}

.dot {
  position: absolute;
  height: 1rem;
  width: 1rem;
  border-radius: 50%;
  background-color: #fff;
  animation: bounce 1.3s linear infinite;
}

.dot:nth-child(1) {
  left: -1.5rem;
}

.dot:nth-child(2) {
  animation-delay: -1s;
}

.dot:nth-child(3) {
  right: -2.5rem;
  animation-delay: -0.8s;
}

@keyframes bounce {
  0%,
  66%,
  100% {
      transform: initial;
  }

  33% {
      transform: translatey(-1rem);
  }
}

</style>
