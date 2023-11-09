import { guestInstance, authInstance } from './index'



export const createProject = async (project) => {
    const { data } = await guestInstance.post('project/create', project)
    return data
}

export const fetchAllProjects = async () => {
    const { data } = await guestInstance.get('project/getall')
    return data
}

export const updateProject = async (id, project) => {
    const { data } = await authInstance.put(`project/update/${id}`, project)
    return data
}

export const fetchOneProject = async (id) => {
    const { data } = await guestInstance.get(`project/getone/${id}`)
    return data
}

export const fetchAllProperty = async () => {
    const { data } = await guestInstance.get('projectmaterials/getall')
    return data
}

export const fetchProjectMaterials = async (projectId) => {
    const {data} = await guestInstance.get(`projectmaterials/getproject/${projectId}`);
    return data;
  }

export const createProperty = async (projectmaterials) => {
    const { data } = await authInstance.post(`projectmaterials/create`, projectmaterials)
    return data
}

export const fetchOneProperty = async (id) => {
    const { data } = await guestInstance.get(`projectmaterials/getone/${id}`)
    return data
}
