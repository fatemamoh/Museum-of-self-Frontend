import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/reflections`;


const indexByMemory = async (memoryId) => {
    try {
        const response = await axios.get(`${BASE_URL}/memory/${memoryId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching reflections:", error);
        throw error;
    }
};


const create = async (memoryId, formData) => {
    try {
        const response = await axios.post(`${BASE_URL}/${memoryId}`, formData, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error creating reflection:", error);
        throw error;
    }
};

const update = async (id, formData) => {
    try {
        const response = await axios.put(`${BASE_URL}/${id}`, formData, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating reflection:", error);
        throw error;
    }
};

const deleteReflection = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${id}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting reflection:", error);
        throw error;
    }
};

export { indexByMemory, create, update, deleteReflection };