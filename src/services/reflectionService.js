import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/reflections`;

const getHeaders = (pin) => {
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
    if (pin) headers['x-master-pin'] = pin;
    return headers;
};

export const create = async (memoryId, formData, pin = null) => {
    const response = await axios.post(`${BASE_URL}/${memoryId}`, formData, { 
        headers: getHeaders(pin) 
    });
    return response.data;
};

export const indexByMemory = async (memoryId, pin = null) => {
    const response = await axios.get(`${BASE_URL}/memory/${memoryId}`, { 
        headers: getHeaders(pin) 
    });
    return response.data;
};

export const update = async (id, formData, pin = null) => {
    const response = await axios.put(`${BASE_URL}/${id}`, formData, { 
        headers: getHeaders(pin) 
    });
    return response.data;
};

export const deleteReflection = async (id, pin = null) => {
    const response = await axios.delete(`${BASE_URL}/${id}`, { 
        headers: getHeaders(pin) 
    });
    return response.data;
};