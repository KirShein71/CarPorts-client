import { guestInstance, authInstance } from './index'

export const fetchAllProjectInstallers = async () => {
    const { data } = await guestInstance.get('projectinstallers/getall')
    return data
}

export const createProjectInstallers = async (projectinstallers) => {
    const { data } = await authInstance.post(`projectinstallers/create`, projectinstallers)
    return data
}

export const fetchOneProjectInstallers = async (id) => {
    const { data } = await guestInstance.get(`projectinstallers/getone/${id}`)
    return data
}
