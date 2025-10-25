import { guestInstance } from './index'


export const getAllExamination = async () => {
    const { data } = await guestInstance.get('examination/getall')
    return data
}

export const getOneExamination = async (id) => {
    const { data } = await guestInstance.get(`examination/getone/${id}`)
    return data
}

export const createExamination = async (examination) => {
    const { data } = await guestInstance.post('examination/create', examination)
    return data
}

export const updateExamination = async(id, examinations) => {
    const {data} = await guestInstance.put(`examination/update/${id}`, examinations)
    return data
}

export const updateExaminationName = async(id, examinations) => {
    const {data} = await guestInstance.put(`examination/updateName/${id}`, examinations)
    return data
}

export const updateExaminationNumber = async(id, examinations) => {
    const {data} = await guestInstance.put(`examination/updateNumber/${id}`, examinations)
    return data
}

export const deleteExamination = async(id) => {
    const {data} = await guestInstance.delete(`Examination/delete/${id}`)
    return data
}