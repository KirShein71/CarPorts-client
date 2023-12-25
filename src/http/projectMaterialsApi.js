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