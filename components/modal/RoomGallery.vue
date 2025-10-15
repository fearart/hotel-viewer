<template>
  <div>
    <UModal v-model="props.isOpen" class="w-60" :ui="{ container: 'items-start' }">
        <div class="flex flex-col p-4">
            <div class="flex justify-end w-full">
                <UButton label="Zamknij okno" icon="i-heroicons-x-mark" color="red" variant="ghost" @click="emitClose()" class="right-0 top-0 m-2"/>
            </div>
            <div v-for="(image,imageIndex) in roomImages" class="p-4">
                <div class="border-sky-400 border-y-2 flex flex-col">
                    <div class="w-full justify-end flex">
                        <UButton label="Usuń" icon="i-heroicons-x-mark" color="red" variant="ghost" @click="deleteImage(imageIndex)"></UButton>
                    </div>
                    <img :src="image" class="mt-2">
                </div>
            </div>
            <div class="loader" v-if="isLoading">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
            </div>
            <p v-if="roomImages.length === 0 && !isLoading">Brak zdjęć w bazie</p>
        </div>
    </UModal>
  </div>
</template>

<script lang="ts" setup>

const emitClose = () => {
  
}
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  isLoading: {
    type: Boolean,
    required: true
  },
  roomImages: {
    type: Array,
    required: true,
  }
})
</script>

<style scoped>
.loader {
    position: relative;
    left: 50%;
}

.dot {
    position: absolute;
    height: 1rem;
    width: 1rem;
    border-radius: 50%;
    background-color: #fff;
    animation: bounce 1.3s linear infinite;
}

.dot:nth-child(1) {
    left: -1.5rem;
}

.dot:nth-child(2) {
    animation-delay: -1s;
}

.dot:nth-child(3) {
    right: -2.5rem;
    animation-delay: -0.8s;
}

@keyframes bounce {
    0%,
    66%,
    100% {
        transform: initial;
    }

    33% {
        transform: translatey(-1rem);
    }
}

</style>