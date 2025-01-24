import type { Corridor } from "@/types/corridor";

const eShouldDisplayCorridor = (index : number,corridors: Corridor[]) => {
    let corridor = corridors[index]
    let { _id, Ecomment, ...values} = corridor.elektrycy
    if (Object.values(values).every((value) => value === 'Yes')) {
        return false
    }
    else {  
        return true
    }
}

const iShouldDisplayCorridor = (index : number,corridors: Corridor[]) => {
    let corridor = corridors[index]
    let { _id, Icomment, macAddress, ...values} = corridor.informatycy
    if (Object.values(values).every((value) => value === 'Yes')) {
        return false
    }
    else {
        return true
    }
}

export { eShouldDisplayCorridor, iShouldDisplayCorridor }
