import { guestInstance, authInstance } from './index'

export const getAllProjectTask = async () => {
    const { data } = await guestInstance.get('projecttask/getall')
    return data
}

export const getAllTaskForProject = async (id) => {
    const {data} = await guestInstance.get(`projecttask/getAllTaskForProject/${id}`);
    return data;
  }

export const createProjectTask = async (projecttask) => {
    const { data } = await authInstance.post(`projecttask/create`, projecttask)
    return data
}


export const getOneProjectTask = async (id) => {
    const { data } = await guestInstance.get(`projecttask/getone/${id}`)
    return data
}

export const updateProjectTask = async (id, projecttask) => {
    const {data} = await authInstance.put(`projecttask/update/${id}`, projecttask)
    return data
}

export const updateActiveProjectTask = async (id, projecttask) => {
    const {data} = await authInstance.patch(`projecttask/updateActiveProjectTask/${id}`, projecttask)
    return data
}

export const deleteTask = async (id) => {
    const {data} = await guestInstance.delete(`projecttask/deleteTask/${id}`)
    return data
}