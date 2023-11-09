import { guestInstance } from './index'


export const fetchMaterials = async () => {
    const { data } = await guestInstance.get('materials/getall')
    return data
}

export const fetchMaterial = async (id) => {
    const { data } = await guestInstance.get(`materials/getone/${id}`)
    return data
}