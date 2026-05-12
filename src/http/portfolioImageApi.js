import { guestInstance, authInstance } from './index'

export const getAllByProjectId = async (projectId) => {
    const { data } = await guestInstance.get(`portfolioimage/getAllByProjectId/${projectId}`);
    return data;
}

export const createPortfolioImage = async (project) => {
    const { data } = await guestInstance.post('portfolioimage/create', project)
    return data
}

export const deletePortfolioImage = async(id) => {
    const {data} = await guestInstance.delete(`portfolioimage/delete/${id}`)
    return data
}