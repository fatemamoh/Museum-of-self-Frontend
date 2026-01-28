import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import * as lifePhaseService from '../../services/lifePhaseService';

const LifePhaseForm = ({ initialData, onUpdate }) => {
    const navigate = useNavigate();
    const [popup, setPopup] = useState(null);
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        summary: initialData?.summary || '',
        startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
        endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
    });

    const handleChange = (evt) => {
        setFormData({ ...formData, [evt.target.name]: evt.target.value });
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        
        if (formData.endDate && (!formData.summary || formData.summary.length < 20)) {
            setPopup("A summary of at least 20 characters is required to close this phase.");
            return;
        }

        try {
            if (initialData) {
                const updated = await lifePhaseService.update(initialData._id, formData);
                if (onUpdate) {
                    onUpdate(updated);
                } else {
                    navigate(`/lifePhases/${initialData._id}`);
                }
            } else {
                await lifePhaseService.create(formData);
                navigate('/lifePhases');
            }
        } catch (err) {
            setPopup(err.response?.data?.err || "An error occurred.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10 px-6 relative animate-hero">
            {popup && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#141013]/80 backdrop-blur-md p-4">
                    <div className="bg-museum-cream border-2 border-museum-dark p-8 max-w-sm w-full shadow-[20px_20px_0px_rgba(20,16,19,1)]">
                        <div className="text-red-700 font-serif italic mb-6 flex flex-col gap-2 text-center">
                            <span className="text-[10px] uppercase font-black tracking-widest opacity-50">Cataloging Error</span>
                            <p className="text-sm leading-relaxed">{popup}</p>
                        </div>
                        <button onClick={() => setPopup(null)} className="btn-stamp w-full py-3 text-[10px]">Rectify Record</button>
                    </div>
                </div>
            )}

            <nav className="breadcrumb-nav mb-8">
                <Link to="/" className="hover:text-museum-brown">Hall</Link>
                <span className="breadcrumb-separator mx-3 opacity-30">/</span>
                <Link to="/lifePhases" className="hover:text-museum-brown"> Exhibition</Link>
                <span className="breadcrumb-separator mx-3 opacity-30">/</span>
                <span className="text-museum-brown font-bold tracking-tighter uppercase text-[10px]">
                    {initialData ? 'Modify Exhibition' : 'New Exhibition'}
                </span>
            </nav>

            <div className="relative bg-white/40 border border-museum-dark/10 border-l-[6px] border-l-museum-brown p-8 md:p-12 shadow-sm">
                <div className="absolute top-4 right-6 text-[24px] font-black text-museum-dark/3 select-none pointer-events-none uppercase italic">
                    {initialData ? `REF_${initialData._id.slice(-4)}` : 'DRAFT_01'}
                </div>

                <header className="mb-10 relative">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-px w-6 bg-museum-brown/40"></div>
                        <span className="text-[8px] uppercase tracking-[0.4em] font-black text-museum-tan">Archival Requisition</span>
                    </div>
                    <h1 className="text-4xl font-serif italic text-museum-dark tracking-tighter">
                        {initialData ? 'Update Exhibition' : 'New Exhibition'}
                    </h1>
                </header>

                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="space-y-8">
                        <div className="form-control group">
                            <label htmlFor="title" className="text-[9px] font-black uppercase tracking-widest text-museum-brown/60 mb-2 block">Exhibition Title</label>
                            <input 
                                required 
                                type="text" 
                                id="title"
                                name="title" 
                                placeholder="IDENTIFY THE ERA..."
                                className="museum-input text-2xl font-serif italic w-full bg-transparent border-b border-museum-dark/10 focus:border-museum-brown transition-all py-2 outline-none" 
                                value={formData.title} 
                                onChange={handleChange} 
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="form-control">
                                <label htmlFor="startDate" className="text-[9px] font-black uppercase tracking-widest text-museum-brown mb-2 block">Start Date</label>
                                <input 
                                    required 
                                    type="date" 
                                    id="startDate"
                                    name="startDate" 
                                    className="museum-input text-[10px] py-2 w-full font-mono uppercase tracking-widest" 
                                    value={formData.startDate} 
                                    onChange={handleChange} 
                                />
                            </div>
                            <div className="form-control">
                                <label htmlFor="endDate" className="text-[9px] font-black uppercase tracking-widest text-museum-brown mb-2 block">End Date</label>
                                <input 
                                    type="date" 
                                    id="endDate"
                                    name="endDate" 
                                    className="museum-input text-[10px] py-2 w-full font-mono uppercase tracking-widest" 
                                    value={formData.endDate} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>

                        <div className={`form-control relative pt-4 transition-all duration-500 ${!formData.endDate ? 'opacity-20 grayscale pointer-events-none' : 'opacity-100'}`}>
                            <div className="flex justify-between items-end mb-3">
                                <label htmlFor="summary" className="text-[9px] font-black uppercase tracking-widest text-museum-brown block">
                                    Curator's Statement {formData.endDate && <span className="text-red-700">*</span>}
                                </label>
                                {formData.endDate && (
                                    <span className={`text-[8px] font-mono ${formData.summary.length < 20 ? 'text-red-700' : 'text-green-700'}`}>
                                        [{formData.summary.length.toString().padStart(2, '0')}/20]
                                    </span>
                                )}
                            </div>
                            <textarea 
                                id="summary"
                                name="summary" 
                                disabled={!formData.endDate}
                                placeholder={formData.endDate ? "TRANSCRIBE THE LEGACY..." : "Close wing to enable summary."} 
                                className="museum-input h-40 p-5 text-sm resize-none border border-museum-dark/10 font-serif italic w-full leading-relaxed bg-white/30 focus:bg-white transition-all shadow-inner" 
                                value={formData.summary} 
                                onChange={handleChange} 
                            />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-museum-dark/5">
                        <button 
                            type="button" 
                            onClick={() => navigate(-1)} 
                            className="text-[9px] font-black uppercase opacity-40 hover:opacity-100 tracking-widest transition-all order-2 md:order-1"
                        >
                            Close 
                        </button>
                        <button type="submit" className="btn-stamp px-12 py-4 text-[10px] w-full md:w-auto order-1 md:order-2">
                            {initialData ? 'Authorize Wing Updates' : 'Creat New Wing'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LifePhaseForm;