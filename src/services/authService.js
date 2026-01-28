import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/auth`

async function signUp(formData) {
  try {
    const response = await axios.post(`${BASE_URL}/sign-up`, formData);
    const data = response.data;
    const token = data.token;
  
    window.localStorage.setItem('token', token);
  
    const tokenParts = token.split('.');
    const encodedPayload = tokenParts[1];
    const decodedPayload = window.atob(encodedPayload);
    const parsedPayload = JSON.parse(decodedPayload);
    const user = parsedPayload.payload;
  
    return user;
  } catch (error) {
    throw error;
  }
}

async function signIn(formData) {
  try {
    const response = await axios.post(`${BASE_URL}/sign-in`, formData);
    const data = response.data;
    const token = data.token;
  
    window.localStorage.setItem('token', token);
  
    const tokenParts = token.split('.');
    const encodedPayload = tokenParts[1];
    const decodedPayload = window.atob(encodedPayload);
    const parsedPayload = JSON.parse(decodedPayload);
    const user = parsedPayload.payload;
  
    return user;
  } catch (error) {
    throw error;
  }
}

async function forgotPassword(email) {
  try {
    const response = await axios.post(`${BASE_URL}/forgot-password`, { email });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

async function resetPassword(token, formData) {
  try {
    const response = await axios.post(`${BASE_URL}/reset-password/${token}`, {password: formData.password});
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

export { signUp, signIn, forgotPassword, resetPassword };