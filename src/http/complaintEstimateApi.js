import { guestInstance, authInstance } from './index'

export const getComplaintEstimate = async () => {
    const { data } = await guestInstance.get('complaint_estimate/getall')
    return data
}


export const getAllEstimateForComplaint = async (id) => {
    const {data} = await guestInstance.get(`complaintestimate/getAllEstimateForComplaint/${id}`)
    return data
}

export const getAllEstimateForBrigadeComplaint = async (id, complaint) => {
    const {data} = await guestInstance.get(`complaintestimate/getAllEstimateForBrigadeComplaint/${id}/${complaint}`)
    return data
}

export const getAllComplaintEstimateForBrigadeForAllProject = async (id) => {
    const {data} = await guestInstance.get(`complaintestimate/getAllComplaintEstimateForBrigadeForAllProject/${id}`)
    return data
}

export const createComplaintEstimate = async (complaintestimate) => {
    const { data } = await authInstance.post(`complaintestimate/create`, complaintestimate)
    return data
}

export const createComplaintEstimateBrigade = async (id, complaintestimate) => {
    const { data } = await authInstance.put(`complaintestimate/createEstimateBrigade/${id}`, complaintestimate)
    return data
}

export const getOneComplaintEstimateColumn = async (id) => {
    const { data } = await guestInstance.get(`complaintestimate/getone/${id}`)
    return data
}

export const updateComplaintEstimatePrice = async (id,  complaintestimate) => {
    const { data } = await guestInstance.put(`complaintestimate/updateEstimatePrice/${id}`, complaintestimate)
    return data
}

export const updateBrigadeForComplaint = async (id, complaint, complaintestimate) => {
    const { data } = await guestInstance.put(`complaintestimate/updateBrigadeForComplaint/${id}/${complaint}`, complaintestimate)
    return data
}

export const deleteEstimateBrigadeForComplaint= async(id, complaint) => {
    const { data} = await guestInstance.delete(`complaintestimate/deleteEstimateBrigadeForComplaint/${id}/${complaint}`)
    return data
}

export const deleteComplaintEstimate = async(id) => {
    const { data} = await guestInstance.delete(`complaintestimate/delete/${id}`)
    return data
}



