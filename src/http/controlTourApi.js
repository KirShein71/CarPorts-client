import { guestInstance, authInstance } from './index'

export const getAllControlTour = async () => {
    const { data } = await guestInstance.get('controltour/getall')
    return data
}

export const getAllCertainDays = async () => {
    const { data } = await guestInstance.get('controltour/getAllCertainDays')
    return data
}

export const createControlTour = async (controltour) => {
    const { data } = await authInstance.post(`controltour/create`, controltour)
    return data
}

export const fetchOneControlTour = async (id) => {
    const { data } = await guestInstance.get(`controltour/getone/${id}`)
    return data
}

export const updateControlTour = async (id, controltour) => {
    const { data } = await guestInstance.put(`controltour/updateControlTour/${id}`, controltour)
    return data
}

export const deleteControlTour = async(id) => {
    const { data} = await guestInstance.delete(`controltour/delete/${id}`)
    return data
}
