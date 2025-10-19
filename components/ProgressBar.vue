<template>
  <div class="flex flex-col items-center my-4 space-y-2">
    <h2>{{ props.text }}</h2>
    <UProgress v-model="props.value" :max="props.max" class="" indicator status/>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  value: number;
  max: number;
  text: string;
}>();
</script>

<style>

</style>