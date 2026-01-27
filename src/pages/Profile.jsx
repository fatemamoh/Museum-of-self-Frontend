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
            setIsEditing(false);
        } catch (err) { console.error(err); }
    };

    if (!user) return null;

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-6 relative">
            <div className="blueprint-grid"></div>
            <nav className="breadcrumb-nav w-full max-w-3xl">
                <Link to="/">Dashboard</Link>
                <span className="breadcrumb-separator">/</span>
                <span>Curator_Profile</span>
            </nav>
            <div className="spotlight">
                <div className="museum-frame animate-hero">
                    <section className="bg-[#E8DFCA] p-10 min-w-[320px] md:min-w-150 relative">
                        {!isEditing ? (
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="w-44 h-56 bg-museum-beige border-[6px] border-white shadow-md shrink-0 grayscale hover:grayscale-0 transition-all duration-1000 overflow-hidden dusty-glass">
                                    {user.avatarUrl ? <img src={user.avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[7px] font-black opacity-20 text-center px-4">NO_IMAGE</div>}
                                </div>
                                <div className="flex-1 space-y-4">
                                    <header className="border-b border-museum-dark/10 pb-3">
                                        <h1 className="text-4xl font-serif italic">{user.username}</h1>
                                        <p className="text-[8px] font-black uppercase tracking-[0.4em] text-museum-tan">{user.location || "UNKNOWN"}</p>
                                    </header>
                                    <p className="text-xs font-serif italic text-museum-dark/80">{user.bio || "No archival notes."}</p>
                                    <div className="pt-4 flex gap-4">
                                        <button onClick={() => setIsEditing(true)} className="btn-stamp py-2! px-4! text-[8px]!">Modify</button>
                                        <button onClick={() => setIsDeleting(!isDeleting)} className="text-[8px] font-black uppercase text-crimson cursor-pointer">Decommission</button>
                                    </div>
                                    {isDeleting && (
                                        <div className="mt-4 p-2 border border-crimson bg-crimson/5 flex gap-4 items-center">
                                            <button onClick={() => userService.deleteProfile().then(() => { localStorage.removeItem('token'); setUser(null); navigate('/'); })} className="text-[8px] font-black text-crimson underline cursor-pointer">Confirm</button>
                                            <button onClick={() => setIsDeleting(false)} className="text-[8px] font-black opacity-40 cursor-pointer">Abort</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-[8px] font-black block mb-2 uppercase">Portrait</label><input type="file" onChange={handleFileChange} className="text-[8px]" /></div>
                                    <div><label className="text-[8px] font-black block mb-2 uppercase">Station</label><input type="text" name="location" value={formData.location} onChange={handleChange} className="museum-input text-[10px]" /></div>
                                </div>
                                <div><label className="text-[8px] font-black block mb-2 uppercase">Narrative</label><textarea name="bio" value={formData.bio} onChange={handleChange} className="museum-input text-[10px] h-20 resize-none" /></div>
                                <div className="flex gap-4">
                                    <button type="submit" className="btn-stamp py-2! px-6! text-[8px]!">Save Archive</button>
                                    <button type="button" onClick={() => setIsEditing(false)} className="text-[8px] font-black uppercase cursor-pointer">Cancel</button>
                                </div>
                            </form>
                        )}
                    </section>
                    <div className="museum-label">
                        <p className="text-[8px] font-black uppercase tracking-tighter">Exhibit: The Curator</p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Profile;