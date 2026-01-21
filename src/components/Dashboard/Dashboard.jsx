import { useEffect, useState, useContext } from 'react';

import { UserContext } from '../../contexts/UserContext';

import * as testService from '../../services/testService';

const Dashboard = () => {
  // Access the user object from UserContext
  // This gives us the currently logged-in user's information (username, email) that we extract from the token
  const { user } = useContext(UserContext);

  // Create state to store the message we'll receive from the backend
  const [ message, setMessage ] = useState('');

  // useEffect runs after the component renders
  // This is where we perform side effects like API calls
  useEffect(() => {
    const fetchTest = async () => {
      try {
        // Make an authenticated API call to the backend test endpoint. The JWT token is automatically sent in the request headers inside the service function
        const data = await testService.test();

        // Take the response data and show message
        setMessage(data.message);
      } catch (err) {
        console.log(err)
      }
    }

    // Only fetch data if user exists (i.e., someone is logged in)
    // This prevents errors from trying to make authenticated requests without a user
    if (user) fetchTest();

  }, [user]); // only fetch if after context loads the user from localStorage

  return (
    <main>
      <h1>Welcome, {user.username}</h1>
      <p>
        This is the dashboard page where you can test your authentication.
      </p>
      <p><strong>{message}</strong></p>
    </main>
  );
};

export default Dashboard;
