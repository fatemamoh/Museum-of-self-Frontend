import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router';
import { signIn } from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';

const SignInForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const handleChange = (e) => {
    setMessage('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const signedInUser = await signIn(formData);
      setUser(signedInUser);
      navigate('/');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <main className="max-w-4xl mx-auto py-10 px-6">
      <nav className="breadcrumb-nav">
        <Link to="/">MUSEUM</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="text-crimson uppercase">User Identification</span>
      </nav>

      <div className="museum-ledger flex flex-col md:flex-row min-h-112.5 animate-hero">
        <div className="ledger-sidebar w-full md:w-1/3 p-8 flex flex-col justify-between border-b md:border-b-0">
          <div>
            <div className="w-12 h-1 bg-museum-dark mb-6"></div>
            <h2 className="text-3xl font-serif italic text-museum-dark leading-tight">
              Museum Entry
            </h2>
            <p className="text-[10px] mt-4 opacity-60 leading-relaxed uppercase tracking-tighter">
              Present your identity and security key to access the archives.
            </p>
          </div>
          {message && (
            <div className="p-3 bg-crimson/10 border border-crimson text-crimson text-[9px] font-black uppercase tracking-widest">
              {message}
            </div>
          )}
        </div>

        <form autoComplete="off" onSubmit={handleSubmit} className="flex-1 p-8 md:p-12 space-y-8 bg-white/30 relative z-50">
          <div className="space-y-6">
            <div className="form-control">
              <label htmlFor="identifier" className="text-[9px] font-black uppercase tracking-widest text-museum-brown mb-1 block">Identity</label>
              <input 
                type="text" 
                id="identifier" 
                name="identifier" 
                value={formData.identifier} 
                onChange={handleChange} 
                placeholder="USERNAME OR EMAIL" 
                className="museum-input text-xl py-2 italic" 
                required 
              />
            </div>

            <div className="form-control">
              <label htmlFor="password" className="text-[9px] font-black uppercase tracking-widest text-museum-brown mb-1 block">Security Key</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="••••••••" 
                className="museum-input text-xl py-2" 
                required 
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-6">
            <button type="submit" className="btn-stamp px-8 py-3 text-[10px]">
              Authorize Access
            </button>
            <div className="flex flex-col gap-2 items-center">
              <Link to="/sign-up" className="text-[9px] font-black uppercase opacity-40 hover:opacity-100 tracking-widest">
                New curator? Register here
              </Link>
              <Link to="/forgot-password" size="sm" className="text-[8px] uppercase tracking-widest font-bold opacity-30 hover:opacity-80">
                Forgot Password?
              </Link>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default SignInForm;