import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import * as userService from '../../services/userService';

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
                Exhibit 01: Principal Curator
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
                  <p className="text-[10px] uppercase text-[#916f3b] font-bold tracking-widest mb-1">Stationed At</p>
                  <p className="text-sm uppercase tracking-widest text-[#9b8f6a]">{user.location || "Unspecified"}</p>
                </div>
                <button onClick={() => setIsEditing(true)} className="btn bg-[#9b8f6a] text-[#2f2e29] border-none rounded-none font-black px-12 hover:bg-white transition-colors">
                  MODIFY RECORD
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#2f2e29] border-4 border-[#916f3b] p-8 shadow-2xl">
            <h2 className="text-2xl font-serif text-[#916f3b] uppercase mb-8 tracking-widest text-center">Update Archives</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label htmlFor="avatar" className="label text-[10px] font-bold uppercase tracking-widest text-[#916f3b]">Portrait File</label>
                <input id="avatar" name="avatar" type="file" className="file-input file-input-bordered bg-[#424036] border-[#535346] text-[#9b8f6a] rounded-none" onChange={handleFileChange} />
              </div>
              <div className="form-control">
                <label htmlFor="location" className="label text-[10px] font-bold uppercase tracking-widest text-[#916f3b]">Registry Location</label>
                <input id="location" name="location" className="input bg-[#424036] border-[#535346] text-[#9b8f6a] rounded-none focus:border-[#916f3b]" value={formData.location} onChange={handleChange} />
              </div>
              <div className="form-control">
                <label htmlFor="bio" className="label text-[10px] font-bold uppercase tracking-widest text-[#916f3b]">Curator's Statement</label>
                <textarea id="bio" name="bio" className="textarea bg-[#424036] border-[#535346] text-[#9b8f6a] h-32 rounded-none focus:border-[#916f3b]" value={formData.bio} onChange={handleChange} />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" className="btn bg-[#916f3b] text-[#2f2e29] border-none rounded-none flex-1 font-bold">COMMIT</button>
                <button type="button" onClick={() => setIsEditing(false)} className="btn btn-ghost text-[#9b8f6a] rounded-none">ABORT</button>
              </div>
            </form>
          </div>
        )}

        <div className="mt-16 flex flex-col items-center opacity-30">
          <div className="h-px w-32 bg-[#916f3b] mb-4"></div>
          {!isDeleting ? (
            <button onClick={() => setIsDeleting(true)} className="text-[10px] uppercase tracking-widest hover:text-red-500 transition-colors">
              Request Record Destruction
            </button>
          ) : (
            <div className="flex gap-6 items-center">
              <span className="text-[10px] font-bold text-red-500">CONFIRM?</span>
              <button onClick={handleDelete} className="text-[10px] font-bold underline">YES</button>
              <button onClick={() => setIsDeleting(false)} className="text-[10px] font-bold underline">NO</button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Profile;