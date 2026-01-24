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
    <nav className="bg-[#2f2e29] border-b border-[#916f3b] p-4 flex justify-between items-center">
      <div className="text-[#916f3b] font-black uppercase tracking-tighter text-xl">
        <Link to='/'>Museum of Self</Link>
      </div>

      <ul className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-[#9b8f6a]">
        {user ? (
          <>
            <li className="hover:text-white transition-colors">
              <Link to='/'>Gallery Map</Link>
            </li>
            <li className="hover:text-white transition-colors">
              <Link to='/profile'> Profile</Link>
            </li>
            <li className="text-red-800 hover:text-red-500 transition-colors cursor-pointer">
              <Link to='/' onClick={handleSignOut}>Exit Gallery</Link>
            </li>
          </>
        ) : (
          <>
            <li className="hover:text-white transition-colors">
              <Link to='/sign-in'>Access</Link>
            </li>
            <li className="bg-[#916f3b] text-[#2f2e29] px-3 py-1 hover:bg-white transition-colors">
              <Link to='/sign-up'>Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
