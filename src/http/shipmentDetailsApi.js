import { guestInstance, authInstance } from './index'

export const fetchAllShipmentDetails = async () => {
    const { data } = await guestInstance.get('shipmentdetails/getall')
    return data
}

export const fetchProjectShipmentDetails = async (projectId) => {
    const {data} = await guestInstance.get(`shipmentdetails/getproject/${projectId}`);
    return data;
  }

export const createShipmentDetails = async (shipmentdetails) => {
    const { data } = await authInstance.post(`shipmentdetails/create`, shipmentdetails)
    return data
}

export const updateShipmentDetails = async (id, shipmentdetails) => {
    const {data} = await authInstance.put(`shipmentdetails/update/${id}`, shipmentdetails)
    return data
}

export const fetchOneShipmentDetails = async (id) => {
    const { data } = await guestInstance.get(`shipmentdetails/getone/${id}`)
    return data
}

export const getSumOneShipmentDetail = async () => {
    const {data} = await guestInstance.get('shipmentdetails/getSumOneShipmentDetail')
    return data
}

export const deleteShipmentDetails = async (projectId) => {
    const {data} = await guestInstance.delete(`shipmentdetails/delete/${projectId}`)
    return data
}

export const deleteOneShipmentDetail = async (id) => {
    const {data} = await guestInstance.delete(`shipmentdetails/deleteOneShipmentDetail/${id}`)
    return data
}
