<template>
  <UModal v-model="props.isOpen" @close="emitClose">
    <div class="m-4 flex flex-col items-center px-2 py-2">
      <h1 class="text-2xl">Statystyki</h1>
      <ProgressBar :value="calculatePercentage('elektrycy') ?? 0" :max="100" text="Elektrycy" class="w-full"/>
      <ProgressBar :value="calculatePercentage('informatycy') ?? 0" :max="100" text="Informatycy" class="w-full"/>
      <UButton class="mt-4" @click="openCorridorFullInfo">Szczegóły</UButton>
      <UButton disabled v-if="!isOpenPrintSection" @click="isOpenPrintSection = !isOpenPrintSection" class="mt-4">Drukuj</UButton>
      <UButton disabled v-else @click="isOpenPrintSection = !isOpenPrintSection" class="mt-4">Zamknij</UButton>
    </div>
    <div v-if="isOpenPrintSection" class="w-full">
      <PrintSection></PrintSection>
    </div>
  </UModal>
</template>

<script lang="ts" setup>
import type { Corridor } from '~/types/corridor';
const props = defineProps({
  corridor: {
    type: Array as PropType<Corridor[]>,
    required: true
  },
  isOpen: {
    type: Boolean,
    required: true
  },
})
const emit = defineEmits(['update:isOpenRoom'])

const isOpenPrintSection = ref(false)

const calculatePercentage = (type: string) => {
  let eCount = 0;
  let kCount = 0;
  let iCount = 0;
  let pCount = 0;
  let totalCorridors = props.corridor.length;

  for (let corridor of props.corridor) {
    const isInformatycyOk = Object.entries(corridor.informatycy)
      .filter(([key]) => !['_id', 'macAddress', 'Icomment'].includes(key))
      .every(([, value]) => value === "Yes");
    const isElectrycyOK = Object.entries(corridor.elektrycy)
    .filter(([key])=> !['_id','Ecomment'].includes(key))
    .every(([,value])=> value === "Yes")
    if (isInformatycyOk) iCount++;
    if (isElectrycyOK) eCount++;
  }
  if (type == 'informatycy') return (iCount / totalCorridors) * 100;
  if (type == 'elektrycy') return (eCount / totalCorridors) * 100;
}

const emitClose = () => {
  emit('update:isOpenRoom', false)
}
const openCorridorFullInfo = () => {
  const corridorNumber = String(props.corridor[0].corridorNumber)
  if (corridorNumber.length === 4) {
    navigateTo(`/v2/corridorstats/?floorNumber=${corridorNumber.slice(0, 1)}`)
  }
  else {
    navigateTo(`/v2/corridorstats/?floorNumber=${corridorNumber.slice(0, 2)}`)
  }
}
</script>

<style>

</style>