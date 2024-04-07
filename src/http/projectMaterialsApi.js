import { guestInstance, authInstance } from './index'

export const fetchAllProjectMaterials = async () => {
    const { data } = await guestInstance.get('projectmaterials/getall')
    return data
}

export const fetchProjectMaterials = async (projectId) => {
    const {data} = await guestInstance.get(`projectmaterials/getproject/${projectId}`);
    return data;
  }

export const createProjectMaterials = async (projectmaterials) => {
    const { data } = await authInstance.post(`projectmaterials/create`, projectmaterials)
    return data
}

export const fetchOneProjectMaterials = async (id) => {
    const { data } = await guestInstance.get(`projectmaterials/getone/${id}`)
    return data
}

export const createCheckProjectMaterials = async(id, projectmaterials) => {
    const {data} = await guestInstance.put(`projectmaterials/createCheckProjectMaterials/${id}`, projectmaterials)
    return data
}

export const deleteCheckProjectMaterials = async (id) => {
    const { data } = await guestInstance.delete(`projectmaterials/deleteCheckProjectMaterials/${id}`);
    return data;
};

export const createExpirationDateProjectMaterials = async(id, projectmaterials) => {
    const {data} = await guestInstance.put(`projectmaterials/createExpirationDateProjectMaterials/${id}`, projectmaterials)
    return data
}

export const createReadyDateProjectMaterials = async(id, projectmaterials) => {
    const {data} = await guestInstance.put(`projectmaterials/createReadyDateProjectMaterials/${id}`, projectmaterials)
    return data
}

export const createPaymentDateProjectMaterials = async(id, projectmaterials) => {
    const {data} = await guestInstance.put(`projectmaterials/createPaymentDateProjectMaterials/${id}`, projectmaterials)
    return data
}

export const createShippingDateProjectMaterials = async(id, projectmaterials) => {
    const {data} = await guestInstance.put(`projectmaterials/createShippingDateProjectMaterials/${id}`, projectmaterials)
    return data
}

export const createExpirationMaterialDateProjectMaterials = async(id, projectmaterials) => {
    const {data} = await guestInstance.put(`projectmaterials/createExpirationMaterialDateProjectMaterials/${id}`, projectmaterials)
    return data
}

export const deleteProjectMaterials = async(id) => {
    const { data} = await guestInstance.delete(`projectmaterials/delete/${id}`)
    return data
}