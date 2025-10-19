<template>
  <UModal v-model="props.open" @close="emitClose">
    <template #body>
    <div class="m-4 flex flex-col items-center px-2 py-2">
      <h1 class="text-2xl">Statystyki</h1>
      <ProgressBar :value="calculatePercentage('elektrycy') ?? 0" :max="100" text="Elektrycy" class="w-full"/>
      <ProgressBar :value="calculatePercentage('konserwatorzy') ?? 0" :max="100" text="Konserwatorzy" class="w-full"/>
      <ProgressBar :value="calculatePercentage('informatycy') ?? 0" :max="100" text="Informatycy" class="w-full"/>
      <ProgressBar :value="calculatePercentage('pokojowe') ?? 0" :max="100" text="Pokojówki" class="w-full"/> 
      <UButton class="mt-4" @click="openRoomFullInfo">Szczegóły</UButton>
      <UButton v-if="!isOpenPrintSection" @click="isOpenPrintSection = !isOpenPrintSection" disabled class="mt-4">Drukuj</UButton>
      <UButton v-else @click="isOpenPrintSection = !isOpenPrintSection" class="mt-4" disabled>Zamknij</UButton>
    </div>
    <div v-if="isOpenPrintSection" class="w-full">
      <PrintSection></PrintSection>
    </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import type { Room } from '~/types/room';
const props = defineProps({
  rooms: {
    type: Array as PropType<Room[]>,
    required: true
  },
  open: {
    type: Boolean,
    required: true
  },
})
const emit = defineEmits(['update:open'])

const isOpenPrintSection = ref(false)

const calculatePercentage = (type: string) => {
  const total = props.rooms.length;
  let eCount = 0;
  let kCount = 0;
  let iCount = 0;
  let pCount = 0;
  if (type === 'informatycy') {
    props.rooms.forEach((room : Room) => {
        const totalValues = Object.values(room).length -2
        let { _id, Icomment, macAddress, ...values} = room.informatycy
        const yesValues = Object.values(values).filter((value) => value === 'Yes').length
        if (yesValues === totalValues) {
            iCount++
        }
    })
    return (iCount / total) * 100
  }
  else if (type === 'elektrycy') {
    props.rooms.forEach((room: Room) => {
      const totalValues = Object.values(room.elektrycy).length -3
      let { _id, Ecomment, ...values} = room.elektrycy
      const yesValues = Object.values(values).filter((value) => value === 'Yes').length
      if (yesValues === totalValues) {
            eCount++
      }
      return (eCount / total) * 100
    })
  }
  else if (type === 'konserwatorzy') {
    props.rooms.forEach((room: Room) => {
      const totalValues = Object.values(room.konserwatorzy).length -2
      let { _id, Kcomment, ...values} = room.konserwatorzy
      const yesValues = Object.values(values).filter((value) => value === 'Yes').length
      if (yesValues === totalValues) {
            kCount++
      }
    })
    return (kCount / total) * 100
  }
  else if (type === 'pokojowe') {
    props.rooms.forEach((room: Room) => {
      const totalValues = Object.values(room.pokojowe).length -2
      let { _id, Pcomment, ...values} = room.pokojowe
      const yesValues = Object.values(values).filter((value) => value === 'Yes').length
      if (yesValues === totalValues) {
            pCount++
      }
    })
    return (pCount / total) * 100  
  }
}

const emitClose = () => {
  emit('update:open', false)
}

const openRoomFullInfo = () => {
  const roomNumber = String(props.rooms[0].roomNumber)
  if (roomNumber.length === 4) {
    navigateTo(`/v2/roomstats/?floorNumber=${roomNumber.slice(0, 1)}`)
  }
  else {
    navigateTo(`/v2/roomstats/?floorNumber=${roomNumber.slice(0, 2)}`)
  }
}
</script>

<style>

</style>