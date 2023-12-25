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

export const fetchOneProjectDetails = async (id) => {
    const { data } = await guestInstance.get(`projectdetails/getone/${id}`)
    return data
}