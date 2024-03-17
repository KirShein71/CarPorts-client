import { guestInstance, authInstance } from './index'

export const fetchAllStockDetails = async () => {
    const { data } = await guestInstance.get('stockdetails/getall')
    return data
}



export const getOneStockDetails = async (id) => {
    const { data } = await guestInstance.get(`stockdetails/getone/${id}`)
    return data
}

export const createStockDetails = async (stockdetails) => {
    const { data } = await authInstance.post(`stockdetails/create`, stockdetails)
    return data
}

export const updateStockDetails = async(id, stockdetails) => {
    const {data} = await guestInstance.put(`stockdetails/update/${id}`, stockdetails)
    return data
}

export const getSumOneDetail = async () => {
    const {data} = await guestInstance.get('stockdetails/getSumOneDetail')
    return data
}

export const deleteStockDetails = async (stock_date) => {
    const {data} = await guestInstance.delete(`stockdetails/delete/${stock_date}`)
    return data
}

