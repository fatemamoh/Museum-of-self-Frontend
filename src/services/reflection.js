import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/reflections`;

const create = async (memoryId, formData, pin = null) => {
    try {
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
        if (pin) headers['x-master-pin'] = pin;
        const response = await axios.post(`${BASE_URL}/${memoryId}`, formData, { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const show = async (id, pin = null) => {
    try {
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
        if (pin) headers['x-master-pin'] = pin;

        const response = await axios.get(`${BASE_URL}/${id}`, { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const update = async (id, formData, pin = null) => {
    try {
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
        if (pin) headers['x-master-pin'] = pin;

        const response = await axios.put(`${BASE_URL}/${id}`, formData, { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteReflection = async (id, pin = null) => {
    try {
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
        if (pin) headers['x-master-pin'] = pin;

        const response = await axios.delete(`${BASE_URL}/${id}`, { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export { create, show, update, deleteReflection };