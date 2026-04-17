import { guestInstance } from './index'


export const getTotalWarehouseData = async () => {
    const { data } = await guestInstance.get('totalwarehouse/getTotalWarehouseData')
    return data
}