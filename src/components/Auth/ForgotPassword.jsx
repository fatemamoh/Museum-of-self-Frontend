import { useState } from 'react';
import { Link } from 'react-router';
import * as authService from '../../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setMessage('');
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.forgotPassword(email);
      setMessage(res.message);
    } catch (err) {
      setMessage(err.err || 'Error requesting reset.');
    }
  };

  return (
    <main className="max-w-4xl mx-auto py-10 px-6">
      <nav className="breadcrumb-nav">
        <Link to="/">MUSEUM</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="text-crimson uppercase">Lost security key</span>
      </nav>

      <div className="museum-ledger flex flex-col md:flex-row min-h-100 animate-hero">
        <div className="ledger-sidebar w-full md:w-1/3 p-8 flex flex-col justify-between border-b md:border-b-0">
          <div>
            <div className="w-12 h-1 bg-museum-dark mb-6"></div>
            <h2 className="text-3xl font-serif italic text-museum-dark leading-tight">
              Lost Key
            </h2>
            <p className="text-[10px] mt-4 opacity-60 leading-relaxed uppercase tracking-tighter">
              Enter your registered email address to receive a recovery link.
            </p>
          </div>
          {message && (
            <div className="p-3 bg-museum-dark/10 border border-museum-dark text-museum-dark text-[9px] font-black uppercase tracking-widest">
              {message}
            </div>
          )}
        </div>

        <form autoComplete="off" onSubmit={handleSubmit} className="flex-1 p-8 md:p-12 space-y-8 bg-white/30 relative z-50">
          <div className="space-y-6">
            <div className="form-control">
              <label htmlFor="email" className="text-[9px] font-black uppercase tracking-widest text-museum-brown mb-1 block">Curator Email</label>
              <input type="email" id="email" name="email" value={email} onChange={handleChange} placeholder="ENTER REGISTERED EMAIL" className="museum-input text-xl py-2 italic" required />
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-6">
            <button type="submit" className="btn-stamp px-8 py-3 text-[10px]"> Recover key Request</button>
            <Link to="/sign-in" className="text-[9px] font-black uppercase opacity-40 hover:opacity-100 text-center tracking-widest">Return to Sign In</Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ForgotPassword;