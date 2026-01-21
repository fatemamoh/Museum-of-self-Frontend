import axios from 'axios';
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/test`;

async function test() {
  // Step 1: Get the token from localStorage
  const token = localStorage.getItem('token');

  // Step 2: Make the GET request with the token in the header
  const response = await axios.get(BASE_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  // Step 3: Get the data from the response
  const data = response.data;

  // Step 4: Return the data
  return data;
}

export { test };
