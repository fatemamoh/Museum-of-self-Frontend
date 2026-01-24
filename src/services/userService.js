import axios from 'axios';
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/users`;

const getProfile = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/profile`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        throw error
    }
};

const updateProfile = async (formData) => {
    try {
        const response = await axios.put(`${BASE_URL}/profile`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data
    } catch (error) {
        throw error
    }
};

const deleteProfile = async () => {
    try {
        const response = await axios.delete(`${BASE_URL}/profile`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data
    } catch (error) {
        throw error
    }
};

export { updateProfile, deleteProfile, getProfile };