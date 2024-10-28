import { guestInstance } from './index'
import {jwtDecode} from 'jwt-decode'


export const getAllConstructor = async () => {
    const { data } = await guestInstance.get('constructor/getall')
    return data
}

export const fetchOneConstructor = async (id) => {
    const { data } = await guestInstance.get(`constructor/getone/${id}`)
    return data
} 

export const createConstructor = async (manager) => {
    const { data } = await guestInstance.post('constructor/create', manager)
    return data
}


export const updatePassword = async (id, manager) => {
    const { data} = await guestInstance.put(`constructor/updatePassword/${id}`, manager)
    return data
}

 
export const deleteConstructor = async(id) => {
    const {data} = await guestInstance.delete(`constructor/delete/${id}`)
    return data
}

export const login = async (phone) => {
    try {
        const response = await guestInstance.post('constructor/login', {phone})
        const token = response.data.token
        const manager = jwtDecode(token)
        localStorage.setItem('token', token)
        localStorage.setItem('id', manager.id)
        return manager
    } catch (e) {
        alert(e.response.data.message)
        return false
    }
}

export const logout = () => {
    localStorage.removeItem('token')
}