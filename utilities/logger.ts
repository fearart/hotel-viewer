import mongoose from "mongoose";

class Logger {
    private _token: string;

    constructor(token: string) {
        this._token = token;
    }

    public async search() {
        const user = await mongoose.connection.db.collection('hotel-users').findOne({"token" : this._token})
        if (user === null) {
            return null;
        }
        return user.login;
    }
    public static async getID() {
        return await mongoose.connection.db.collection('hotel-logs').countDocuments() + 1
    }
}
export default Logger;