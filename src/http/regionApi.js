import { guestInstance } from './index'


export const getAllRegion = async () => {
    const { data } = await guestInstance.get('region/getAllRegion')
    return data
}