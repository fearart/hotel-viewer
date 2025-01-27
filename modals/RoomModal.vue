<template>
    <UModal v-model="props.isOpen" class="w-60" :ui="{ container: 'items-start' }">
      <button></button>
      <UTabs :items="modalItems" :default-index="calculateDefaultIndex()" class="px-2 mt-2">
          <template #item="{ item }">
              <UCard @submit.prevent class="mb-2">
                  <template #header>
                      <div class="flex flex-row h-10 w-full justify-center">
                          <UButton v-if="props.user.permissions.admin" label="Submit" @click="submitEdit"></UButton>
                          <UButton label="Cancel" color="red" class="ml-2" @click="emitClose"></UButton>
                          <UInput v-model="props.activeRoom.roomNumber" v-maska data-maska="#####" class="text-xl w-24 mb-2 mx-2"
                          placeholder="Room number" size="xl"/>
                          <UButton v-if="props.activeRoom.alarm" icon="i-heroicons-bell" color="red" @click="toggleAlarm" class="mr-2"/>
                          <UButton v-else icon="i-heroicons-bell" color="gray" @click="toggleAlarm" class="mr-2"/>
                          <UButton label="" @click="requestEdit" class="mr-2">
                              <img src="~/assets/svg/tg-white.png" class="w-6 h-6">
                          </UButton>
                          <UButton label="✔" color="green" @click="setEverythingGreen"></UButton>
                      </div>
                  </template>
                  <div v-if="item.key === 'I'" class="flex justify-center flex-col items-center p-6">
                      <UInput v-model="props.activeRoom.informatycy.macAddress" placeholder="MAC:Address" /> 
                      <div class="m-2 flex flex-col items-center">
                          <div class="flex flex-row">
                              <div class="pr-2 h-20 w-20">
                                  <img :src="loadImages('AccessPoint', props.activeRoom.informatycy.hasAccessPoint)" @click="SwitchStates('AccessPoint', props.activeRoom.informatycy.hasAccessPoint,'informatycy')" class="cursor-pointer"/>
                              </div>
                              <div class="pr-2 h-20 w-20">
                                  <img :src="loadImages('TV', props.activeRoom.informatycy.hasTV)" @click="SwitchStates('TV', props.activeRoom.informatycy.hasTV,'informatycy')" class="cursor-pointer">
                              </div>
                              <div class="h-20 w-20">
                                  <img :src="loadImages('Lock', props.activeRoom.informatycy.hasLock)" @click="SwitchStates('Lock', props.activeRoom.informatycy.hasLock,'informatycy')" class="cursor-pointer"/>
                              </div>
                          </div>
                          <div class="flex flex-row">
                              <div class="h-20 w-20">
                                  <img :src="loadImages('Phone', props.activeRoom.informatycy.hasPhone)" @click="SwitchStates('Phone', props.activeRoom.informatycy.hasPhone,'informatycy')" class="cursor-pointer"/>
                              </div>
                              <div class="pr-2 h-20 w-20">
                                  <img :src="loadImages('BathPhone', props.activeRoom.informatycy.hasBathPhone)" @click="SwitchStates('BathPhone', props.activeRoom.informatycy.hasBathPhone,'informatycy')" class="cursor-pointer">
                              </div>
                          </div>
                        </div>
                      <div class="flex flex-col mx-4 2xl:mx-0 items-center justify-center">
                              <UTextarea v-model="props.activeRoom.informatycy.Icomment" placeholder="Comment" class="pb-2" size="xl"/>
                      </div>
                  </div>
                  <div v-if="item.key === 'P'">
                      <div class="m-2 flex flex-col items-center">
                          <div class="flex flex-row">
                              <div class="pr-2 h-20 w-20">
                                  <img :src="loadImages('Carpet', props.activeRoom.pokojowe.hasCarpet)" @click="SwitchStates('Carpet', props.activeRoom.pokojowe.hasCarpet,'pokojowe')" class="cursor-pointer"/>
                              </div>
                              <div class="pr-2 h-20 w-20">
                                  <img :src="loadImages('Bed', props.activeRoom.pokojowe.hasBed)" @click="SwitchStates('Bed', props.activeRoom.pokojowe.hasBed,'pokojowe')" class="cursor-pointer"/>
                              </div>
                              <div class="pr-2 h-20 w-20">
                                  <img :src="loadImages('Curtains', props.activeRoom.pokojowe.hasCurtains)" @click="SwitchStates('Curtains', props.activeRoom.pokojowe.hasCurtains,'pokojowe')" class="cursor-pointer"/>
                              </div>
                          </div>
                          <div class="flex flex-row">
                              <div class="pr-2 h-20 w-20">
                                  <img :src="loadImages('Safe', props.activeRoom.pokojowe.hasSafe)" @click="SwitchStates('Safe', props.activeRoom.pokojowe.hasSafe,'pokojowe')" class="cursor-pointer"/>
                              </div>
                              <div class="pr-2 h-20 w-20">
                                  <img :src="loadImages('Broom', props.activeRoom.pokojowe.hasBroom)" @click="SwitchStates('Broom', props.activeRoom.pokojowe.hasBroom,'pokojowe')" class="cursor-pointer"/>
                              </div>
                              <div class="pr-2 h-20 w-20">
                                  <img :src="loadImages('Painting', props.activeRoom.pokojowe.hasPainting)" @click="SwitchStates('Painting', props.activeRoom.pokojowe.hasPainting,'pokojowe')" class="cursor-pointer"/>
                              </div>
                              <div class="pr-2 h-20 w-20">
                                  <img :src="loadImages('Kettle', props.activeRoom.pokojowe.hasKettle)" @click="SwitchStates('Kettle', props.activeRoom.pokojowe.hasKettle,'pokojowe')" class="cursor-pointer"/>
                              </div>
                          </div>
                      </div>
                      <div class="flex flex-col mx-4 2xl:mx-0 items-center justify-center">
                                <UTextarea v-model="props.activeRoom.pokojowe.Pcomment" placeholder="Comment" class="pb-2" size="xl"/>
                      </div>
                  </div>
                  <div v-if="item.key === 'K'">
                      <div class="m-2 flex flex-col items-center">
                          <div class="flex flex-row">
                            <div class="pr-2 h-20 w-20">
                                <img :src="loadImages('Sink', props.activeRoom.konserwatorzy.hasSink)" @click="SwitchStates('Sink', props.activeRoom.konserwatorzy.hasSink,'konserwatorzy')" class="cursor-pointer"/>
                            </div>
                            <div class="pr-2 h-20 w-20">
                                <img :src="loadImages('Toilet', props.activeRoom.konserwatorzy.hasToilet)" @click="SwitchStates('Toilet', props.activeRoom.konserwatorzy.hasToilet,'konserwatorzy')" class="cursor-pointer"/>
                            </div>
                            <div class="pr-2 h-20 w-20">
                                  <img :src="loadImages('Radiator', props.activeRoom.konserwatorzy.hasRadiator)" @click="SwitchStates('Radiator', props.activeRoom.konserwatorzy.hasRadiator,'konserwatorzy')" class="cursor-pointer"/>
                            </div>
                            <div class="pr-2 h-20 w-20">
                                <img :src="loadImages('Bidet', props.activeRoom.konserwatorzy.hasBidet)" @click="SwitchStates('Bidet', props.activeRoom.konserwatorzy.hasBidet,'konserwatorzy')" class="cursor-pointer"/>
                            </div>
                            
                          </div>
                          <div class="flex flex-row">
                            <div class="pr-2 h-20 w-20">
                                <img :src="loadImages('Shower', props.activeRoom.konserwatorzy.hasShower)" @click="SwitchStates('Shower', props.activeRoom.konserwatorzy.hasShower,'konserwatorzy')" class="cursor-pointer"/>
                            </div>
                            <div class="pr-2 h-20 w-20">
                                <img :src="loadImages('Wallpaper', props.activeRoom.konserwatorzy.hasWallpaper)" @click="SwitchStates('Wallpaper', props.activeRoom.konserwatorzy.hasWallpaper,'konserwatorzy')" class="cursor-pointer"/>
                            </div>
                            <div class="pr-2 h-20 w-20">
                                <img :src="loadImages('Tiles', props.activeRoom.konserwatorzy.hasTiles)" @click="SwitchStates('Tiles', props.activeRoom.konserwatorzy.hasTiles,'konserwatorzy')" class="cursor-pointer"/>
                            </div>
                            <div class="pr-2 h-20 w-20">
                                <img :src="loadImages('Door', props.activeRoom.konserwatorzy.hasDoor)" @click="SwitchStates('Door', props.activeRoom.konserwatorzy.hasDoor,'konserwatorzy')" class="cursor-pointer"/>
                            </div>
                        </div>
                          <div class="flex flex-row">
                            <div class="pr-2 h-20 w-20">
                                <img :src="loadImages('Silicone', props.activeRoom.konserwatorzy.hasSilicone)" @click="SwitchStates('Silicone', props.activeRoom.konserwatorzy.hasSilicone,'konserwatorzy')" class="cursor-pointer"/>
                            </div>
                            <div class="pr-2 h-20 w-20">
                                <img :src="loadImages('Ceiling', props.activeRoom.konserwatorzy.hasCeiling)" @click="SwitchStates('Ceiling', props.activeRoom.konserwatorzy.hasCeiling,'konserwatorzy')" class="cursor-pointer"/>
                            </div>
                            <div class="pr-2 h-20 w-20">
                                <img :src="loadImages('Vent', props.activeRoom.konserwatorzy.hasVent)" @click="SwitchStates('Vent', props.activeRoom.konserwatorzy.hasVent,'konserwatorzy')" class="cursor-pointer"/>
                            </div>
                            <div class="pr-2 h-20 w-20">
                                <img :src="loadImages('RevisionDoor', props.activeRoom.konserwatorzy.hasRevisionDoor)" @click="SwitchStates('RevisionDoor', props.activeRoom.konserwatorzy.hasRevisionDoor,'konserwatorzy')" class="cursor-pointer"/>
                            </div>
                          </div>
                          <div class="flex flex-row">
                            <div class="pr-2 h-20 w-20">
                                <img :src="loadImages('ToiletDoor', props.activeRoom.konserwatorzy.hasToiletDoor)" @click="SwitchStates('ToiletDoor', props.activeRoom.konserwatorzy.hasToiletDoor,'konserwatorzy')" class="cursor-pointer"/>
                            </div>
                            <div class="pr-2 h-20 w-20">
                                <img :src="loadImages('Window', props.activeRoom.konserwatorzy.hasWindow)" @click="SwitchStates('Window', props.activeRoom.konserwatorzy.hasWindow,'konserwatorzy')" class="cursor-pointer"/>
                            </div>
                            <div class="pr-2 h-20 w-20">
                                <img :src="loadImages('CeilingPainting', props.activeRoom.konserwatorzy.hasCeilingPainting)" @click="SwitchStates('CeilingPainting', props.activeRoom.konserwatorzy.hasCeilingPainting,'konserwatorzy')" class="cursor-pointer"/>
                            </div>
                            <div class="pr-2 h-20 w-20">
                                <img :src="loadImages('Drain', props.activeRoom.konserwatorzy.hasDrain)" @click="SwitchStates('Drain', props.activeRoom.konserwatorzy.hasDrain,'konserwatorzy')" class="cursor-pointer"/>
                            </div>
                            <div class="pr-2 h-20 w-20">
                                <img :src="loadImages('Key', props.activeRoom.konserwatorzy.hasKey)" @click="SwitchStates('Key', props.activeRoom.konserwatorzy.hasKey,'konserwatorzy')" class="cursor-pointer"/>
                            </div>
                          </div>
                      </div>
                      <div class="flex flex-col mx-4 2xl:mx-0 items-center justify-center">
                              <UTextarea v-model="props.activeRoom.konserwatorzy.Kcomment" placeholder="Comment" class="pb-2" size="xl"/>
                      </div>
                  </div>
                  <div v-if="item.key === 'E'">
                      <div class="m-2 flex flex-col items-center">
                          <div class="flex flex-row">
                              <div class="pr-2 h-20 w-20">
                                  <img :src="loadImages('Socket', props.activeRoom.elektrycy.hasSocket)" @click="SwitchStates('Socket', props.activeRoom.elektrycy.hasSocket,'elektrycy')" class="cursor-pointer"/>
                              </div>
                              <div class="pr-2 h-20 w-20">
                                  <img :src="loadImages('Bulb', props.activeRoom.elektrycy.hasBulb)" @click="SwitchStates('Bulb', props.activeRoom.elektrycy.hasBulb,'elektrycy')" class="cursor-pointer"/>
                              </div>
                              <div class="pr-2 h-20 w-20">
                                  <img :src="loadImages('Freezer', props.activeRoom.elektrycy.hasFreezer)" @click="SwitchStates('Freezer', props.activeRoom.elektrycy.hasFreezer,'elektrycy')" class="cursor-pointer"/>
                              </div>
                          </div>
                          <div class="flex flex-row">
                              <div class="pr-2 h-20 w-20">
                                  <img :src="loadImages('Dryer', props.activeRoom.elektrycy.hasDryer)" @click="SwitchStates('Dryer', props.activeRoom.elektrycy.hasDryer,'elektrycy')" class="cursor-pointer"/>
                              </div>
                              <div class="pr-2 h-20 w-20">
                                  <img :src="loadImages('Mirror', props.activeRoom.elektrycy.hasMirror)" @click="SwitchStates('Mirror', props.activeRoom.elektrycy.hasMirror,'elektrycy')" class="cursor-pointer"/>
                              </div>
                              <div class="pr-2 h-20 w-20">
                                    <img :src="loadImages('AC', props.activeRoom.elektrycy.hasAC)" @click="SwitchStates('AC', props.activeRoom.elektrycy.hasAC,'elektrycy')" class="cursor-pointer"/>
                              </div>
                          </div>
                      </div>
                      <div class="flex flex-col mx-4 2xl:mx-0 items-center justify-center">
                              <UTextarea v-model="props.activeRoom.elektrycy.Ecomment" placeholder="Comment" class="pb-2" size="xl"/>
                      </div>
                  </div>
                  <div v-if="item.key === 'A'">
                      <div class="m-2 flex flex-col items-center">
                        <h1 class="text-2xl">Statystyki</h1>
                        <ProgressBar :value="calculatePercentage('elektrycy') ?? 0" :max="100" text="Elektrycy" class="w-full"/>
                        <ProgressBar :value="calculatePercentage('konserwatorzy') ?? 0" :max="100" text="Konserwatorzy" class="w-full"/>
                        <ProgressBar :value="calculatePercentage('informatycy') ?? 0" :max="100" text="Informatycy" class="w-full"/>
                        <ProgressBar :value="calculatePercentage('pokojowe') ?? 0" :max="100" text="Pokojówki" class="w-full"/> 
                        <UButton :disabled="props.activeRoom.administracja.isApproved === 'Yes'" label="Zatwierdz" icon="i-heroicons-check-circle" color="sky" variant="solid" @click="acceptRoom" class="right-0 top-0 m-2"/>
                        <div class="flex flex-row justify-between w-full">
                            <div class="flex flex-col">
                                <p>Zatwierdzono przez:</p> <p>{{ props.activeRoom.administracja.isApprovedBy || 'Brak' }}</p>
                            </div>
                            <div class="flex flex-col">
                                <p>Data zatwierdzenia:</p> <p>{{ props.activeRoom.administracja.isApprovedDate ? new Date(props.activeRoom.administracja.isApprovedDate).toLocaleDateString('pl-PL') : 'Brak' }}</p>
                            </div>
                        </div>
                      </div>
                  </div>
                  <template #footer>
                      <div class="flex flex-row justify-evenly">
                          <form>
                              <div class="file-input">
                                  <input
                                      type="file"
                                      name="file-input"
                                      id="file-input"
                                      class="file-input__input"
                                      v-on:change="roomFileUpload"
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
                          <UButton label="Zdjęcia" icon="i-heroicons-photo-16-solid" @click="openPhotoGallery"/>
                      </div>
                  </template>
              </UCard>
              <div v-if="isGalleryOpen" class="flex flex-col items-center p-2">
                <div v-for="(image,imageIndex) in galleryImages">
                    <div class="border-sky-400 border-y-2 flex flex-col">
                    <div class="w-full justify-end flex">
                        <UButton label="Usuń" icon="i-heroicons-x-mark" color="red" variant="ghost" @click="deleteImage(imageIndex)"></UButton>
                    </div>
                    <img :src="image" class="mt-2">
                </div>
                </div>
              </div>
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
</template>
<script setup lang="ts">
import type { Room } from '@/types/room';
import type { User } from '~/types/user';

