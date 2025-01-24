<template>
  <div>
    <UModal v-model="props.isOpen" title="Statystyki" class="w-60" :ui="{ container: 'items-start'}" @close="emitClose">
      <div class="m-2 flex flex-col items-center p-4">
        <h1 class="text-2xl">Statystyki</h1>
        <ProgressBar :value="calculatePercentage('elektrycy') ?? 0" :max="100" text="Elektrycy" class="w-full"/>
        <ProgressBar :value="calculatePercentage('konserwatorzy') ?? 0" :max="100" text="Konserwatorzy" class="w-full"/>
        <ProgressBar :value="calculatePercentage('informatycy') ?? 0" :max="100" text="Informatycy" class="w-full"/>
        <ProgressBar :value="calculatePercentage('pokojowe') ?? 0" :max="100" text="Pokojówki" class="w-full"/>
        <UButton label="Wydrukuj" class="mt-4"/>
      </div>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
import type { Room } from '~/types/room';

const props = defineProps({
  Rooms: {
    type: Array as PropType<Room[]>,
    required: true
  },
  isOpen: {
    type: Boolean,
    required: true
  }
})
const emit = defineEmits(['update:isOpen']);

const emitClose = () => {
  emit('update:isOpen', false);
}
const calculatePercentage = (type: string) => {
  let total_rooms = props.Rooms.length;
  let okay_rooms = 0;

  let elektrycy_ok = 0;
  let konserwatorzy_ok = 0;
  let informatycy_ok = 0;
  let pokojowe_ok = 0;

  for (let room of props.Rooms) {
    const { elektrycy, konserwatorzy, informatycy, pokojowe } = room;

    // Filter out _id and macAddress fields before checking values
    const isElektrycyOk = Object.entries(elektrycy)
      .filter(([key]) => !['_id', 'Ecomment'].includes(key))
      .every(([, value]) => value === "Yes");

    const isKonserwatorzyOk = Object.entries(konserwatorzy)
      .filter(([key]) => !['_id', 'hasJoints', 'Kcomment'].includes(key))
      .every(([, value]) => value === "Yes");

    const isInformatycyOk = Object.entries(informatycy)
      .filter(([key]) => !['_id', 'macAddress', 'Icomment'].includes(key))
      .every(([, value]) => value === "Yes");

    const isPokojoweOk = Object.entries(pokojowe)
      .filter(([key]) => !['_id', 'Pcomment'].includes(key))
      .every(([, value]) => value === "Yes");

    if (isElektrycyOk) elektrycy_ok++;
    if (isKonserwatorzyOk) konserwatorzy_ok++;
    if (isInformatycyOk) informatycy_ok++;
    if (isPokojoweOk) pokojowe_ok++;

    if (isElektrycyOk && isKonserwatorzyOk && isInformatycyOk && isPokojoweOk) {
      okay_rooms++;
    }
  }
  switch(type) {
    case 'elektrycy':
      return (elektrycy_ok / total_rooms) * 100;
    case 'konserwatorzy':
      return (konserwatorzy_ok / total_rooms) * 100;
    case 'informatycy':
      return (informatycy_ok / total_rooms) * 100;
    case 'pokojowe':
      return (pokojowe_ok / total_rooms) * 100;
  }
}
</script>

<style>

</style>