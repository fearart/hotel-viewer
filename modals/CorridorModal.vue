<template>
    <UModal :open="props.open"
    @update:open="emit('update:open', $event)" 
    @close="emit('update:open', false)"
    >
        <template #header>
            <div class="flex flex-row h-10 w-full justify-center">
                <UButton v-if="props.user.permissions.admin" label="Submit" @click="submitEdit"></UButton>
                <UButton label="Cancel" color="error" class="ml-2" @click="emitClose"></UButton>
                <UInput v-model="props.activeCorridor.corridorNumber" v-maska data-maska="#####" class="text-xl w-24 mx-2" placeholder="corridor number" size="xl"/>
                <UButton v-if="props.activeCorridor.alarm" icon="i-heroicons-bell" color="error" @click="toggleAlarm" class="mr-2"/>
                <UButton v-else icon="i-heroicons-bell" color="neutral" @click="toggleAlarm" class="mr-2"/>
                <UButton label="" @click="requestEdit">
                    <img src="~/assets/svg/tg-white.png" class="w-6 h-6">
                </UButton>
            </div>
        </template>
        <template #body>
        <UTabs :items="modalItems">
            <template #content="{ item }">
            <div v-if="item.key === 'I'" class="flex justify-center flex-col items-center p-6">
                <UInput v-model="props.activeCorridor.informatycy.macAddress" v-maska data-maska="**:**:**:**:**:**" placeholder="Mac Address" />
                <div class="m-2 flex flex-col items-center">
                    <div class="flex flex-row">
                        <div class="pr-2 h-20 w-20">
                            <img :src="loadImages('AccessPoint', props.activeCorridor.informatycy.hasAccessPoint)" @click="SwitchStates('AccessPoint', props.activeCorridor.informatycy.hasAccessPoint  ,'informatycy')" class="cursor-pointer"/>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col mx-4 2xl:mx-0 items-center justify-center">
                    <UTextarea v-model="props.activeCorridor.informatycy.Icomment" placeholder="Comment" class="pb-2" size="xl"/>
                </div>
            </div><!--
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
            </div>-->
            <div v-if="item.key === 'E'">
                <div class="m-2 flex flex-col items-center">
                    <div class="flex flex-row">
                        <div class="pr-2 h-20 w-20">
                            <img :src="loadImages('Socket', props.activeCorridor.elektrycy.hasSocket)" @click="SwitchStates('Socket', props.activeCorridor.elektrycy.hasSocket,'elektrycy')" class="cursor-pointer"/>
                        </div>
                        <div class="pr-2 h-20 w-20">
                            <img :src="loadImages('Bulb', props.activeCorridor.elektrycy.hasBulb)" @click="SwitchStates('Bulb', props.activeCorridor.elektrycy.hasBulb,'elektrycy')" class="cursor-pointer"/>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col mx-4 2xl:mx-0 items-center justify-center">
                        <UTextarea v-model="props.activeCorridor.elektrycy.Ecomment" placeholder="Comment" class="pb-2" size="xl"/>
                </div>
            </div>
            <div v-if="item.key === 'A'">
                <div class="m-2 flex flex-col items-center w-full grow">
                    <h1 class="mb-4">Statystyka</h1>
                    <ProgressBar :value="calculatePercentage('informatycy') ?? 0" :max="100" text="Informatycy" class="w-full"/>
                    <ProgressBar :value="calculatePercentage('elektrycy') ?? 0" :max="100" text="Elektrycy" class="w-full"/>
                </div>
            </div>
            </template>
        </UTabs>
        </template>
        <template #footer>
            <div class="flex flex-row justify-evenly w-full">
                <form>
                    <div class="file-input">
                        <input
                            type="file"
                            name="file-input"
                            id="file-input"
                            class="file-input__input"
                            v-on:change="corridorFileUpload"
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
    </UModal>
</template>
<script setup lang="ts">
import type { Corridor } from '@/types/corridor';
import type { User } from '~/types/user';

const emit = defineEmits(['update:open'])
const props = defineProps({
    open : {
        type: Boolean,
        required: true
    },
    activeCorridor : {
        type: Object as PropType<Corridor>,
        required: true
    }, 
    user: {
        type: Object as PropType<User>,
        required: true
    }
})
const modalItems = [
    {
        label: "Elektrycy",
        icon: "i-heroicons-bolt-20-solid",
        key: 'E'
    },
    /*{
        label: "Hydraulicy",
        icon: 'i-heroicons-wrench-screwdriver-20-solid',
        key: 'K'
    },*/
    {
        label: 'Informatycy',
        icon: 'i-heroicons-wifi-20-solid',
        key: 'I'
    },
    /*{
        label: "Pokojówki",
        icon: 'i-ion-bed',
        key: 'P'
    },*/
    {
        label: "Administacja",
        icon: 'i-material-symbols-notifications-active',
        key: 'A'
    },
]
const toggleAlarm = () => {
    props.activeCorridor.alarm = !props.activeCorridor.alarm;
}
const requestEdit = () => {}
const submitEdit = async () => {
    props.activeCorridor.informatycy.macAddress = props.activeCorridor.informatycy.macAddress.toUpperCase();
    const request = await $fetch('/api/corridors/modify', {
        method: 'POST',
        body: props.activeCorridor
    })
    if (request.statusCode === 200) {
        emitClose()
    }
}
const corridorFileUpload = () => {}
const openPhotoGallery = () => {}
const SwitchStates = (type: string, state: string,category: string) => {
  if (state === "Yes") { state = "No"; }
  else if (state === "No") { state = "unknown"; }
  else if (state === "unknown") { state = "Yes"; }
  switch (category) {
    case 'informatycy':
      // @ts-ignore
      props.activeCorridor.informatycy[`has${type}`] = state
      break
    case 'elektrycy':
    // @ts-ignore
    props.activeCorridor.elektrycy[`has${type}`] = state
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
    emit('update:open', false)
}
const calculatePercentage = (type: string) => {
    if (type === 'informatycy') {
        const totalValues = Object.values(props.activeCorridor.informatycy).length -3
        let { _id, Icomment, macAddress, ...values} = props.activeCorridor.informatycy
        const yesValues = Object.values(values).filter((value) => value === 'Yes').length
        return (yesValues / totalValues) * 100
    }
    else if (type === 'elektrycy') {
        const totalValues = Object.values(props.activeCorridor.elektrycy).length -2
        let { _id, Ecomment, ...values} = props.activeCorridor.elektrycy
        const yesValues = Object.values(values).filter((value) => value === 'Yes').length
        return (yesValues / totalValues) * 100
    }
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