onMounted(() => {
    activeRoom.value = props.activeRoom
})

const emit = defineEmits(['update:isOpenRoom'])
const props = defineProps({
    isOpen : {
        type: Boolean,
        required: true
    },
    activeRoom : {
        type: Object as PropType<Room>,
        required: true
    }, 
    user: {
        type: Object as PropType<User>,
        required: true
    }
})
const activeRoom = ref(props.activeRoom)
const galleryImages = ref([])
const isGalleryOpen = ref(false)
const modalItems = [
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
    },
]
const toggleAlarm = () => {
    props.activeRoom.alarm = !props.activeRoom.alarm;
}
const calculateDefaultIndex = () => {
    if (props.user.group.elektrycy) return 0;
    if (props.user.group.konserwatorzy) return 1;
    if (props.user.group.it) return 2;
    if (props.user.group.pokojowki) return 3;
}
const requestEdit = () => {
    if (props.activeRoom.administracja.isApproved === 'Yes') {
        useToast().add({
            title: "Pomieszczenie zatwierdzone",
            description: "Nie można edytować zatwierdzonego pomieszczenia",
            color: "red",
            icon: "i-heroicons-exclamation-triangle",
            timeout: 5000
        })
    }
    else {
        useToast().add({
            title: "Zgłoszenie edycji",
            description: "Zgłoszenie edycji pomieszczenia zostało wysłane",
            color: "green",
            icon: "i-heroicons-check-circle",
            timeout: 5000
        })
        const response = $fetch('/api/telegram/notify', {
            method: 'POST',
            body: props.activeRoom
        })
        emitClose();
    }
}
const submitEdit = async () => {
    if (props.activeRoom.konserwatorzy.Kcomment === undefined) props.activeRoom.konserwatorzy.Kcomment = ''
    const request = await $fetch('/api/rooms/modify', {
        method: 'POST',
        body: props.activeRoom
    })
    if (request.statusCode === 200) {
        emitClose()
    }
}
const roomFileUpload = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    const formData = new FormData()
    formData.append('file', file as Blob)
    formData.append('roomNumber', String(props.activeRoom.roomNumber))
    const token = useCookie('token').value || ''
    formData.append('token', token)
    
    try {
        await $fetch('/api/image', {
            method: 'POST',
            body: formData,
            headers: {
                'type': 'room'
            }
        })
            useToast().add({
            color: "green",
            description: "Zdjęnie dodane",
            id: "imgadded",
            timeout: 3000,
            title: "Success",
        })
    } catch (error) {
        console.error(error)
    }
    isGalleryOpen.value = false
}
const openPhotoGallery = async () => {
    galleryImages.value = []
    const response = await $fetch('/api/image/get', {
        method: 'POST',
        body: {
            roomNumber: props.activeRoom.roomNumber
        }
    })
    response.forEach((image: string) => {
        galleryImages.value.push(`data:image/webp;base64,${image}`)
    })
    isGalleryOpen.value = !isGalleryOpen.value
    
}
const deleteImage = (imageIndex: number) => {
    const image = galleryImages.value[imageIndex]
    const imageBase64 = image.split(',')[1]
    const response = $fetch('/api/image/delete', {
        method: 'POST',
        headers: {
            'type': 'room'
        },
        body: {
            roomNumber: props.activeRoom.roomNumber,
        }
    })
    galleryImages.value.splice(imageIndex, 1)
}
const SwitchStates = (type: string, state: string,category: string) => {
  if (state === "Yes") { state = "No"; }
  else if (state === "No") { state = "unknown"; }
  else if (state === "unknown") { state = "Yes"; }
  switch (category) {
    case 'informatycy':
      // @ts-ignore
      props.activeRoom.informatycy[`has${type}`] = state
      break
    case 'elektrycy':
    // @ts-ignore
    props.activeRoom.elektrycy[`has${type}`] = state
    break
  case 'konserwatorzy':
    // @ts-ignore
    props.activeRoom.konserwatorzy[`has${type}`] = state
    break
  case 'pokojowe':
    // @ts-ignore
    props.activeRoom.pokojowe[`has${type}`] = state
    break
  }
}
const loadImages = (type: string, state: string) => {
    const stateDecoder = () => {
        if (state === "Yes") return "green"
        if (state === "No") return "red"
        return "gray"
    }
    return `/img/pngs/${type.toLowerCase()}-${stateDecoder()}.png`
}
const emitClose = () => {
    emit('update:isOpenRoom', false)
}
const calculatePercentage = (type: string) => {
    if (type === 'informatycy') {
        const totalValues = Object.values(props.activeRoom.informatycy).length -3
        let { _id, Icomment, macAddress, ...values} = props.activeRoom.informatycy
        const yesValues = Object.values(values).filter((value) => value === 'Yes').length
        return (yesValues / totalValues) * 100
    }
    else if (type === 'elektrycy') {
        const totalValues = Object.values(props.activeRoom.elektrycy).length -2
        let { _id, Ecomment, ...values} = props.activeRoom.elektrycy
        const yesValues = Object.values(values).filter((value) => value === 'Yes').length
        return (yesValues / totalValues) * 100
    }
    else if (type === 'konserwatorzy') {
        const totalValues = Object.values(props.activeRoom.konserwatorzy).length -3
        let { _id, Kcomment, hasJoints, ...values} = props.activeRoom.konserwatorzy
        const yesValues = Object.values(values).filter((value) => value === 'Yes').length
        return (yesValues / totalValues) * 100
    }
    else if (type === 'pokojowe') {
        const totalValues = Object.values(props.activeRoom.pokojowe).length -2
        let { _id, Pcomment, ...values} = props.activeRoom.pokojowe
        const yesValues = Object.values(values).filter((value) => value === 'Yes').length
        return (yesValues / totalValues) * 100
    }
}
const acceptRoom = async () => {
    const toast = useToast()
    if (props.user.permissions.admin || props.user.permissions.root) {
        props.activeRoom.administracja.isApproved = 'Yes'
        props.activeRoom.administracja.isApprovedBy = props.user.name + " " + props.user.surname
        props.activeRoom.administracja.isApprovedDate = new Date()
        const request = await $fetch('/api/rooms/modify', {
            method: 'POST',
            body: props.activeRoom
        })
        if (request.statusCode === 200) {
            emitClose() 
        }
    }
    else {
        toast.add({
            title: "Nie masz uprawnień do zatwierdzania pomieszczeń",
            description: "Nie masz uprawnień do zatwierdzania pomieszczeń",
            color: "red",
            icon: "i-heroicons-exclamation-triangle",
            timeout: 5000
        })  
    }

}
const setEverythingGreen = () => {
    let { _id, Icomment, macAddress, ...iValues} = props.activeRoom.informatycy
    Object.keys(iValues).forEach((key) => {
        // @ts-ignore
        props.activeRoom.informatycy[key] = 'Yes'
    })
    let { _id : eID, Ecomment, ...eValues} = props.activeRoom.elektrycy
    Object.keys(eValues).forEach((key) => {
        // @ts-ignore
        props.activeRoom.elektrycy[key] = 'Yes'
    })
    let { _id: kID, Kcomment, hasJoints, ...kValues} = props.activeRoom.konserwatorzy
    Object.keys(kValues).forEach((key) => {
        // @ts-ignore
        props.activeRoom.konserwatorzy[key] = 'Yes'
    })
    let { _id: pID, Pcomment, ...pValues} = props.activeRoom.pokojowe
    Object.keys(pValues).forEach((key) => {
        // @ts-ignore
        props.activeRoom.pokojowe[key] = 'Yes'
    })
    
}
</script>
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