import { guestInstance } from './index'


export const fetchAllTemplatesTasks = async () => {
    const { data } = await guestInstance.get('templatestask/getall')
    return data
}

export const getAllActiveTemplatesTask = async () => {
    const { data } = await guestInstance.get('templatestask/getAllActiveTemplatesTask')
    return data
}

export const fetchOneTemplatesTask = async (id) => {
    const { data } = await guestInstance.get(`templatestask/getone/${id}`)
    return data
}

export const createTemplatesTask = async (templatestask) => {
    const { data } = await guestInstance.post('templatestask/create', templatestask)
    return data
}


export const updateTemplatesTask = async (id, templatestasks) => {
    const { data } = await guestInstance.put(`templatestask/update/${id}`, templatestasks)
    return data
}

export const updateActiveTemplatesTask = async (id, templatestasks) => {
    const { data } = await guestInstance.patch(`templatestask/updateActiveTemplatesTask/${id}`, templatestasks)
    return data
}

export const deleteTemplatesTask = async(id) => {
    const {data} = await guestInstance.delete(`templatestask/delete/${id}`)
    return data
}