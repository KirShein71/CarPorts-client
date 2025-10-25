import { guestInstance, authInstance } from './index'

export const getAllProjectExamination = async () => {
    const { data } = await authInstance.get(`projectexamination/getAll`)
    return data
}

export const getAllProjectBrigadeExamination = async (brigadeId, projectId) => {
    const { data } = await guestInstance.get(`projectexamination/getAllProjectBrigadeExamination/${brigadeId}/${projectId}`)
    return data
}

export const getAllExaminationForProject = async (id) => {
    const {data} = await guestInstance.get(`projectexamination/getAllExaminationForProject/${id}`)
    return data
}

export const createProjectExanamination = async (projectexamination) => {
    const { data } = await authInstance.post(`projectexamination/create`, projectexamination)
    return data
}

export const updateResult = async (id, result) => {
    const { data } = await guestInstance.put(`projectexamination/updateResult/${id}`, { result });
    return data;
}

export const deleteProjectExanamination = async (id, projectexamination) => {
    const {data} = await guestInstance.delete(`projectexamination/delete/${id}`, projectexamination)
    return data
}

export const deleteAllProjectBrigade = async ( projectId, brigadeId,) => {
    const { data } = await guestInstance.delete(`projectexamination/deleteAllProjectBrigade/${projectId}/${brigadeId}`)
    return data
}


