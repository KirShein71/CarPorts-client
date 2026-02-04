import { guestInstance, authInstance } from './index'

export const fetchAllShipmentWarehouse = async () => {
    const { data } = await guestInstance.get('shipmentwarehouse/getall')
    return data
}


export const createShipmentWarehouse = async (shipmentwarehouse) => {
    const { data } = await authInstance.post(`shipmentwarehouse/create`, shipmentwarehouse)
    return data
}


export const fetchOneShipmentWarehouse = async (id) => {
    const { data } = await guestInstance.get(`shipmentwarehouse/getone/${id}`)
    return data
}

export const deleteOneShipmentWarehouse = async (id) => {
    const {data} = await guestInstance.delete(`shipmentwarehouse/delete/${id}`)
    return data
}