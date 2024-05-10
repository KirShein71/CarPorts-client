import { guestInstance } from './index'
import axios from 'axios'


export const fetchUserImages = async () => {
    const { data } = await guestInstance.get('userimage/getall')
    return data
}

export const getAllUserImageByUserId = async (userId) => {
    const { data } = await guestInstance.get(`userimage/getall/${userId}`);
    return data;
}

export const fetchOneUserImage = async (id) => {
    const { data } = await guestInstance.get(`userimage/getone/${id}`)
    return data
} 

export const createUserImage = async (userimage) => {
    const { data } = await guestInstance.post('userimage/create', userimage)
    return data
}

export const updateUserImage = async (id, userimage) => {
    const { data } = await guestInstance.put(`userimage/update/${id}`, userimage)
    return data
}
 
export const deleteUserImage = async(id) => {
    const {data} = await guestInstance.delete(`userimage/delete/${id}`)
    return data
}

export const getAllRegion = async () => {
    const account = 'EMscd6r9JnFiQ3bLoyjJY6eM78JrJceI';
    const password = 'PjLZkKBHEiLK3YsjtNrt3TGNG0ahs3kG';

    const url = 'https://api.edu.cdek.ru/v2/location/regions';

    try {
        const {data} = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${btoa(`${account}:${password}`).toString('base64')}`
            }
        });

        // const regions = response.data.regions; // Пример обработки данных
        return data

    } catch (error) {
        console.error('Error fetching data from CDEK server:', error);
    }
};

