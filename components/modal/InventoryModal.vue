<template>
  <UModal
    :open="props.open"
    @update:open="emit('update:open', $event)" 
    @close="emit('update:open', false)"
  >
  <template #header>
    <h1 class="text-3xl font-bold w-full text-center">Szczegóły</h1>
  </template>
  <template #body>
    <div v-if="props.openedItem" class=" space-y-2 items-center flex flex-col">
      <h2 class="text-2xl font-bold text-center">{{ props.openedItem.label }}</h2>
      <p class="text-xl font-semibold mb-4 text-center">{{ props.openedItem.description }}</p>
      <div class="flex flex-row items-center">
        <p class="mr-2 text-l">Ilość: </p>
        <UInput v-model="props.openedItem.quantity" placeholder="Ilość:"></UInput>
      </div>
      <div class="flex flex-row items-center">
        <p class="mr-2 text-l">Numer Seryjny: </p>
        <UInput v-model="props.openedItem.serialNumber" placeholder="Numer Seryjny:"></UInput>
      </div>
      <div class="flex flex-row items-center">
        <p class="mr-2 text-l">Lokalizacja: </p>
        <UInput v-model="props.openedItem.location" placeholder="Lokalizacja:"></UInput>
      </div>
      <div class="flex flex-row justify-between w-full px-4 items-center">
        <div class="flex flex-col items-center space-y-2">
          <p>Stworzone: </p>
          <p>{{ new Date(props.openedItem.createdAt).toLocaleString('pl') }}</p>
        </div>
        <div class="flex flex-col items-center space-y-2">
          <p>Przypomni:</p>
          <UPopover>
            <UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
              {{ modelValue ? df.format(modelValue.toDate(getLocalTimeZone())) : 'Wybierz Date' }}
            </UButton>
            
            <template #content>
              <UCalendar v-model="modelValue" class="p-2" />
            </template>
          </UPopover>
        </div>
      </div>
      <div class="flex flex-row justify-between items-center w-full mt-4">
        <UButton color="primary" size="xl" @click="saveChanges">Zapisz</UButton>
        <UButton color="error" size="xl" @click="emitClose">Zamknij</UButton>
      </div>
    </div>
    <div v-else>
      <p>No item selected.</p>
    </div>
  </template>
  </UModal>
</template>

<script lang="ts" setup>
import type { InventoryItem } from '~/types/inventoryItem';
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'

const df = new DateFormatter('pl-pl', {
  dateStyle: 'medium'
})

const modelValue = shallowRef(new CalendarDate(2022, 1, 10))
const props = defineProps<{
    openedItem: InventoryItem|null,
    open: boolean
}>()
const emit = defineEmits(['update:open'])
const emitClose = () => {
    emit('update:open', false)
}
onMounted(() => {
    modelValue.value = props.openedItem?.notifyAt ? new CalendarDate(
        new Date(props.openedItem.notifyAt).getFullYear(),
        new Date(props.openedItem.notifyAt).getMonth() + 1,
        new Date(props.openedItem.notifyAt).getDate()
    ) ?? new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()) : new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
})
const saveChanges = async () => {
    if (!props.openedItem) return;
    try {
        await $fetch(`/api/inventory/`, {
            method: 'POST',
            body: {
                ...props.openedItem,
                notifyAt: modelValue.value ? new Date(modelValue.value.year, modelValue.value.month - 1, modelValue.value.day) : null,
                _id: props.openedItem._id
            }
        })
        emitClose()
    } catch (e:any) {
        console.error(e.message)
    }
}

</script>

<style>

</style>