<template>
  <div class="flex flex-col px-4 pb-2 space-y-2" ref="pdfSection">
    <div class="flex flex-row justify-around mb-2 w-full">
      <UCheckbox v-model="isRoomsSelected" label="Pokoje" ref="pdfSection"></UCheckbox>
      <UCheckbox v-model="isCorridorsSelected" label="Korytarze" ref="pdfSection"></UCheckbox>
      <UCheckbox disabled v-model="isCinemasSelected" label="Kina" ref="pdfSection"></UCheckbox>
      <UCheckbox disabled v-model="isHallsSelected" label="Sale"></UCheckbox>
    </div>
    <div class="flex flex-row justify-around mb-2 w-full">
      <UCheckbox disabled v-model="isRestaurantsSelected" label="Restauracje"></UCheckbox>
      <UCheckbox disabled v-model="isPlayroomsSelected" label="Bawialni"></UCheckbox>
      <UCheckbox disabled v-model="isKitchensSelected" label="Kuchnie"></UCheckbox>
    </div>
    <div class="flex flex-row justify-evenly">
      <UButton icon="i-heroicons:table-cells-20-solid" @click="exportToExcel" >Excel</UButton>
      <UButton icon="i-heroicons:document-text-solid" @click="" >PDF</UButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
const getFloors = async () => {
  const response = await $fetch('/api/floors')
  return response
}
const isRoomsSelected = ref(false)
const isCorridorsSelected = ref(false)
const isCinemasSelected = ref(false)
const isHallsSelected = ref(false)
const isRestaurantsSelected = ref(false)
const isPlayroomsSelected = ref(false)
const isKitchensSelected = ref(false)
const pdfSection = ref<HTMLElement | null>(null)
const exportToExcel = () => {
  console.log('exported')
}
</script>

<style>

</style>