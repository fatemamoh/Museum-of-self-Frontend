import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/memories`;

const indexByPhase = async (phaseId, pin = null) => {
    try {
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
        if (pin) headers['x-master-pin'] = pin;
        const response = await axios.get(`${BASE_URL}/phase/${phaseId}`, { headers });
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

const create = async (formData) => {
    try {
        const response = await axios.post(BASE_URL, formData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
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
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteMemory = async (id, pin = null) => {
    try {
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
        if (pin) headers['x-master-pin'] = pin;
        const response = await axios.delete(`${BASE_URL}/${id}`, { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export { indexByPhase, show, create, update, deleteMemory };