import { Link } from 'react-router';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { ThemeContext } from '../../contexts/ThemeContext';

const NavBar = () => {
  const { user, handleSignout } = useContext(UserContext);
  const { setTheme } = useContext(ThemeContext);

  const performSignout = () => {
    setTheme('classic');
    handleSignout();
  };

  return (
    <nav className="flex justify-between items-center px-10 py-6 sticky top-0 z-[60] transition-museum">
      <Link to="/" className="text-2xl font-serif italic tracking-tighter text-base-content">
        Museum of Self
      </Link>
      <ul className="flex gap-10 items-center text-[10px] uppercase tracking-[0.3em] font-bold text-base-content/80">
        {user ? (
          <>
            <li><Link to="/lifePhases" className="hover:text-primary transition-colors">Floor Plan</Link></li>
            <li>
              <button onClick={performSignout} className="btn btn-outline btn-xs rounded-none px-4 border-primary/30 hover:bg-primary hover:border-primary">
                Sign Out
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/sign-in">Sign In</Link></li>
            <li><Link to="/sign-up" className="text-primary">Join</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;