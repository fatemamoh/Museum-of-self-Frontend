import { useContext } from 'react';
import { Link } from 'react-router';
import { UserContext } from '../../contexts/UserContext';

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <nav>
      <div>
        <Link to='/'>Museum of Self</Link>
      </div>
      <ul>
        {user ? (
          <>
            <li><Link to='/'>Gallery Map</Link></li>
            <li><Link to='/profile'>Profile</Link></li>
            <li onClick={handleSignOut}><Link to='/'>Exit Gallery</Link></li>
          </>
        ) : (
          <>
            <li><Link to='/sign-in'>Access</Link></li>
            <li><Link to='/sign-up'>Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;