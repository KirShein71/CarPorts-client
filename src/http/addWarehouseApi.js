import { guestInstance, authInstance } from './index'

export const getAllWarehouseDetail = async () => {
    const { data } = await guestInstance.get('addwarehouse/getall')
    return data
}


export const getOneWarehouseDetails = async (id) => {
    const { data } = await guestInstance.get(`addwarehouse/getone/${id}`)
    return data
}

export const createWarehouseDetails = async (addwarehouse) => {
    const { data } = await authInstance.post(`addwarehouse/create`, addwarehouse)
    return data
}

export const updateWarehouseDetails = async(id, addwarehouse) => {
    const {data} = await guestInstance.put(`addwarehouse/update/${id}`, addwarehouse)
    return data
}

export const getSumOneWarehouseDetail = async () => {
    const {data} = await guestInstance.get('addwarehouse/getSumOneWarehouseDetail')
    return data
}

export const getCostPriceOneWarehouseDetail = async () => {
    const {data} = await guestInstance.get('addwarehouse/getCostPriceOneWarehouseDetail')
    return data
}

export const deleteWarehouseDetails = async (date) => {
    const {data} = await guestInstance.delete(`addwarehouse/delete/${date}`)
    return data
}

