<template>
  <div class="w-full h-full">
    <div class="flex items-start p-2">
    <div class="flex w-1/2">
      <img v-if="useColorMode().value === 'dark'" src="~/assets/pngs/hotel-icon-dark.png" height="35" width="35" @click="navigateTo('/')" class="cursor-pointer">
      <img v-else src="~/assets/pngs/hotel-icon.png" height="35" width="35" @click="navigateTo('/')" class="cursor-pointer">  
    </div>
    <div class="flex items-end justify-end w-1/2">
      <ClientOnly>
        <UButton
        :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
        color="gray"
        variant="ghost"
        aria-label="Theme"
        @click="isDark = !isDark"
        class="mr-2"
        />

        <template #fallback>
        <div class="w-8 h-8" />
        </template>
      </ClientOnly>
      <UButton label="Log out" @click="deleteCookie" class="self-end items-end justify-end" v-if="islogged"></UButton>
    </div>
    </div>
  <div class="flex items-center justify-center align-middle h-full">
    <RouterView></RouterView>
  </div>
  <div class="items-center align-middle block fixed bottom-0 w-full bg-gray-800 opacity-30 rounded-t-xl p-x-2">
    <div class="flex items-center align-middle h-full flex-row justify-center">
      Designed and developed by Mykola Pukovskyi
      <UButton label="" target="_blank" to="https://fearart.dev" class="text-blue-500" size="xs" variant="link" icon="i-heroicons-arrow-top-right-on-square-20-solid"></UButton>
      <UButton label="" target="_blank" to="https://github.com/fearart" class="text-blue-500" size="xs" variant="link" icon="i-heroicons-solid:code"></UButton>

    </div>
  </div>
  </div>
  <UNotifications />
</template>
<script setup>
const colorMode = useColorMode()

const islogged = ref(false)
const isDark = computed({
  get () {
    return colorMode.value === 'dark'
  },
  set () {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})
const deleteCookie = () => {
    let cookie = useCookie('token')
    cookie.value = null
    islogged.value = false
    navigateTo('/login')
}
onMounted(() => {
    let cookie = useCookie('token')
    if (cookie.value != null) {
        islogged.value = true
    }
})
</script>