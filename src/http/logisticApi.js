import { guestInstance, authInstance } from './index'

export const getAllProjectMaterialForLogistic = async () => {
    const { data } = await guestInstance.get('projectmaterials/getAllProjectMaterialForLogistic')
    return data
}

export const getAllMaterialProjectForLogistic = async () => {
    const { data } = await guestInstance.get('projectmaterials/getAllMaterialProjectForLogistic')
    return data
}

export const getPickupMaterialsForLogistic = async (date, selectedItems) => {
    const { data } = await guestInstance.post(
      `projectmaterials/getPickupMaterialsForLogistic`,
      { date, selectedItems }
    );
    return data;
};

export const getUnloadingForProject = async (selectedProjectsId) => {
    const { data } = await guestInstance.post(
      `projectmaterials/getUnloadingForProject`,
      { selectedProjectsId }
    );
    return data;
};