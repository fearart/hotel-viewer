<template>
    <UContainer class="dark:bg-gray-700 rounded-lg 2xl:w-1/2 w-full p-3 flex flex-row">
        <UTabs :items="items" class="w-full">
            <template #users="{ item }">
            <UCard @submit.prevent="onSubmitAccount">
                <template #header>
                <p class="text-base font-semibold leading-6 text-gray-900 dark:text-white text-center">
                    {{ item.label }}
                </p>
                </template>

                <div class="dark:bg-gray-700 rounded-lg 2xl:px-4 px-2 py-2 my-2 2xl:h-14" v-for="(user,userIndex) in users">
                    <div class="flex flex-row 2xl:h-8 cursor-pointer " @click="openUserModal(userIndex)">
                        <UIcon v-if="user.permissions.admin && user.permissions.root" name="i-heroicons-star-20-solid" class="text-sky-500 2xl:mr-2" />
                        <UIcon v-else v-if="user.permissions.admin && !user.permissions.root" name="i-heroicons-star" class="text-sky-500 2xl:mr-2" />
                        <div class="flex 2xl:flex-row flex-col">
                            <p>Login:{{ user.login }} &emsp;</p>
                             {{ user.name }} {{ user.surname }} 
                            <div class="2xl:ml-2 2xl:flex 2xl:flex-row">
                                <div>
                                    <span v-if="user.group.it" class="bg-orange-500 text-white rounded-full px-2 py-1 text-xs font-bold 2xl:mr-3 mr-1">Informatycy</span>
                                    <span v-if="user.group.pokojowki" class="bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold 2xl:mr-3 mr-1">Pokojowe</span>
                                    <span v-if="user.group.elektrycy" class="bg-yellow-500 text-white rounded-full px-2 py-1 text-xs font-bold 2xl:mr-3 mr-1">Elektrycy</span>
                                    <span v-if="user.group.hydraulicy" class="bg-sky-500 text-white rounded-full px-2 py-1 text-xs font-bold 2xl:mr-3 mr-1">Hydraulicy</span>
                                </div>
                                <span v-if="user.group.konserwatorzy" class="bg-green-500 text-white rounded-full px-2 py-1 text-xs font-bold 2xl:mr-3 mr-1">Konserwatorzy</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="dark:bg-gray-700 rounded-lg 2xl:px-4 px-2 py-2 my-2 2xl:h-14">
                    <div class="flex flex-row 2xl:h-8 cursor-pointer">
                        <div class="flex items-center justify-center align-middle w-full h-full" @click="isRegisterOpen = true"> 
                            <p class="text-2xl">+</p>
                        </div>
                    </div>
                </div>
                <template #footer>
                </template>
            </UCard>
            </template>

            <template #logs="{ item }">
            <UCard @submit.prevent="onSubmitPassword" class="w-full">
                <template #header>
                <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white text-center">
                    {{ item.label }}
                </h3>
                </template>
                <div>
                    <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
                        <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Columns" />
                        <UButton class="ml-2" @click="getLogs">Refresh</UButton>
                    </div>
                    <div>
                    </div>
                    <UTable :columns="selectedColumns" :rows="logs" :loading="tableLoading" class="min-h-1/2 max-h-screen" />
                </div>
                <template #footer>
                </template>
            </UCard>
            </template>
        </UTabs>
    </UContainer>
    <!-- User modal -->
    <UModal v-model="isOpen" class="w-60" :ui="{ container: 'items-start' }">
        <button></button>
        <div class="flex flex-col p-6 h-96 items-center justify-center">
            <div class="">
                <div class="flex flex-row items-center">
                    <div class="flex flex-col items-center">
                        <label class="text-gray-700 dark:text-gray-200 text-l">Imię</label>
                        <UInput v-model="openedUser.name"/>
                    </div>
                    <div class="flex flex-col ml-4 items-center">
                        <label class="text-gray-700 dark:text-gray-200 text-l">Nazwisko</label>
                        <UInput v-model="openedUser.surname"/>
                    </div>
                </div>
                <div class="flex flex-row justify-around ml-4 items-center">
                    <div class="flex flex-col items-center">
                        <label class="text-gray-700 dark:text-gray-200 text-l">Grupy</label>
                        <USelectMenu v-model="selectedGroups" :options="options" placeholder="Select Groups" multiple/>
                    </div>
                    <div>
                    <UCheckbox v-model="openedUser.permissions.root" name="root" label="Root"></UCheckbox>
                    <UCheckbox v-model="openedUser.permissions.admin" name="admin" label="Admin"></UCheckbox>
                </div>
                </div>
            </div>
            <div class="flex flex-row justify-around w-full">
                <div class="flex items-end">
                    <UButton color="sky" class="mt-4" @click="submitUserModal">Zapisz</UButton>
                </div>
                <div class="flex flex-row">
                    <div class="flex items-end">
                        <UButton color="red" class="mt-4" @click="resetPassword">Zresetować haslo</UButton>
                    </div>
                    <div class="flex items-end ml-2">
                        <UButton color="red" class="mt-4" @click="deleteUser">Usunąć</UButton>
                    </div>
                </div>
            </div>
        </div>
    </UModal>
    <UModal v-model="isRegisterOpen" class="w-60" :ui="{ container: 'items-start' }">
        <button></button>
        <div class="flex flex-col p-6 h-96 items-center justify-center">
            <div>
                <div class="flex flex-row items-center">
                    <div class="flex flex-col items-center">
                        <label class="text-gray-700 dark:text-gray-200 text-l">Imię</label>
                        <UInput v-model="createUser.name"/>
                    </div>
                    <div class="flex flex-col ml-4 items-center">
                        <label class="text-gray-700 dark:text-gray-200 text-l">Nazwisko</label>
                        <UInput v-model="createUser.surname"/>
                    </div>
                </div>
                <div class="flex flex-row items-center">
                    <div class="flex flex-col items-center">
                        <label class="text-gray-700 dark:text-gray-200 text-l">Login</label>
                        <UInput v-model="createUser.login"/>
                    </div>
                    <div class="flex flex-col ml-4 items-center">
                        <label class="text-gray-700 dark:text-gray-200 text-l">Haslo</label>
                        <UInput v-model="createUser.password"/>
                    </div>
                </div>
                <div class="flex flex-row items-center justify-around align-middle 2xl:h-16">
                    <div class="flex flex-col ml-4 items-center">
                        <label class="text-gray-700 dark:text-gray-200 text-l">Grupy</label>
                        <USelectMenu v-model="selectedGroups" :options="options" placeholder="Select Groups" multiple/>
                    </div>
                    <div class="flex flex-col 2xl:h-16 justify-center">
                        <UCheckbox v-model="createUser.permissions.admin" name="admin" label="Admin"></UCheckbox>
                        <UCheckbox v-model="createUser.permissions.root" name="admin" label="Root"></UCheckbox>
                    </div>
                </div>
            </div>
            <div class="flex flex-row justify-around w-full">
                <div class="flex items-end">
                    <UButton color="sky" class="mt-4" @click="createNewUser">Zapisz</UButton>
                </div>
            </div>
        </div>
    </UModal>
