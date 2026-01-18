import { guestInstance } from './index'

export const getAllNpsProject = async () => {
    const { data } = await guestInstance.get('npsproject/getall')
    return data
}

export const getAllNpsForProject = async (projectId) => {
    const { data } = await guestInstance.get(`npsproject/getForProject/${projectId}`)
    return data
}

export const getOneNpsProject = async (id) => {
    const { data } = await guestInstance.get(`npsproject/getone/${id}`)
    return data
}

export const createNpsProject = async (npsproject) => {
    const { data } = await guestInstance.post('npsproject/create', npsproject)
    return data
}

export const updateNpsProjectScore = async(id, npsprojects) => {
    const {data} = await guestInstance.put(`npsproject/updateScore/${id}`, npsprojects)
    return data
}

export const deleteNpsProject = async(id) => {
    const {data} = await guestInstance.delete(`npsproject/delete/${id}`)
    return data
}

export const getNoteForProject = async (projectId) => {
    const { data } = await guestInstance.get(`npsproject/getNoteForProject/${projectId}`)
    return data
}

export const createNpsNote = async (npsproject) => {
    const { data } = await guestInstance.post('npsproject/createNote', npsproject)
    return data
}

export const updateNpsProjeNote = async(id, npsprojects) => {
    const {data} = await guestInstance.put(`npsproject/updateNote/${id}`, npsprojects)
    return data
}

export const deleteNpsNote = async(id) => {
    const {data} = await guestInstance.delete(`npsproject/deleteNote/${id}`)
    return data
}