import { guestInstance } from './index'


export const fetchUserFiles = async () => {
    const { data } = await guestInstance.get('userfile/getall')
    return data
}

export const getAllUserFileByUserId = async (userId) => {
    const { data } = await guestInstance.get(`userfile/getall/${userId}`);
    return data;
}

export const fetchOneUserFile = async (id) => {
    const { data } = await guestInstance.get(`userfile/getone/${id}`)
    return data
} 

export const createUserFile = async (userfile) => {
    const { data } = await guestInstance.post('userfile/create', userfile)
    return data
}

export const updateUserFile = async (id, userfile) => {
    const { data } = await guestInstance.put(`userfile/update/${id}`, userfile)
    return data
}
 
export const deleteUserFile = async(id) => {
    const {data} = await guestInstance.delete(`userfile/delete/${id}`)
    return data
}