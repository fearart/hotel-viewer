import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
const config = useRuntimeConfig();


class TokenDecoder {
    private token : string = "";

    constructor(token: string) {
        this.token = token;
    }

    public async decode() {
        try {
            jwt.verify(this.token, config.jwt_secret);
        } catch (err) {
            return null;
        }
        let user = await mongoose.connection.db.collection('hotel-users').findOne({token: this.token})
        return user;
    }

    public checkValid() {
        try {
            jwt.verify(this.token, config.jwt_secret);
        } catch (err) {
            return false;
        }
        return true;
    }
}

export default TokenDecoder;