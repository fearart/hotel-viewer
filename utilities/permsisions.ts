class Permissions {
    read: boolean;
    write: boolean;
    admin: boolean;
    root: boolean;
    constructor(readOrObject: boolean | { read: boolean, write: boolean, admin: boolean } = false, write?: boolean, admin?: boolean) {
        if (typeof readOrObject === 'boolean') {
            this.read = readOrObject;
            this.write = write || false;
            this.admin = admin || false;
            this.root = false;
        } else {
            this.read = readOrObject.read;
            this.write = readOrObject.write;
            this.admin = readOrObject.admin;
            this.root = false;
        }
    }

    canRead() {
        return this.read === true
    }
    canWrite() {
        return this.write === true
    }
    isAdmin() {
        return this.admin === true
    }
    isRoot() {
        return this.root === true
    }
}
export default Permissions