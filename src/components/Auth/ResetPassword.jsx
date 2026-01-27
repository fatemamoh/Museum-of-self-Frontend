import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import * as authService from '../../services/authService';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState({ text: '', type: '' });
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    masterPin: ''
  });

  const handleChange = (e) => {
    setMessage({ text: '', type: '' });
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setMessage({ text: "Passwords do not match.", type: 'error' });
    }
    try {
      await authService.resetPassword(token, formData);
      setMessage({ text: "Vault secured! Redirecting...", type: 'success' });
      setTimeout(() => navigate('/sign-in'), 2000);
    } catch (err) {
      setMessage({ text: err.err || "Token expired or invalid.", type: 'error' });
    }
  };

  return (
    <main className="max-w-4xl mx-auto py-10 px-6">
      <nav className="breadcrumb-nav">
        <Link to="/">MUSEUM</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="text-crimson uppercase">Security_Override</span>
      </nav>

      <div className="museum-ledger flex flex-col md:flex-row min-h-125 animate-hero">
        <div className="ledger-sidebar w-full md:w-1/3 p-8 flex flex-col justify-between border-b md:border-b-0">
          <div>
            <div className="w-12 h-1 bg-crimsonb-6"></div>
            <h2 className="text-3xl font-serif italic text-museum-darkrk leading-tight">
              Restore Access
            </h2>
            <p className="text-[10px] mt-4 opacity-60 leading-relaxed uppercase tracking-tighter">
              Define a new security phrase and master pin to re-secure your archives.
            </p>
          </div>
          {message.text && (
            <div className={`p-3 border text-[9px] font-black uppercase tracking-widest ${message.type === 'error' ? 'bg-crimson/10 border-crimson text-crimson' : 'bg-green-700/10 border-green-700 text-green-700'}`}>
              {message.text}
            </div>
          )}
        </div>

        <form autoComplete="off" onSubmit={handleSubmit} className="flex-1 p-8 md:p-12 space-y-6 bg-white/30 relative z-50">
          <div className="space-y-6">
            <div className="form-control">
              <label htmlFor="password" className="text-[9px] font-black uppercase tracking-widest text-museum-brown mb-1 block">New Passphrase</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="MIN. 8 CHARACTERS" className="museum-input text-xl py-2" required />
            </div>

            <div className="form-control">
              <label htmlFor="confirmPassword" className="text-[9px] font-black uppercase tracking-widest text-museum-brown mb-1 block">Confirm Passphrase</label>
              <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="RE-ENTER NEW PASSPHRASE" className="museum-input text-xl py-2" required />
            </div>

            <div className="form-control">
              <label htmlFor="masterPin" className="text-[9px] font-black uppercase tracking-widest text-museum-brown mb-1 block">New Master PIN</label>
              <input type="password" id="masterPin" name="masterPin" value={formData.masterPin} onChange={handleChange} placeholder="0000" className="museum-input text-xl py-2 tracking-[0.5em] text-center" required />
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-6">
            <button type="submit" className="btn-stamp px-8 py-3 text-[10px]">Update Vault</button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ResetPassword;