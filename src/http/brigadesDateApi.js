import { guestInstance, authInstance } from './index'

export const getAllBrigadesDate = async () => {
    const { data } = await guestInstance.get('brigadesdate/getall')
    return data
}

export const getAllOneBrigadesDate = async (brigadeId) => {
    const { data } = await guestInstance.get(`brigadesdate/getAllForOneBrigade/${brigadeId}`)
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

export const getAllNumberOfDaysBrigade = async (brigadeId, projectId) => {
    const { data } = await guestInstance.get(`brigadesdate/getAllNumberOfDaysBrigade/${brigadeId}/${projectId}`)
    return data
}

export const getAllNumberOfDaysBrigadeForProject = async (brigadeId) => {
    const { data } = await guestInstance.get(`brigadesdate/getAllNumberOfDaysBrigadeForProject/${brigadeId}`)
    return data
}

export const getAllNumberOfDaysBrigadeForRegion = async () => {
    const { data } = await guestInstance.get('brigadesdate/getAllNumberOfDaysBrigadeForRegion')
    return data
}



