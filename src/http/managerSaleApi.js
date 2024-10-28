import { guestInstance } from './index'
import {jwtDecode} from 'jwt-decode'


export const getAllManagerSale = async () => {
    const { data } = await guestInstance.get('managersale/getall')
    return data
}

export const fetchOneManagerSale = async (id) => {
    const { data } = await guestInstance.get(`managersale/getone/${id}`)
    return data
} 

export const createManagerSale = async (manager) => {
    const { data } = await guestInstance.post('managersale/create', manager)
    return data
}


export const updatePassword = async (id, manager) => {
    const { data} = await guestInstance.put(`managersale/updatePassword/${id}`, manager)
    return data
}

 
export const deleteManagerSale = async(id) => {
    const {data} = await guestInstance.delete(`managersale/delete/${id}`)
    return data
}

export const login = async (phone) => {
    try {
        const response = await guestInstance.post('managersale/login', {phone})
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