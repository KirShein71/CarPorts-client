import { guestInstance, authInstance } from './index'

export const fetchAllProjectDetails = async () => {
    const { data } = await guestInstance.get('projectdetails/getall')
    return data
}

export const fetchProjectDetails = async (projectId) => {
    const {data} = await guestInstance.get(`projectdetails/getproject/${projectId}`);
    return data;
  }

export const createProjectDetails = async (projectdetails) => {
    const { data } = await authInstance.post(`projectdetails/create`, projectdetails)
    return data
}

export const createColorProjectDetails = async (id, projectdetails) => {
    const {data} = await authInstance.put(`projectdetails/createColor/${id}`, projectdetails)
    return data
}

export const addToProduction = async (projectdetails) => {
    const { data } = await authInstance.post(`projectdetails/addToProduction`, projectdetails)
    return data
}

export const fetchOneProjectDetails = async (id) => {
    const { data } = await guestInstance.get(`projectdetails/getone/${id}`)
    return data
}

export const updateProjectDetails = async (id, projectdetails) => {
    const {data} = await authInstance.put(`projectdetails/update/${id}`, projectdetails)
    return data
}

export const deleteProjectDetails = async (projectId) => {
    const {data} = await guestInstance.delete(`projectdetails/delete/${projectId}`)
    return data
}

export const deleteOneProjectDetail = async (id) => {
    const {data} = await guestInstance.delete(`projectdetails/deleteOneProjectDetail/${id}`)
    return data
}
