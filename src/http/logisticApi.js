import { guestInstance, authInstance } from './index'

export const getAllProjectMaterialForLogistic = async () => {
    const { data } = await guestInstance.get('projectmaterials/getAllProjectMaterialForLogistic')
    return data
}

export const getAllMaterialProjectForLogistic = async () => {
    const { data } = await guestInstance.get('projectmaterials/getAllMaterialProjectForLogistic')
    return data
}

export const getPickupMaterialsForLogistic = async (date) => {
    const { data } = await guestInstance.get(`projectmaterials/getPickupMaterialsForLogistic/${date}`);
    return data;
    
};
