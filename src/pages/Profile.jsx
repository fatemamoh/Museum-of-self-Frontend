import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../contexts/UserContext';
import * as userService from '../services/userService'

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [formData, setFormData] = useState({
    bio: '',
    location: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.getProfile();
        setUser(data);
        setFormData({
          bio: data.bio || '',
          location: data.location || '',
        });
      } catch (err) {
        console.error(err);
      }
    };
    if (localStorage.getItem('token')) fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('bio', formData.bio);
      data.append('location', formData.location);
      if (photo) data.append('avatar', photo);
      const updatedUser = await userService.updateProfile(data);
      setUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await userService.deleteProfile();
      localStorage.removeItem('token');
      setUser(null);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#424036] p-4 md:pt-16 md:pb-24">
      <div className="max-w-2xl mx-auto">
        {!isEditing ? (
          <div className="bg-[#9b8f6a] p-1 shadow-[15px_15px_0px_0px_rgba(47,46,41,1)]">
            <div className="bg-[#2f2e29] p-8 md:p-12 text-center border-2 border-[#424036]">
              <span className="inline-block px-4 py-1 bg-[#916f3b] text-[#2f2e29] text-[10px] font-bold uppercase tracking-[0.4em] mb-8">
                Exhibit 01: Curator
              </span>
              
              <h1 className="text-5xl font-black uppercase text-[#9b8f6a] tracking-widest mb-4">
                {user.username}
              </h1>
              
              <div className="w-20 h-0.5 bg-[#916f3b] mx-auto mb-10"></div>
              
              <div className="flex justify-center mb-10">
                <div className="w-44 h-44 border-4 border-[#9b8f6a] rotate-3 hover:rotate-0 transition-transform duration-500 overflow-hidden shadow-2xl bg-[#424036]">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} className="w-full h-full object-cover grayscale" alt="Portrait" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center italic text-[#9b8f6a]/20">Empty</div>
                  )}
                </div>
              </div>

              <p className="text-lg text-[#9b8f6a] font-serif leading-relaxed max-w-md mx-auto mb-12 italic">
                {user.bio || "This record currently contains no narrative description."}
              </p>

              <div className="border-t border-[#424036] pt-8 flex flex-col items-center gap-6">
                <div className="text-center">
                  <p className="text-[10px] uppercase text-[#916f3b] font-bold tracking-widest mb-1">Located At</p>
                  <p className="text-sm uppercase tracking-widest text-[#9b8f6a]">{user.location || "Unspecified"}</p>
                </div>
                <button onClick={() => setIsEditing(true)} className="btn bg-[#9b8f6a] text-[#2f2e29] border-none rounded-none font-black px-12 hover:bg-white transition-colors">
                  MODIFY PROFILE
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#2f2e29] border-4 border-[#916f3b] p-8 md:p-12 shadow-2xl">
            <h2 className="text-2xl font-serif text-[#916f3b] uppercase mb-10 tracking-[0.3em] text-center">Modify Profile</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#916f3b]">Portrait File</label>
                <input 
                  type="file" 
                  className="file-input file-input-bordered bg-[#424036] border-[#535346] text-[#9b8f6a] rounded-none w-full" 
                  onChange={handleFileChange} 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#916f3b]">Current Location</label>
                <input 
                  className="input bg-[#424036] border-[#535346] text-[#9b8f6a] rounded-none focus:outline-none focus:border-[#916f3b] w-full" 
                  value={formData.location} 
                  name="location"
                  onChange={handleChange} 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#916f3b]">Curator's Narrative</label>
                <textarea 
                  className="textarea bg-[#424036] border-[#535346] text-[#9b8f6a] h-40 rounded-none focus:outline-none focus:border-[#916f3b] w-full leading-relaxed p-4" 
                  value={formData.bio} 
                  name="bio"
                  onChange={handleChange} 
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button type="submit" className="btn bg-[#916f3b] text-[#2f2e29] border-none rounded-none flex-1 font-black tracking-widest hover:bg-white">UPDATE CHANGES</button>
                <button type="button" onClick={() => setIsEditing(false)} className="btn btn-ghost text-[#9b8f6a] rounded-none tracking-widest">CANCEL</button>
              </div>
            </form>
          </div>
        )}

        <div className="mt-20 flex flex-col items-center">
          <div className="h-px w-32 bg-[#916f3b]/30 mb-8"></div>
          {!isDeleting ? (
            <button 
              onClick={() => setIsDeleting(true)} 
              className="text-[10px] uppercase tracking-[0.4em] text-[#9b8f6a] hover:text-[#ff4d4d] transition-all duration-300 border border-[#9b8f6a]/20 px-8 py-3"
            >
              Request Record Destruction
            </button>
          ) : (
            <div className="bg-red-950/30 border-2 border-red-600 p-8 flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="text-[11px] font-black text-red-500 tracking-[0.5em] uppercase text-center">
                Critical Warning: Permanent Erasure
              </span>
              <div className="flex gap-12 items-center">
                <button 
                  onClick={handleDelete} 
                  className="text-xs font-black text-red-500 hover:text-white underline underline-offset-8 tracking-widest"
                >
                  YES, ERASE
                </button>
                <button 
                  onClick={() => setIsDeleting(false)} 
                  className="text-xs font-black text-[#9b8f6a] hover:text-white tracking-widest"
                >
                  NO, RETURN
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Profile;