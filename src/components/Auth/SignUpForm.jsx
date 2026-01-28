import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import * as authService from '../../services/authService';

const SignUpForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConf: '',
  });

  const { username, email, password, passwordConf } = formData;

  const handleChange = (e) => {
    setMessage('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await authService.signUp(formData);
      setUser(user);
      navigate('/');
    } catch (err) {
      setMessage(err.response?.data?.err || 'An error occurred.');
    }
  };

  const isFormInvalid = () => {
    return !(username && email && password && password === passwordConf );
  };

  return (
    <main className="max-w-4xl mx-auto py-10 px-6">
      <nav className="breadcrumb-nav">
        <Link to="/">MUSEUM</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="text-crimsonppercase">New Curator Registration</span>
      </nav>

      <div className="museum-ledger flex flex-col md:flex-row min-h-137.5nimate-hero">
        <div className="ledger-sidebar w-full md:w-1/3 p-8 flex flex-col justify-between border-b md:border-b-0">
          <div>
            <div className="w-12 h-1 bg-crimsonb-6"></div>
            <h2 className="text-3xl font-serif italic text-museum-darkrk leading-tight">
              Curator Registry
            </h2>
            <p className="text-[10px] mt-4 opacity-60 leading-relaxed uppercase tracking-tighter">
              Establish your credentials to begin cataloging your personal history.
            </p>
          </div>
          {message && (
            <div className="p-3 bg-crimson/10order border-crimsonext-[#8a3a3c] text-[9px] font-black uppercase tracking-widest">
              {message}
            </div>
          )}
        </div>

        <form autoComplete="off" onSubmit={handleSubmit} className="flex-1 p-8 md:p-12 space-y-6 bg-white/30 relative z-50">
          <div className="space-y-4">
            <div className="form-control">
              <label htmlFor="username" className="text-[9px] font-black uppercase tracking-widest text-museum-brownown mb-1 block">Username</label>
              <input type="text" id="username" name="username" value={username} onChange={handleChange} placeholder="CHOOSE A DISPLAY NAME" className="museum-input text-xl py-2 italic" required />
            </div>

            <div className="form-control">
              <label htmlFor="email" className="text-[9px] font-black uppercase tracking-widest text-museum-brownown mb-1 block">Email Address</label>
              <input type="email" id="email" name="email" value={email} onChange={handleChange} placeholder="EXAMPLE@MAIL.COM" className="museum-input text-sm py-2" required />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="form-control">
                <label htmlFor="password" className="text-[9px] font-black uppercase tracking-widest text-museum-brownown mb-1 block">Passphrase</label>
                <input type="password" id="password" name="password" value={password} onChange={handleChange} placeholder="8+ CHARS" className="museum-input text-sm py-2" required />
              </div>
              <div className="form-control">
                <label htmlFor="passwordConf" className="text-[9px] font-black uppercase tracking-widest text-museum-brownown mb-1 block">Confirm</label>
                <input type="password" id="passwordConf" name="passwordConf" value={passwordConf} onChange={handleChange} placeholder="RE-ENTER" className="museum-input text-sm py-2" required />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-4">
            <button disabled={isFormInvalid()} type="submit" className="btn-stamp px-8 py-3 text-[10px]">
              Verify & Register
            </button>
            <Link to="/signin" className="text-[9px] font-black uppercase opacity-40 hover:opacity-100 text-center tracking-widest">
              Already a curator? Sign In
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default SignUpForm;