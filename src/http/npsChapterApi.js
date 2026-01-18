import { guestInstance } from './index'


export const getAllNpsChapter = async () => {
    const { data } = await guestInstance.get('npschapter/getall')
    return data
}

export const getOneNpsChapter = async (id) => {
    const { data } = await guestInstance.get(`npschapter/getone/${id}`)
    return data
}

export const createNpsChapter = async (npschapter) => {
    const { data } = await guestInstance.post('npschapter/create', npschapter)
    return data
}

export const updateNpsChapterName = async(id, npschapters) => {
    const {data} = await guestInstance.put(`npschapter/updateName/${id}`, npschapters)
    return data
}

export const updateNpsChapterNumber = async(id, npschapters) => {
    const {data} = await guestInstance.put(`npschapter/updateNumber/${id}`, npschapters)
    return data
}

export const deleteNpsChapter = async(id) => {
    const {data} = await guestInstance.delete(`npschapter/delete/${id}`)
    return data
}