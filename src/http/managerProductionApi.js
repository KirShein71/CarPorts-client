import { guestInstance } from './index'
import {jwtDecode} from 'jwt-decode'


export const getAllManagerProduction = async () => {
    const { data } = await guestInstance.get('managerproduction/getall')
    return data
}

export const fetchOneManagerProduction = async (id) => {
    const { data } = await guestInstance.get(`managerproduction/getone/${id}`)
    return data
} 

export const createManagerProduction = async (manager) => {
    const { data } = await guestInstance.post('managerproduction/create', manager)
    return data
}


export const updatePassword = async (id, manager) => {
    const { data} = await guestInstance.put(`managerproduction/updatePassword/${id}`, manager)
    return data
}

 
export const deleteManagerProduction = async(id) => {
    const {data} = await guestInstance.delete(`managerproduction/delete/${id}`)
    return data
}

export const login = async (phone) => {
    try {
        const response = await guestInstance.post('managerproduction/login', {phone})
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