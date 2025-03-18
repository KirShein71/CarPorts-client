import { guestInstance, authInstance } from './index'

export const getAllPayment = async () => {
    const { data } = await guestInstance.get('payment/getall')
    return data
}

export const createPayment = async (payment) => {
    const { data } = await authInstance.post(`payment/create`, payment)
    return data
}

export const getOnePaymentColumn = async (id) => {
    const { data } = await guestInstance.get(`payment/getone/${id}`)
    return data
}

export const getAllPaymentForBrigade = async (id) => {
    const {data} = await guestInstance.get(`payment/getAllPaymentForBrigade/${id}`)
    return data
}

export const updatePaymentDate = async (id,  payment) => {
    const { data } = await guestInstance.put(`payment/updatePaymentDate/${id}`, payment)
    return data
}

export const updatePaymentSum = async (id,  payment) => {
    const { data } = await guestInstance.put(`payment/updatePaymentSum/${id}`, payment)
    return data
}

export const deletePayment = async(id) => {
    const { data} = await guestInstance.delete(`payment/delete/${id}`)
    return data
}
