import { guestInstance, authInstance } from './index'


export const fetchAllAntypical = async () => {
    const { data } = await guestInstance.get('antypical/getall')
    return data
}

export const getAllAntypiclasForProject = async (id) => {
    const { data } = await guestInstance.get(`antypical/getAllAntypiclasForProject/${id}`)
    return data
}

export const getAllForAntypicalsShipment = async () => {
    const { data } = await guestInstance.get('antypical/getAllForAntypicalsShipment')
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

export const createColor = async (id, antypical) => {
    const {data} = await authInstance.put(`antypical/createColor/${id}`, antypical)
    return data
}

export const createName = async (id, antypical) => {
    const {data} = await authInstance.put(`antypical/createName/${id}`, antypical)
    return data
}

export const createAntypicalsQuantity = async (id, antypical) => {
    const {data} = await authInstance.put(`antypical/createAntypicalsQuantity/${id}`, antypical)
    return data
}

export const createAntypicalsShipmentQuantity = async (id, antypical) => {
    const {data} = await authInstance.put(`antypical/createAntypicalsShipmentQuantity/${id}`, antypical)
    return data
}

export const createAntypicalsWeldersQuantity = async (id, antypical) => {
    const {data} = await authInstance.put(`antypical/createAntypicalsWeldersQuantity/${id}`, antypical)
    return data
}

export const createAntypicalsDeliveryQuantity = async (id, antypical) => {
    const {data} = await authInstance.put(`antypical/createAntypicalsDeliveryQuantity/${id}`, antypical)
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
