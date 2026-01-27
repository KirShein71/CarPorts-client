import { guestInstance } from './index'


export const fetchAllWarehouseAssortments = async () => {
    const { data } = await guestInstance.get('warehouseassortment/getall')
    return data
}

export const getAllActiveWarehouseAssortement = async () => {
    const { data } = await guestInstance.get('warehouseassortment/getAllActiveWarehouseAssortement')
    return data
}

export const fetchOneWarehouseAssortment = async (id) => {
    const { data } = await guestInstance.get(`warehouseassortment/getone/${id}`)
    return data
}

export const createWarehouseAssortment = async (warehouseassortment) => {
    const { data } = await guestInstance.post('warehouseassortment/create', warehouseassortment)
    return data
}


export const updateWarehouseAssortment = async (id, warehouseassortments) => {
    const { data } = await guestInstance.put(`warehouseassortment/update/${id}`, warehouseassortments)
    return data
}

export const updateActiveWarehouseAssortment = async (id, warehouseassortments) => {
    const { data } = await guestInstance.patch(`warehouseassortment/updateActiveWarehouseAssortment/${id}`, warehouseassortments)
    return data
}

export const deleteWarehouseAssortment = async(id) => {
    const {data} = await guestInstance.delete(`warehouseassortment/delete/${id}`)
    return data
}