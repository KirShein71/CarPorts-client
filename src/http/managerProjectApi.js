import { guestInstance } from './index'
import {jwtDecode} from 'jwt-decode'


export const getAllManagerProject = async () => {
    const { data } = await guestInstance.get('managerproject/getall')
    return data
}

export const fetchOneManagerProject = async (id) => {
    const { data } = await guestInstance.get(`managerproject/getone/${id}`)
    return data
} 

export const createManagerProject = async (manager) => {
    const { data } = await guestInstance.post('managerproject/create', manager)
    return data
}


export const updatePassword = async (id, manager) => {
    const { data} = await guestInstance.put(`managerproject/updatePassword/${id}`, manager)
    return data
}

 
export const deleteManagerProject = async(id) => {
    const {data} = await guestInstance.delete(`managerproject/delete/${id}`)
    return data
}

export const login = async (phone) => {
    try {
        const response = await guestInstance.post('managerproject/login', {phone})
        const token = response.data.token
        const manager = jwtDecode(token)
        localStorage.setItem('token', token)
        localStorage.setItem('id', manager.id)
        localStorage.setItem('id', manager.name)
        return manager
    } catch (e) {
        alert(e.response.data.message)
        return false
    }
}

export const logout = () => {
    localStorage.removeItem('token')
}