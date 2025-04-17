import { guestInstance } from './index'
import {jwtDecode} from 'jwt-decode'


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

export const createPassword = async (id, brigade) => {
    const { data} = await guestInstance.put(`brigade/createPassword/${id}`, brigade)
    return data
}

export const updateBrigade = async (id, brigade) => {
    const { data } = await guestInstance.put(`brigade/update/${id}`, brigade)
    return data
}

export const updateBrigadeName = async (id, brigade) => {
    const { data } = await guestInstance.put(`brigade/updateBrigadeName/${id}`, brigade)
    return data
}

export const updateBrigadePhone = async (id, brigade) => {
    const { data } = await guestInstance.put(`brigade/updateBrigadePhone/${id}`, brigade)
    return data
}
 
export const deleteBrigade = async(id) => {
    const {data} = await guestInstance.delete(`brigade/delete/${id}`)
    return data
}

export const login = async (phone) => {
    try {
        const response = await guestInstance.post('brigade/login', {phone})
        const token = response.data.token
        const brigade = jwtDecode(token)
        localStorage.setItem('token', token)
        localStorage.setItem('id', brigade.id)
        return brigade
    } catch (e) {
        alert(e.response.data.message)
        return false
    }
}

export const logout = () => {
    localStorage.removeItem('token')
}