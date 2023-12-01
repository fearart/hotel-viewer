import mongoose from "mongoose";

export default defineNuxtRouteMiddleware(async ()=> {
    const token = useCookie('token').value
    const user = await mongoose.connection.db.collection('hotel-users').findOne({"token" : token})
    if (user === null) {
        return navigateTo("/login")
    }
    if (user.permissions.root === false) {
        return navigateTo("/")
    }
    else {
        console.log('admin passed')

    }
})