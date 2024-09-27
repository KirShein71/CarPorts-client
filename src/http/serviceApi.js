import { guestInstance } from './index'


export const getAllService = async () => {
    const { data } = await guestInstance.get('service/getall')
    return data
}

export const getOneService = async (id) => {
    const { data } = await guestInstance.get(`service/getone/${id}`)
    return data
}

export const createService = async (material) => {
    const { data } = await guestInstance.post('service/create', material)
    return data
}

export const updateService = async(id, materials) => {
    const {data} = await guestInstance.put(`service/update/${id}`, materials)
    return data
}

export const deleteService = async(id) => {
    const {data} = await guestInstance.delete(`service/delete/${id}`)
    return data
}