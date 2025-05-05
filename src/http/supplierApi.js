import { guestInstance } from './index'


export const fetchSuppliers = async () => {
    const { data } = await guestInstance.get('supplier/getall')
    return data
}

export const fetchSupplier = async (id) => {
    const { data } = await guestInstance.get(`supplier/getone/${id}`)
    return data
}

export const createSupplier = async (supplier) => {
    const { data } = await guestInstance.post('supplier/create', supplier)
    return data
}

export const updateSupplier = async(id, suppliers) => {
    const {data} = await guestInstance.put(`supplier/update/${id}`, suppliers)
    return data
}

export const deleteSupplier = async(id) => {
    const {data} = await guestInstance.delete(`supplier/delete/${id}`)
    return data
}