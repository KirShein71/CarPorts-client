import { guestInstance, authInstance } from './index'

export const fetchAllProjectWarehouse = async () => {
    const { data } = await guestInstance.get('projectwarehouse/getall')
    return data
}

export const fetchProjectWarehouse = async (projectId) => {
    const {data} = await guestInstance.get(`projectwarehouse/getproject/${projectId}`);
    return data;
  }

export const createProjectWarehouse = async (projectwarehouse) => {
    const { data } = await authInstance.post(`projectwarehouse/create`, projectwarehouse)
    return data
}


export const addToProduction = async (projectwarehouse) => {
    const { data } = await authInstance.post(`projectwarehouse/addToProduction`, projectwarehouse)
    return data
}

export const fetchOneProjectWarehouse = async (id) => {
    const { data } = await guestInstance.get(`projectwarehouse/getone/${id}`)
    return data
}

export const updateProjectWarehouse = async (id, projectwarehouse) => {
    const {data} = await authInstance.patch(`projectwarehouse/update/${id}`, projectwarehouse)
    return data
}

export const createNote = async (id, shipmentwarehouses) => {
    const {data} = await authInstance.patch(`projectwarehouse/createNote/${id}`, shipmentwarehouses)
    return data
}

export const deleteNote = async (id) => {
    const { data } = await guestInstance.delete(`projectwarehouse/deleteNote/${id}`);
    return data;
};

export const deleteProjectWarehouse = async (projectId) => {
    const {data} = await guestInstance.delete(`projectwarehouse/delete/${projectId}`)
    return data
}

export const deleteOneWarehouseDetail = async (id) => {
    const {data} = await guestInstance.delete(`projectwarehouse/deleteOneWarehouseDetail/${id}`)
    return data
}