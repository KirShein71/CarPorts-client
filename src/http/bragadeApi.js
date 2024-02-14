import { guestInstance } from './index'


export const fetchBrigades = async () => {
    const { data } = await guestInstance.get('brigade/getall')
    return data
}

export const fetchOneBrigade = async (id) => {
    const { data } = await guestInstance.get(`brigade/getone/${id}`)
    return data
} 

export const createBrigade = async (installer) => {
    const { data } = await guestInstance.post('brigade/create', installer)
    return data
}

export const deleteBrigade = async(id) => {
    const {data} = await guestInstance.delete(`brigade/delete/${id}`)
    return data
}