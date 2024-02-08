import { guestInstance, authInstance } from './index'
import {jwtDecode} from 'jwt-decode'

export const createAccount = async (user) => {
    const { data } = await authInstance.post(`user/create`,  user)
    return data
    }

    export const login = async (phone) => {
        try {
            const response = await guestInstance.post('user/login', {phone})
            const token = response.data.token
            const user = jwtDecode(token)
            localStorage.setItem('token', token)
            localStorage.setItem('id', user.id)
            return user
        } catch (e) {
            alert(e.response.data.message)
            return false
        }
    }

    

    export const logout = () => {
        localStorage.removeItem('token')
    }

    export const getOneAccount = async(id) => {
        const {data} = await guestInstance.get(`user/getOne/${id}`);
        return data;
      }