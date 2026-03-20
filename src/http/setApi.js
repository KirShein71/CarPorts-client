import { guestInstance } from './index'



export const getAllSets = async () => {
    const { data } = await guestInstance.get('set/getall')
    return data
}

export const getAllActiveSet = async () => {
    const { data } = await guestInstance.get('set/getAllActiveSet')
    return data
}



export const getOneSet = async (id) => {
    const { data } = await guestInstance.get(`set/getone/${id}`)
    return data
} 

export const createSet = async (sets) => {
    const { data } = await guestInstance.post('set/create', sets)
    return data
}

export const updateSet = async (id, brigade) => {
    const { data } = await guestInstance.put(`set/update/${id}`, brigade)
    return data
}

export const updateActiveSet = async (id, set) => {
    const { data } = await guestInstance.patch(`set/updateActiveSet/${id}`, set)
    return data
}

 
export const deleteSet = async(id) => {
    const {data} = await guestInstance.delete(`set/delete/${id}`)
    return data
}
