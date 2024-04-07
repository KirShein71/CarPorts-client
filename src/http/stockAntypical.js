import { guestInstance, authInstance } from './index'


export const getOneStockAntypical = async (id) => {
    const { data } = await guestInstance.get(`stockantypical/getone/${id}`)
    return data
}

export const createStockAntypical = async (stockantypical) => {
    const { data } = await authInstance.post(`stockantypical/create`, stockantypical)
    return data
}

export const updateStockAntypical = async(id, stockantypical) => {
    const {data} = await guestInstance.put(`stockantypical/update/${id}`, stockantypical)
    return data
}

