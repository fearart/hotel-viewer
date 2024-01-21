<template>
    <form @submit.prevent="handleForm">
        <input type="file" name="file" />
        <input type="submit" value="Submit" /> 
    </form>
</template>

<script setup>

import axios from 'axios';


const handleForm = async (event) => {
    const formData = new FormData()
    formData.append('file', event.target.file.files[0])
    formData.append('room_number', '6001')
    formData.append('token', useCookie('token').value)
    formData.append('type','hydraulicy')
    const response = await axios.post('/api/image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }

    })
    const toast = useToast()
    toast.add({
        color: "green",
        description: "Image added",
        id: "imgadded",
        timeout: 3000,
        title: "Success",
    })
}
</script>