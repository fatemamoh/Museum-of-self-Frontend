import { Link } from 'react-router';
import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Landmark } from 'lucide-react';

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <nav className={`nav-museum ${isScrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="flex items-center gap-3 group">
        <Landmark 
          size={isScrolled ? 20 : 24} 
          strokeWidth={1.5} 
          className="transition-all duration-500 group-hover:rotate-12 group-hover:text-museum-brownown" 
        />
        <span className="font-serif italic text-xl tracking-tighter">The Self Museum</span>
      </Link>

      <div className="flex items-center gap-10">
        {user ? (
          <>
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/lifePhases" className="nav-link">Archives</Link>
            <Link to="/profile" className="nav-link">Curator</Link>
            <button 
              onClick={handleLogout} 
              className="nav-link text-crimson opacity-80! hover:opacity-100! cursor-pointer"
              style={{ color: '#8a3a3c' }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/sign-in" className="nav-link">Sign In</Link>
            <Link to="/sign-up" className="nav-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;