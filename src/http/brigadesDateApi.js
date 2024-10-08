import { guestInstance, authInstance } from './index'

export const getAllBrigadesDate = async () => {
    const { data } = await guestInstance.get('brigadesdate/getall')
    return data
}

export const getAllCertainDays = async () => {
    const { data } = await guestInstance.get('brigadesdate/getAllCertainDays')
    return data
}

export const createBrigadesDate = async (brigadesdate) => {
    const { data } = await authInstance.post(`brigadesdate/create`, brigadesdate)
    return data
}

export const fetchOneBrigadesDate = async (id) => {
    const { data } = await guestInstance.get(`brigadesdate/getone/${id}`)
    return data
}




export const updateBrigadesDate = async (id, brigadesdate) => {
    const { data } = await guestInstance.put(`brigadesdate/updateBrigadesDate/${id}`, brigadesdate)
    return data
}


export const deleteBrigadesDate = async(id) => {
    const { data} = await guestInstance.delete(`brigadesdate /delete/${id}`)
    return data
}

export const getAllDate = async () => {
    const { data } = await guestInstance.get('brigadesdate/getAllDate')
    return data
}