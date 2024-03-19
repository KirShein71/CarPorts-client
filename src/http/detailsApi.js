import { guestInstance } from './index'


export const fetchAllDetails = async () => {
    const { data } = await guestInstance.get('details/getall')
    return data
}

export const fetchDetail = async (id) => {
    const { data } = await guestInstance.get(`details/getone/${id}`)
    return data
}

export const createDetail = async (detail) => {
    const { data } = await guestInstance.post('details/create', detail)
    return data
}

export const createPrice = async (id, details) => {
    const { data } = await guestInstance.put(`details/createPrice/${id}`, details)
    return data
}

export const updateDetail = async (id, details) => {
    const { data } = await guestInstance.put(`details/update/${id}`, details)
    return data
}

export const deleteDetail = async(id) => {
    const {data} = await guestInstance.delete(`details/delete/${id}`)
    return data
}