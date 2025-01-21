import mongoose from "mongoose"
import jwt from 'jsonwebtoken';

export default defineNuxtRouteMiddleware(async ()=> {
    const cookie = useCookie('token')
    if (typeof(cookie.value) !== 'string') {
        return navigateTo("/login")
    }
    const user = await mongoose.connection.db.collection('hotel-users').findOne({"token" : cookie.value})
    if (user === null) {
        return navigateTo("/login")
    }
    try {
        jwt.verify(cookie.value as string,useRuntimeConfig().jwt_secret)
    }
    catch (e) {
        cookie.value = null
        return navigateTo("/login")
    }
})