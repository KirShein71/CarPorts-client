import { guestInstance, authInstance } from './index'

export const getAllComplaintPayment = async () => {
    const { data } = await guestInstance.get('complaintpayment/getall')
    return data
}

export const createComplaintPayment = async (complaintpayment) => {
    const { data } = await authInstance.post(`complaintpayment/create`, complaintpayment)
    return data
}

export const getOneComplaintPaymentColumn = async (id) => {
    const { data } = await guestInstance.get(`complaintpayment/getone/${id}`)
    return data
}

export const getAllComplaintPaymentForBrigade = async (id) => {
    const {data} = await guestInstance.get(`complaintpayment/getAllPaymentForBrigade/${id}`)
    return data
}

export const updateComplaintPaymentDate = async (id,  complaintpayment) => {
    const { data } = await guestInstance.put(`complaintpayment/updatePaymentDate/${id}`, complaintpayment)
    return data
}

export const updateComplaintPaymentSum = async (id,  complaintpayment) => {
    const { data } = await guestInstance.put(`complaintpayment/updatePaymentSum/${id}`, complaintpayment)
    return data
}

export const deleteComplaintPayment = async(id) => {
    const { data} = await guestInstance.delete(`complaintpayment/delete/${id}`)
    return data
}
