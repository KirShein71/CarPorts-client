import { guestInstance, authInstance } from './index'



export const createProject = async (project) => {
    const { data } = await guestInstance.post('project/create', project)
    return data
}

export const createDateFinish = async (id, project) => {
    const { data} = await guestInstance.put(`project/createDateFinish/${id}`, project)
    return data
}

export const restoreProject = async (id) => {
    const { data} = await guestInstance.delete(`project/restoreProject/${id}`)
    return data
}

export const closedProject = async (id, project) => {
    const { data} = await guestInstance.put(`project/closedProject/${id}`, project)
    return data
}

export const createRegion = async (id, project) => {
    const { data} = await guestInstance.put(`project/createRegion/${id}`, project)
    return data
}

export const createInstallationBilling = async (id, project) => {
    const { data} = await guestInstance.put(`project/createInstallationBilling/${id}`, project)
    return data
}

export const fetchAllProjects = async () => {
    const { data } = await guestInstance.get('project/getall')
    return data
}

export const getFinishProject = async () => {
    const { data } = await guestInstance.get('project/getFinishProject')
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

export const getAllProjectsWithNoInBrigadesDate = async () => {
    const { data } = await guestInstance.get('project/getAllProjectsWithNoInBrigadesDate')
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

export const getAllWithNoShipment = async () => {
    const {data} = await guestInstance.get('project/getAllWithNoShipment')
    return data
}

export const getAllWithNoAccount = async () => {
    const {data} = await guestInstance.get('project/getAllWithNoAccount')
    return data
}

export const reviseProjectNameAndNumberAndInstallationBilling = async (id, project) => {
    const { data } = await authInstance.put(`project/reviseProjectNameAndNumberAndInstallationBilling/${id}`, project)
    return data
}

export const updateProject = async (id, project) => {
    const { data } = await authInstance.put(`project/update/${id}`, project)
    return data
}

export const updateNote = async (id, project) => {
    const { data } = await authInstance.put(`project/updateNote/${id}`, project)
    return data
}

export const fetchOneProject = async (id) => {
    const { data } = await guestInstance.get(`project/getone/${id}`)
    return data
}

export const getProjectInfo = async (id) => {
    const { data } = await guestInstance.get(`project/getProjectInfo/${id}`)
    return data
}

export const getProjectInfoInstallation = async (id) => {
    const { data } = await guestInstance.get(`project/getProjectInfoInstallation/${id}`)
    return data
}



export const deleteProject = async (id) => {
    const {data} = await guestInstance.delete(`project/delete/${id}`)
    return data
}


