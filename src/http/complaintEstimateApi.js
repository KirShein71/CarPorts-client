import { guestInstance, authInstance } from './index'

export const getComplaintEstimate = async () => {
    const { data } = await guestInstance.get('complaint_estimate/getall')
    return data
}


export const getAllEstimateForComplaint = async (id) => {
    const {data} = await guestInstance.get(`complaint_estimate/getAllEstimateForProject/${id}`)
    return data
}

export const createComplaintEstimate = async (complaintestimate) => {
    const { data } = await authInstance.post(`complaintestimate/create`, complaintestimate)
    return data
}

export const createComplaintEstimateBrigade = async (id, complaint_estimate) => {
    const { data } = await authInstance.put(`complaint_estimate/createEstimateBrigade/${id}`, complaint_estimate)
    return data
}

export const getOneComplaintEstimateColumn = async (id) => {
    const { data } = await guestInstance.get(`complaint_estimate/getone/${id}`)
    return data
}

export const updateComplaintEstimatePrice = async (id,  complaint_estimate) => {
    const { data } = await guestInstance.put(`complaint_estimate/updateEstimatePrice/${id}`, complaint_estimate)
    return data
}

export const updateBrigadeForComplaint = async (id, complaint, complaint_estimate) => {
    const { data } = await guestInstance.put(`complaint_estimate/updateBrigadeForComplaint/${id}/${complaint}`, complaint_estimate)
    return data
}

export const deleteEstimateBrigadeForComplaint= async(id, complaint) => {
    const { data} = await guestInstance.delete(`complaint_estimate/deleteEstimateBrigadeForProject/${id}/${complaint}`)
    return data
}

export const deleteEstimate = async(id) => {
    const { data} = await guestInstance.delete(`complaint_estimate/delete/${id}`)
    return data
}

