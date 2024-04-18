import { guestInstance, authInstance } from './index'
import {jwtDecode} from 'jwt-decode'

export const createAccountEmployee = async (employee) => {
    const { data } = await authInstance.post(`employee/create`,  employee)
    return data
    }

    export const login = async (phone) => {
        try {
            const response = await guestInstance.post('employee/login', {phone})
            const token = response.data.token
            const employee = jwtDecode(token)
            localStorage.setItem('token', token)
            localStorage.setItem('id', employee.id)
            return employee
        } catch (e) {
            alert(e.response.data.message)
            return false
        }
    }

    export const getAllEmployee = async () => {
        const { data} = await guestInstance.get('employee/getall')
        return data
    }

    export const getManager = async () => {
        const { data} = await guestInstance.get('employee/getManager')
        return data
    }

    export const deleteAccountEmployee = async (id) => {
        const { data } = await guestInstance.delete(`employee/delete/${id}`)
        return data
    }

    export const logout = () => {
        localStorage.removeItem('token')
    }


