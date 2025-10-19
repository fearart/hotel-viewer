<template>
  <div>
    <UTable :rows="inventory" />
  </div>
  <p>{{  error }}</p>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import type { InventoryItem } from '~/types/inventoryItem'
const error = ref<string>("")
const inventory = ref<InventoryItem[]>([])
onMounted(() => {
    getInventory()
})

const getInventory = async () => {
    axios.get('/api/inventory').then((response) => {
        inventory.value = response.data as InventoryItem[]
    }).catch((error) => {
      error.value = "Failed to fetch inventory."
        console.error("Error fetching inventory:", error)
    })
}
</script>

<style>

</style>