</template>
<script setup>
import axios from 'axios';
import Logger from '~/utilities/logger';

const isRoot = ref(false)
const cookie = useCookie('token')

const users = ref([])
const openedUser = ref({})
const createUser = ref({
    login: "",
    password: "",
    permissions: {
        root: false,
        admin: false
    }
})
const items = [{
  slot: 'users',
  label: 'Users'
}, {
  slot: 'logs',
  label: 'Logs'
}]
const isOpen = ref(false)
const isRegisterOpen = ref(false)
const selectedGroups = ref([])
const logs = ref([])
const accountForm = reactive({ name: 'Benjamin', username: 'benjamincanac' })
const passwordForm = reactive({ currentPassword: '', newPassword: '' })
const tableLoading = ref(false)

function onSubmitAccount () {
}

function onSubmitPassword () {
}
onMounted(async () => {
    if (cookie.value === null || cookie.value === undefined) {
        navigateTo('/')
    }
    else {
        axios.post('/api/users/permissions',{"token": cookie.value}).then((res) => {
            if (Object.keys(res.data).length === 0) {
                navigateTo('/')
            }
            if (!res.data.root) { 
                navigateTo('/')
            }
            else {
                isRoot.value = res.data.root
            }
        })
    }
    getUsers()
    await getLogs()
})
const getUsers = () => {
    axios.get('/api/users').then((res) => {
        users.value = res.data
    })
}
const getLogs = async () => {
    tableLoading.value = true
    axios.post('/api/log',{"auth" : cookie.value}).then((res) => {
        logs.value = res.data.sort((a,b) => b.timestamp - a.timestamp)
    })
    tableLoading.value = false
}
const openUserModal = (index) => {
    openedUser.value = users.value[index]
    isOpen.value = true
}
const submitUserModal = (index) => {
    openedUser.value.group = {};
    selectedGroups.value.forEach(group => {
        switch(group) {
            case 'Informatycy':
                openedUser.value.group.it = true;
                break;
            case 'Pokojówki':
                openedUser.value.group.pokojowki = true;
                break;
            case 'Elektrycy':
                openedUser.value.group.elektrycy = true;
                break;
            case 'Hydraulicy':
                openedUser.value.group.hydraulicy = true;
                break;
            case 'Konserwatorzy':
                openedUser.value.group.konserwatorzy = true;
                break;
        }
    });
    if (openedUser.value.group.it === undefined) openedUser.value.group.it = false;
    if (openedUser.value.group.pokojowki === undefined) openedUser.value.group.pokojowki = false;
    if (openedUser.value.group.elektrycy === undefined) openedUser.value.group.elektrycy = false;
    if (openedUser.value.group.hydraulicy === undefined) openedUser.value.group.hydraulicy = false;
    if (openedUser.value.group.konserwatorzy === undefined) openedUser.value.group.konserwatorzy = false;
    isOpen.value = false
    selectedGroups.value = []
    axios.post('/api/users/modify',{"login": openedUser.value.login,"password": openedUser.value.password,
            "permissions": openedUser.value.permissions,"name":openedUser.value.name,"surname":openedUser.value.surname,"group":openedUser.value.group}).then((res) => {
        getUsers()
    })
}
const createNewUser = () => {
    const user = createUser.value
    axios.put('/api/users/register',{"login" : user.login,"password": user.password,
    "name" : user.name, "surname" : user.surname,
    "permissions": user.permissions, "group": user.group}).then((res) => {
        isRegisterOpen.value = false
    })
    getUsers()
}
const deleteUser = () => {
    axios.post('/api/users/delete',{"login" : openedUser.value.login, "auth" : cookie.value}).then((res) => {
        isOpen.value = false
    })
    getUsers()
}
const resetPassword = () => {
    if (!isRoot) return
    let password = prompt("Podaj nowe hasło")
    password = password.trim().replaceAll(" ","")
    if (password === null || password === "") {
        return
    }
    axios.post('/api/users/reset',{"login": openedUser.value.login,"password" : password}).then((res) => {
    })
}
const options = [
    "Informatycy",
    "Pokojówki",
    "Elektrycy",
    "Hydraulicy",
    "Konserwatorzy",
]
const convertUnixTime = (unixTime) => {
    const date = new Date(unixTime)
    return date.toLocaleString()
}
const columns = [
    {
        key: 'ID',
        label: 'ID',
    },
    {
        key: 'type',
        label: 'Type',
    },
    {
        key: 'event',
        label: 'Event',
    },
    {
        key: 'user',
        label: 'User',
    },
    {
        key: 'timestamp',
        label: 'Timestamp',
    },
    {
        key: 'details',
        label: 'Details',
}]
const selectedColumns = ref([...columns])
</script>