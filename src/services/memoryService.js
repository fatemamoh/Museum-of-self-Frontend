import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/memories`;

// Helper to get token
const getAuthHeader = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`
});

const indexByPhase = async (phaseId) => {
    try {
        const response = await axios.get(`${BASE_URL}/phase/${phaseId}`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const show = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const create = async (formData) => {
    try {
        // We use formData directly. 
        // DO NOT wrap it in { formData } or it becomes a regular JSON object.
        const response = await axios.post(BASE_URL, formData, {
            headers: {
                ...getAuthHeader(),
                // If formData is an instance of FormData, 
                // deleting Content-Type lets the browser set it correctly 
                // with the multipart boundary.
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Service Create Error:", error.response?.data || error.message);
        throw error;
    }
};

const update = async (id, formData) => {
    try {
        const response = await axios.put(`${BASE_URL}/${id}`, formData, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteMemory = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
const index = async () => {
    try {
        const response = await axios.get(BASE_URL, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export { index, indexByPhase, show, create, update, deleteMemory };