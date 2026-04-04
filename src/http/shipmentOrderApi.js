import { guestInstance, authInstance } from './index'

export const getAllShipmentOrder = async () => {
    const { data } = await guestInstance.get('shipmentorder/getall')
    return data
}

export const getAllShipmentOrderForProject = async (projectId) => {
    const { data } = await guestInstance.get(`shipmentorder/getAllShipmentOrderForProject/${projectId}`)
    return data
}

export const getAllForShipmentOrderProject = async (projectId, date) => {
    const { data } = await guestInstance.get(`shipmentorder/getAllForShipmentOrderProject/${projectId}/${date}`)
    return data
}

export const fetchOneShipmentOrderDetail = async (id) => {
    const { data } = await guestInstance.get(`shipmentorder/getone/${id}`)
    return data
}

export const createShipmentOrder = async (date, projectId) => {
  const { data } = await authInstance.post(`shipmentorder/createShipmentOrder/${date}/${projectId}`);
  return data;
}

export const createShipmentOrderDetails = async (shipmentorder) => {
    const { data } = await authInstance.post(`shipmentorder/create`, shipmentorder)
    return data
}

export const createShipmentOrderAntypical = async (shipmentorder) => {
    const { data } = await authInstance.post(`shipmentorder/createAntypical`, shipmentorder)
    return data
}

export const createDateInShipmentOrderWithNoDate = async (projectId, data) => {
  const { data: response } = await authInstance.put(
    `shipmentorder/createDateInShipmentOrderWithNoDate/${projectId}`,
    data
  );
  return response;
};

export const updateShipmentOrderDetails = async (id, shipmentorder) => {
    const {data} = await authInstance.put(`shipmentorder/update/${id}`, shipmentorder)
    return data
}

export const deleteOneShipmentOrderDetail = async (id) => {
    const {data} = await guestInstance.delete(`shipmentorder/deleteOneShipmentOrderDetail/${id}`)
    return data
}