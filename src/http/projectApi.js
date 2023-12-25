import { guestInstance, authInstance } from './index'



export const createProject = async (project) => {
    const { data } = await guestInstance.post('project/create', project)
    return data
}

export const fetchAllProjects = async () => {
    const { data } = await guestInstance.get('project/getall')
    return data
}

export const getAllWithNoDetails = async () => {
    const { data } = await guestInstance.get('project/getAllWithNoDetails ')
    return data
}

export const getAllWithNoMaterials = async () => {
    const { data } = await guestInstance.get('project/getAllWithNoMaterials')
    return data
}

export const getAllWithNoDesing = async () => {
    const {data} = await guestInstance.get('project/getAllWithNoDesing')
    return data
}


export const getAllWithNoInstallers = async () => {
    const {data} = await guestInstance.get('project/getAllWithNoInstallers')
    return data
}


export const updateProject = async (id, project) => {
    const { data } = await authInstance.put(`project/update/${id}`, project)
    return data
}

export const fetchOneProject = async (id) => {
    const { data } = await guestInstance.get(`project/getone/${id}`)
    return data
}


