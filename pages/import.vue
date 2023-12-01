<template>
    <div class="flex flex-col">
        <div class="flex flex-row mb-2">
            <input type="file" id="file" @change="fileChange">
            <UButton @click="importData">Import</UButton>
        </div>
        <UProgress animation="carousel" v-if="load"/>
    </div>
</template>
<script setup>
import axios from 'axios';

let file = ref(null);
let load = ref(false);
const importData = async () => {
    load.value = true;
    const formData = new FormData();
    formData.append('file', file.value);
    axios.post('/api/import', formData, {headers: {'Content-Type': 'multipart/form-data'}})
        .then(response => {
            load.value = false;
        })
        .catch(error => {
            console.log(error);
        });
    navigateTo('/');
}
const fileChange = (event) => {
    file.value = event.target.files[0];
};
</script>