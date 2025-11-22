import { guestInstance } from './index'



export const fetchCoefficients = async () => {
    const { data } = await guestInstance.get('coefficient/getall')
    return data
}


export const fetchOneCoefficient = async (id) => {
    const { data } = await guestInstance.get(`coefficient/getone/${id}`)
    return data
} 

export const createCoefficient = async (coefficient) => {
    const { data } = await guestInstance.post('coefficient/create', coefficient)
    return data
}


export const updateCoefficientName = async (id, coefficient) => {
    const { data } = await guestInstance.put(`coefficient/updatecoefficientName/${id}`, coefficient)
    return data
}

export const updateCoefficientNumber = async (id, coefficient) => {
    const { data } = await guestInstance.put(`coefficient/updatecoefficientNumber/${id}`, coefficient)
    return data
}
 
export const deleteCoefficient = async(id) => {
    const {data} = await guestInstance.delete(`coefficient/delete/${id}`)
    return data
}

