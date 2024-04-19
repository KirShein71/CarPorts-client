import { guestInstance } from './index'



export const getProjectStatistics = async () => {
    const { data } = await guestInstance.get('counter/getProjectStatistics')
    return data
}

