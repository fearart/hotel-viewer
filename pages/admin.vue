<template>
    <UContainer class="dark:bg-gray-700 rounded-lg w-80 p-3 flex flex-row" v-if="!isAdminSignedIn">
        <UInput placeholder="Admin password" v-model="password_input"></UInput>
        <UButton class="ml-4" @click="SubmitLogin">Submit</UButton>
    </UContainer>
</template>
<script setup>
const toast = useToast()
const admin_password = 'Fearart2!'
const password_input = ref('')
const isAdminSignedIn = ref(false)
const SubmitLogin = () => {
    if (password_input.value == admin_password) {
        isAdminSignedIn.value = true
    }
    else {
        toast.add({
            id: "admin_login",
            title: "Wrong password",
            description: "Please try again",
            timeout: 4000,
        })
    }
}
</script>