<template>
  <div class="flex items-center flex-col">
    <UEmpty
      v-if ="inventory.length === 0"
      icon="i-lucide-file"
      title="Brak elementów w inwentarzu"
      description="Nie dodano jeszcze żadnych elementów do inwentarza. Kliknij przycisk poniżej, aby dodać nowy element."
      :actions="[
      {
        icon: 'i-lucide-plus',
        label: 'Dodaj element',
      },
    ]"
    />
    <div v-for="(item, index) in inventory" class="text-2xl rounded-3xl flex justify-center items-center cursor-pointer dark:bg-gray-800 mb-4 h-20 flex-row min-w-1/3 p-4" @click="openRoomModal(item)">
      <img src="/public/img//pngs/fire_ext_green.png" alt="item icon" class="w-10 h-10"/>
      <div class="flex flex-col">
        <div class="flex flex-row space-x-4">
          <span class="text-lg font-semibold">{{ item.label }}</span>
          <span class="text-lg">Ilość: {{ item.quantity }}</span>
        </div>
        <span class="text-sm text-gray-500">Lokalizacja: {{ item.location }}</span>
        <span class="text-sm text-gray-500">Termin Ważnosci: {{ new Date(item.notifyAt).toLocaleString('pl',options) }}</span>
      </div>
    </div>
    <div class="text-2xl rounded-3xl flex justify-center items-center cursor-pointer dark:bg-gray-800 w-60 mb-4 h-20 flex-row min-w-1/3" @click="createItem"> 
      <span>+</span>
    </div>
  </div>
  <InventoryModal v-if='openedModal' v-model:open="openedModal" @close="handleModalClose" @update:open="handleModalClose" :openedItem="openedItem" />
</template>

<script lang="ts" setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import InventoryModal from '~/components/modal/InventoryModal.vue'
import type { InventoryItem } from '~/types/inventoryItem'
const error = ref<string>("")
const inventory = ref<InventoryItem[]>([])
const openedModal = ref<boolean>(false)
const openedItem = ref<InventoryItem|null>(null)
onMounted(() => {
    getInventory()
})

const getInventory = async () => {
    try {
        const response = await axios.get<InventoryItem[]>('/api/inventory')
        inventory.value = response.data
    } catch (e:any) {
        error.value = e.message
    }
}
const createItem = async () => {
  const oneHourLaterDate = new Date();
  oneHourLaterDate.setHours(oneHourLaterDate.getHours() + 1);
    try {
        const newItem: InventoryItem = {
            label: "Nowy element",
            quantity: 1,
            createdAt: new Date(),
            notifyAt: oneHourLaterDate,
            serialNumber: "0000",
            location: "Magazyn",
            description: "Opis nowego elementu",
            icon: "i-lucide-box"
        }
        // send PUT with body newItem
        const response = await axios.put<InventoryItem>('/api/inventory', newItem)
        inventory.value.push(response.data)
    } catch (e:any) {
        error.value = e.message
    }
    getInventory()
}
const handleModalClose = () => {
    getInventory()
}
const openRoomModal = (item: InventoryItem) => {
    openedItem.value = item
    openedModal.value = true
}

const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit', // or 'numeric', 'short', 'long'
    day: '2-digit',   // or 'numeric'
};
</script>

<style>

</style>