import { guestInstance, authInstance } from './index'

export const fetchAllProjectBrigades = async () => {
    const { data } = await guestInstance.get('projectbrigades/getall')
    return data
}

export const createProjectBrigades = async (projectbrigades) => {
    const { data } = await authInstance.post(`projectbrigades/create`, projectbrigades)
    return data
}

export const fetchOneProjectBrigades = async (id) => {
    const { data } = await guestInstance.get(`projectbrigades/getone/${id}`)
    return data
}

export const fetchProjectBrigades = async (projectId) => {
    const {data} = await guestInstance.get(`projectbrigades/getproject/${projectId}`);
    return data;
}


export const createPlanStart = async (id, projectbrigades) => {
    const { data } = await guestInstance.put(`projectbrigades/createPlanStart/${id}`, projectbrigades)
    return data
}

export const createPlanFinish = async (id, projectbrigades) => {
    const { data } = await guestInstance.put(`projectbrigades/createPlanFinish/${id}`, projectbrigades)
    return data
}
