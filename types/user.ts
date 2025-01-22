export interface User {
    login: string;
    token: string;
    permissions: {
        read: boolean;
        write: boolean;
        admin: boolean;
        root: boolean;
    }
    name: string;
    surname: string;
    group: {
        hydraulicy: boolean;
        it: boolean;
        pokojowki: boolean;
        elektrycy: boolean;
        konserwatorzy: boolean;
    },
    password: string;
}