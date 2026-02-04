import { guestInstance, authInstance } from './index'

export const fetchAllDeliveryDetails = async () => {
    const { data } = await guestInstance.get('deliverydetails/getall')
    return data
}

export const fetchProjectDeliveryDetails = async (projectId) => {
    const {data} = await guestInstance.get(`deliverydetails/getproject/${projectId}`);
    return data;
  }

export const createDeliveryDetails = async (deliverydetails) => {
    const { data } = await authInstance.post(`deliverydetails/create`, deliverydetails)
    return data
}

export const updateDeliveryDetails = async (id, deliverydetails) => {
    const {data} = await authInstance.put(`deliverydetails/update/${id}`, deliverydetails)
    return data
}

export const fetchOneDeliveryDetails = async (id) => {
    const { data } = await guestInstance.get(`deliverydetails/getone/${id}`)
    return data
}

export const getSumOneDeliveryDetail = async () => {
    const {data} = await guestInstance.get('deliverydetails/getSumOnedeliveryDetail')
    return data
}

export const deleteDeliveryDetails = async (projectId) => {
    const {data} = await guestInstance.delete(`deliverydetails/delete/${projectId}`)
    return data
}

export const deleteOneDeliveryDetail = async (id) => {
    const {data} = await guestInstance.delete(`deliverydetails/deleteOneDeliveryDetail/${id}`)
    return data
}
