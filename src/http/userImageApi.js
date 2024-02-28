import { guestInstance } from './index'


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