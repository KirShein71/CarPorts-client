import { guestInstance, authInstance } from './index'

export const getAllBrigadeWork = async () => {
    const { data } = await guestInstance.get('brigadework/getall')
    return data
}

export const getOneBrigadeWork = async (id) => {
    const { data } = await guestInstance.get(`brigadework/getone/${id}`)
    return data
}

export const getOneBrigadeWorkRegionId = async (id) => {
    const { data } = await guestInstance.get(`brigadework/getOneBrigadeWorkRegionId/${id}`)
    return data
}

export const createBrigadeWork = async (brigadework) => {
    const { data } = await authInstance.post(`brigadework/create`, brigadework)
    return data
}

export const updateCount = async (id, brigadework) => {
    const { data } = await guestInstance.put(`brigadework/updateCount/${id}`, brigadework)
    return data
}