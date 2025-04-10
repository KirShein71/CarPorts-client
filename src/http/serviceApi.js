import { guestInstance } from './index'


export const getAllService = async () => {
    const { data } = await guestInstance.get('service/getall')
    return data
}

export const getOneService = async (id) => {
    const { data } = await guestInstance.get(`service/getone/${id}`)
    return data
}

export const createService = async (service) => {
    const { data } = await guestInstance.post('service/create', service)
    return data
}

export const updateService = async(id, services) => {
    const {data} = await guestInstance.put(`service/update/${id}`, services)
    return data
}

export const updateServiceNumber = async(id, services) => {
    const {data} = await guestInstance.put(`service/updateNumber/${id}`, services)
    return data
}

export const deleteService = async(id) => {
    const {data} = await guestInstance.delete(`service/delete/${id}`)
    return data
}