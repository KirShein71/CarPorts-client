import { guestInstance } from './index'

export const getAllGanttData = async () => {
    const { data } = await guestInstance.get('gant/getAllGanttData')
    return data
}