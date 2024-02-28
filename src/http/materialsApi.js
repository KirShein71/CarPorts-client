import { guestInstance } from './index'


export const fetchMaterials = async () => {
    const { data } = await guestInstance.get('materials/getall')
    return data
}

export const fetchMaterial = async (id) => {
    const { data } = await guestInstance.get(`materials/getone/${id}`)
    return data
}

export const createMaterial = async (material) => {
    const { data } = await guestInstance.post('materials/create', material)
    return data
}

export const updateMaterial = async(id, materials) => {
    const {data} = await guestInstance.put(`materials/update/${id}`, materials)
    return data
}

export const deleteMaterial = async(id) => {
    const {data} = await guestInstance.delete(`materials/delete/${id}`)
    return data
}