import { guestInstance, authInstance } from './index'

export const getEstimate = async () => {
    const { data } = await guestInstance.get('estimate/getall')
    return data
}

export const getAllEstimateForBrigade = async (id) => {
    const {data} = await guestInstance.get(`estimate/getAllEstimateForBrigade/${id}`)
    return data
}

export const getAllEstimateForBrigadeProject = async (id, project) => {
    const {data} = await guestInstance.get(`estimate/getAllEstimateForBrigadeProject/${id}/${project}`)
    return data
}

export const getAllEstimateForProject = async (id) => {
    const {data} = await guestInstance.get(`estimate/getAllEstimateForProject/${id}`)
    return data
}

export const createEstimate = async (estimate) => {
    const { data } = await authInstance.post(`estimate/create`, estimate)
    return data
}

export const createEstimateBrigade = async (id, estimate) => {
    const { data } = await authInstance.put(`estimate/createEstimateBrigade/${id}`, estimate)
    return data
}

export const getOneEstimateColumn = async (id) => {
    const { data } = await guestInstance.get(`estimate/getone/${id}`)
    return data
}

export const updateEstimatePrice = async (id,  estimate) => {
    const { data } = await guestInstance.put(`estimate/updateEstimatePrice/${id}`, estimate)
    return data
}

export const updateBrigadeForProject = async (id, project, estimate) => {
    const { data } = await guestInstance.put(`estimate/updateBrigadeForProject/${id}/${project}`, estimate)
    return data
}

export const deleteEstimateBrigadeForProject= async(id, project) => {
    const { data} = await guestInstance.delete(`estimate/deleteEstimateBrigadeForProject/${id}/${project}`)
    return data
}

export const deleteEstimate = async(id) => {
    const { data} = await guestInstance.delete(`estimate/delete/${id}`)
    return data
}

