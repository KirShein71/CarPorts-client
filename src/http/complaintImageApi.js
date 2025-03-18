import { guestInstance } from './index'



export const fetchComplaintImages = async () => {
    const { data } = await guestInstance.get('complaintimage/getall')
    return data
}

export const getAllByComplaintId = async (complaintId) => {
    const { data } = await guestInstance.get(`complaintimage/getAllByComplaintId/${complaintId}`);
    return data;
}

export const fetchOneComplaintImage = async (id) => {
    const { data } = await guestInstance.get(`complaintimage/getone/${id}`)
    return data
} 

export const createComplaintImage = async (complaintimage) => {
    const { data } = await guestInstance.post('complaintimage/create', complaintimage)
    return data
}

export const updateComplaintImage = async (id, complaintimage) => {
    const { data } = await guestInstance.put(`complaintimage/update/${id}`, complaintimage)
    return data
}
 
export const deleteComplaintImage = async(id) => {
    const {data} = await guestInstance.delete(`complaintimage/delete/${id}`)
    return data
}


