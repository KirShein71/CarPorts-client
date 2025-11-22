import { guestInstance } from './index'



export const fetchDesigners = async () => {
    const { data } = await guestInstance.get('designer/getall')
    return data
}

export const getAllActiveDesigner = async () => {
    const { data } = await guestInstance.get('designer/getAllActiveDesigner')
    return data
}


export const fetchOneDesigner = async (id) => {
    const { data } = await guestInstance.get(`designer/getone/${id}`)
    return data
} 

export const createDesigner = async (installer) => {
    const { data } = await guestInstance.post('designer/create', installer)
    return data
}


export const updateActiveDesigner = async (id, designer) => {
    const { data } = await guestInstance.put(`designer/updateActiveDesigner/${id}`, designer)
    return data
}

export const updateDesignerName = async (id, designer) => {
    const { data } = await guestInstance.put(`designer/updateDesignerName/${id}`, designer)
    return data
}

 
export const deleteDesigner = async(id) => {
    const {data} = await guestInstance.delete(`designer/delete/${id}`)
    return data
}

