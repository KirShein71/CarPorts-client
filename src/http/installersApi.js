import { guestInstance } from './index'


export const fetchInstallers = async () => {
    const { data } = await guestInstance.get('installers/getall')
    return data
}

export const fetchOneInstaller = async (id) => {
    const { data } = await guestInstance.get(`installers/getone/${id}`)
    return data
} 