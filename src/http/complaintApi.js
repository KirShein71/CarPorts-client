import { guestInstance, authInstance } from './index'

export const getAllComplaint = async () => {
    const { data } = await guestInstance.get('complaint/getall')
    return data
}

export const createComplaint = async (estimate) => {
    const { data } = await authInstance.post(`complaint/create`, estimate)
    return data
}

export const getOneComplaint = async (id) => {
    const { data } = await guestInstance.get(`complaint/getone/${id}`)
    return data
}


export const updateNote = async (id, complaint) => {
    const { data } = await authInstance.put(`complaint/updateNote/${id}`, complaint)
    return data
}

export const deleteComplaint = async(id) => {
    const { data} = await guestInstance.delete(`complaint/delete/${id}`)
    return data
}
