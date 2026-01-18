import { guestInstance } from './index'


export const getAllNpsQuestion = async () => {
    const { data } = await guestInstance.get('npsquestion/getall')
    return data
}

export const getOneNpsQuestion = async (id) => {
    const { data } = await guestInstance.get(`npsquestion/getone/${id}`)
    return data
}

export const createNpsQuestion = async (npsquestion) => {
    const { data } = await guestInstance.post('npsquestion/create', npsquestion)
    return data
}

export const updateNpsQuestionName = async(id, npsquestions) => {
    const {data} = await guestInstance.put(`npsquestion/updateName/${id}`, npsquestions)
    return data
}

export const updateNpsQuestionChapter = async(id, npsquestions) => {
    const {data} = await guestInstance.put(`npsquestion/updateChapter/${id}`, npsquestions)
    return data
}

export const deleteNpsQuestion = async(id) => {
    const {data} = await guestInstance.delete(`npsquestion/delete/${id}`)
    return data
}