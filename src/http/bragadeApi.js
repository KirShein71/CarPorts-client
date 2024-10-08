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

export const createRegion = async (id, brigade) => {
    const { data} = await guestInstance.put(`brigade/createRegion/${id}`, brigade)
    return data
}

export const updateBrigade = async (id, brigade) => {
    const { data } = await guestInstance.put(`brigade/update/${id}`, brigade)
    return data
}
 
export const deleteBrigade = async(id) => {
    const {data} = await guestInstance.delete(`brigade/delete/${id}`)
    return data
}