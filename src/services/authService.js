import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/auth`

async function signUp(formData) {

  // Step 1: Send POST request with form data
  const response = await axios.post(`${BASE_URL}/sign-up`, formData);

  // Step 2: Get the data from the response
  const data = response.data;

  // Step 3: Get the token from the response
  const token = data.token;

  // Step 4: Save the token to localStorage
  window.localStorage.setItem('token', token);

  // Step 5: Decode the token to get user data
  const tokenParts = token.split('.');
  const encodedPayload = tokenParts[1];
  const decodedPayload = window.atob(encodedPayload);
  const parsedPayload = JSON.parse(decodedPayload);
  const user = parsedPayload.payload;

  // Step 6: Return the user data
  return user;
}

async function signIn(formData) {
  // Step 1: Send POST request with form data
  const response = await axios.post(`${BASE_URL}/sign-in`, formData);

  // Step 2: Get the data from the response
  const data = response.data;

  // Step 3: Get the token from the response
  const token = data.token;

  // Step 4: Save the token to localStorage
  window.localStorage.setItem('token', token);

  // Step 5: Decode the token to get user data
  const tokenParts = token.split('.');
  const encodedPayload = tokenParts[1];
  const decodedPayload = window.atob(encodedPayload);
  const parsedPayload = JSON.parse(decodedPayload);
  const user = parsedPayload.payload;

  // Step 6: Return the user data
  return user;
}

export { signUp, signIn };
