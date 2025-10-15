import mongoose from "mongoose";

class Logger {
    public static async search(token: string) : Promise<string> {
        const user = await mongoose.connection.db.collection('hotel-users').findOne({"token" : token})
        if (user === null) {
            return "";
        }
        return user.login;
    }
    public static async getID() : Promise<number> {
        return await mongoose.connection.db.collection('hotel-logs').countDocuments() + 1
    }
}
export default Logger;