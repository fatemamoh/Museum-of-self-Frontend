import { createContext, useState } from 'react';
import { useNavigate } from 'react-router';

const UserContext = createContext();

const getUserFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const tokenParts = token.split('.');
    const encodedPayload = tokenParts[1];
    const decodedPayload = atob(encodedPayload);
    const parsedPayload = JSON.parse(decodedPayload);
    return parsedPayload.user || parsedPayload.payload; 
  } catch (err) {
    return null;
  }
};

function UserProvider({ children }) {
  const [user, setUser] = useState(getUserFromToken());
  const navigate = useNavigate();

  const handleSignout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const value = { user, setUser, handleSignout };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };