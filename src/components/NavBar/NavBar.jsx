import { Link } from 'react-router';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';

const NavBar = () => {
    const { user, handleSignout } = useContext(UserContext);
    
    return (
        <nav className="nav-museum">
            <Link to="/" className="text-2xl font-serif italic tracking-tighter text-[#4B3D2A]">
                Museum of Self
            </Link>
            
            <div className="flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.3em]">
                {user && (
                    <>
                        <Link to="/" className="hover:text-[#A68A6B] transition-colors">
                            Dashboard
                        </Link>
                        <Link to="/lifePhases" className="hover:text-[#A68A6B] transition-colors">
                            Floor Plan
                        </Link>
                        <Link to="/profile" className="hover:text-[#A68A6B] transition-colors">
                            Curator Profile
                        </Link>
                    </>
                )}
                
                {user ? (
                    <button 
                        onClick={handleSignout} 
                        className="btn-museum !py-2 !px-6 !text-[8px] ml-4"
                    >
                        Exit Archive
                    </button>
                ) : (
                    <div className="flex gap-6">
                        <Link to="/sign-in" className="hover:text-[#A68A6B] transition-colors">Sign In</Link>
                        <Link to="/sign-up" className="btn-museum !py-2 !px-6 !text-[8px]">Register</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBar;