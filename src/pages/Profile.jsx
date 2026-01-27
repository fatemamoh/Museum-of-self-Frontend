import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { UserContext } from '../contexts/UserContext';
import * as userService from '../services/userService';

const Profile = () => {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [formData, setFormData] = useState({ bio: '', location: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await userService.getProfile();
                setUser(data);
                setFormData({ bio: data.bio || '', location: data.location || '' });
            } catch (err) { console.error(err); }
        };
        if (localStorage.getItem('token')) fetchProfile();
    }, [setUser]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setPhoto(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('bio', formData.bio);
            data.append('location', formData.location);
            if (photo) data.append('avatar', photo);
            const updatedUser = await userService.updateProfile(data);
            setUser(updatedUser);
            setPhoto(null);
            setIsEditing(false);
        } catch (err) { console.error(err); }
    };

    if (!user) return null;

    return (
        <main className="min-h-[90vh] flex flex-col items-center justify-center bg-[#F5F0E1] p-6 relative">
            <div className="blueprint-grid"></div>
            <div className="spotlight"></div>
            
            <nav className="w-full max-w-3xl mb-12 flex justify-between items-center z-20">
                <div className="flex gap-4 text-[8px] font-black uppercase tracking-[0.3em] opacity-40">
                    <Link to="/" className="hover:text-black transition-colors">Dashboard</Link>
                    <span>/</span>
                    <span className="text-[#4B3D2A]">Archives</span>
                    <span>/</span>
                    <span className="text-[#4B3D2A]">Curator_01</span>
                </div>
                <button onClick={() => navigate('/')} className="text-[8px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 cursor-pointer">Exit Exhibit</button>
            </nav>

            <div className="museum-frame animate-hero">
                <section className="bg-[#E8DFCA] p-6 md:p-10 shadow-inner relative overflow-hidden">
                    <div className="absolute top-3 right-5 text-[7px] font-mono opacity-20 tracking-widest uppercase">File_Type: Portrait_Primary</div>
                    
                    {!isEditing ? (
                        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                            <div className="w-44 h-56 bg-[#D9C6A0] border-[6px] border-white shadow-md flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-1000">
                                {user.avatarUrl ? (
                                    <img src={user.avatarUrl} alt="Curator" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[7px] font-black opacity-20 text-center px-4">IMAGE_NULL</div>
                                )}
                            </div>

                            <div className="flex-1 space-y-4 text-center md:text-left">
                                <header className="border-b border-[#4B3D2A]/10 pb-3">
                                    <h1 className="text-4xl font-serif italic text-[#4B3D2A] leading-tight">{user.username}</h1>
                                    <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[#A68A6B] mt-1">{user.location || "Coordinates Missing"}</p>
                                </header>

                                <div className="max-w-sm">
                                    <p className="text-xs font-serif italic leading-relaxed text-[#4B3D2A]/80 line-clamp-4">
                                        {user.bio || "The subject has left no narrative record for this exhibit."}
                                    </p>
                                </div>

                                <div className="pt-4 flex gap-4 justify-center md:justify-start">
                                    <button onClick={() => setIsEditing(true)} className="btn-museum !py-2 !px-4 !text-[7px]">Modify Record</button>
                                    <button onClick={() => setIsDeleting(!isDeleting)} className="text-[7px] font-black uppercase tracking-widest text-[#8a3a3c] hover:underline cursor-pointer">Decommission</button>
                                </div>
                                
                                {isDeleting && (
                                    <div className="mt-4 p-3 border border-[#8a3a3c] bg-[#8a3a3c]/5 flex items-center justify-center gap-4 animate-pulse">
                                        <span className="text-[7px] font-black text-[#8a3a3c] uppercase">Confirm Permanent Erasure?</span>
                                        <button onClick={() => userService.deleteProfile().then(() => { localStorage.removeItem('token'); setUser(null); navigate('/'); })} className="text-[7px] font-black text-[#8a3a3c] underline cursor-pointer">Execute</button>
                                        <button onClick={() => setIsDeleting(false)} className="text-[7px] font-black opacity-40 cursor-pointer">Abort</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto relative z-10">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="text-[7px] font-black uppercase tracking-widest mb-1 block">Upload Portrait</label>
                                    <input type="file" onChange={handleFileChange} className="text-[8px] w-full" />
                                </div>
                                <div className="form-control">
                                    <label className="text-[7px] font-black uppercase tracking-widest mb-1 block">Curator Station</label>
                                    <input type="text" name="location" value={formData.location} onChange={handleChange} className="museum-input text-[10px] p-1 w-full" />
                                </div>
                            </div>
                            <div className="form-control">
                                <label className="text-[7px] font-black uppercase tracking-widest mb-1 block">Subject Narrative</label>
                                <textarea name="bio" value={formData.bio} onChange={handleChange} className="museum-input text-[10px] p-2 h-20 w-full" />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button type="submit" className="btn-museum flex-1 !py-2 !text-[7px]">Update Archive</button>
                                <button type="button" onClick={() => setIsEditing(false)} className="text-[7px] font-black uppercase px-4 cursor-pointer">Cancel</button>
                            </div>
                        </form>
                    )}
                </section>
                <div className="museum-label">
                    <p className="text-[8px] font-black uppercase tracking-tighter">Exhibit 001: The Self</p>
                    <p className="text-[6px] opacity-60 font-serif italic">Digital Curatorial Records, 2026</p>
                </div>
            </div>
        </main>
    );
};

export default Profile;