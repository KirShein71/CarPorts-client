import { guestInstance} from './index'

export const getAllRemainderOneDetail = async () => {
    const {data} = await guestInstance.get('remainderdetails/getAllRemainderOneDetail')
    return data
}

export const getOverproductionOneDetail = async () => {
    const {data} = await guestInstance.get('remainderdetails/getOverproductionOneDetail')
    return data
}

export const getProduceOneDetail = async () => {
    const {data} = await guestInstance.get('remainderdetails/getProduceOneDetail')
    return data
}

export const getWaitShipmentProjectOneDetail = async () => {
    const {data} = await guestInstance.get('remainderdetails/getWaitShipmentProjectOneDetail')
    return data
}

export const getWaitShipment = async () => {
    const {data} = await guestInstance.get('remainderdetails/getWaitShipment')
    return data
}