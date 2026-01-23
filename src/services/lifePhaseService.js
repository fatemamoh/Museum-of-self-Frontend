import axios from 'axios';
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/lifePhases`;

const index = async () => {
    try {
        const response = await axios.get(`${BASE_URL}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const create = async (formData) => {
    try {
        const response = await axios.post(BASE_URL, formData, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const update = async (id, formData) => {
    try {
        const response = await axios.put(`${BASE_URL}/${id}`, formData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteLifePhase = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};


export { index, create, update, deleteLifePhase };