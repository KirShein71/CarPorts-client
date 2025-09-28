import { guestInstance, authInstance } from './index'
import {jwtDecode} from 'jwt-decode'

export const createAccount = async (user) => {
    const { data } = await authInstance.post(`user/create`,  user)
    return data
    }

    export const login = async (phone,password) => {
        try {
            const response = await authInstance.post('user/login', {phone, password})
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


    export const check = async () => {
        let userToken, userData
        try {
            userToken = localStorage.getItem('token')
            // если в хранилище нет действительного токена
            if (!userToken) {
                return false
            }
            // токен есть, надо проверить его подлинность
            const response = await authInstance.get('user/check')
            userToken = response.data.token
            userData = jwtDecode(userToken)
            localStorage.setItem('token', userToken)
            return userData
        } catch(e) {
            localStorage.removeItem('token')
            return false
        }
    }


    export const logout = () => {
        localStorage.removeItem('token')
    }

    export const getOneAccount = async(id) => {
        const {data} = await guestInstance.get(`user/getOneAccount/${id}`);
        return data;
    }

    export const getOneAccountByToken = async(token) => {
        const {data} = await guestInstance.get(`user/getOneAccountByToken/${token}`);
        return data;
    }

    export const getOne = async(id) => {
        const {data} = await guestInstance.get(`user/getOne/${id}`);
        return data;
    }

    export const getAllUser = async() => {
        const { data } = await guestInstance.get('user/getall');
        return data
    }

    export const createManager = async(id, user) => {
        const { data } = await guestInstance.put(`user/createManager/${id}`, user);
        return data
    }

    export const createBrigade = async(id, user) => {
        const { data } = await guestInstance.put(`user/createBrigade/${id}`, user);
        return data
    }

    export const createMainImage = async (id, user) => {
        const { data } = await guestInstance.put(`user/createMainImage/${id}`, user)
        return data
    }

    export const getUserForBrigade = async(projectId) => {
        const {data} = await guestInstance.get(`user/getUserForBrigade/${projectId}`);
        return data;
    }

    export const updatePhone = async(id, user) => {
        const { data } = await guestInstance.put(`user/updatePhone/${id}`, user);
        return data
    }

    export const updatePassword = async(id, user) => {
        const { data } = await guestInstance.put(`user/updatePassword/${id}`, user);
        return data
    }

    export const generationUrlForClientAccount = async(id, user) => {
        const {data} = await guestInstance.put(`user/generationUrlForClientAccount/${id}`, user);
        return data;
    }

    

    export const deleteUser = async(id) => {
        const { data } = await guestInstance.delete(`user/delete/${id}`);
        return data
    }