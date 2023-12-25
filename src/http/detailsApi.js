import { guestInstance } from './index'


export const fetchAllDetails = async () => {
    const { data } = await guestInstance.get('details/getall')
    return data
}

export const fetchDetail = async (id) => {
    const { data } = await guestInstance.get(`details/getone/${id}`)
    return data
}