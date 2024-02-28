import { guestInstance, authInstance } from './index'


export const fetchAllAntypical = async () => {
    const { data } = await guestInstance.get('antypical/getall')
    return data
}

export const fetchOneAntypical = async (id) => {
    const { data } = await guestInstance.get(`antypical/getone/${id}`)
    return data
}

export const createAntypical = async (antypical) => {
    const { data } = await guestInstance.post('antypical/create', antypical)
    return data
}

export const updateAntypical = async (id, antypical) => {
    const {data} = await authInstance.put(`antypical/update/${id}`, antypical)
    return data
}

export const deleteAntypical = async (id) => {
    const {data} = await authInstance.delete(`antypical/delete/${id}`)
    return data
}
