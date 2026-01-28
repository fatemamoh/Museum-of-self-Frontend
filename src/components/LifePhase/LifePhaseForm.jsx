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
        
        if (formData.endDate && formData.summary.length < 20) {
            setPopup("A summary of at least 20 characters is required to close this phase.");
            return;
        }

        try {
            if (initialData) {
                const updated = await lifePhaseService.update(initialData._id, formData);
                if (onUpdate) onUpdate(updated);
            } else {
                await lifePhaseService.create(formData);
                navigate('/lifePhases');
            }
        } catch (err) {
            setPopup(err.response?.data?.err || "An error occurred.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 relative">
            {popup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-museum-cream border border-museum-dark p-8 max-w-sm w-full text-center shadow-2xl">
                        <p className="text-crimson font-serif italic mb-6">{popup}</p>
                        <button onClick={() => setPopup(null)} className="btn-stamp w-full">Close</button>
                    </div>
                </div>
            )}

            <nav className="breadcrumb-nav">
                <Link to="/">Dashboard</Link>
                <span className="breadcrumb-separator">/</span>
                <Link to="/lifePhases">Archives</Link>
                <span className="breadcrumb-separator">/</span>
                <span>{initialData ? 'Edit Phase' : 'New Archive'}</span>
            </nav>

            <div className="mt-12 bg-white/40 border border-museum-dark/10 p-12">
                <h1 className="text-4xl font-serif italic mb-10">{initialData ? 'Renovate Room' : 'New Exhibition Wing'}</h1>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                        <div className="form-control">
                            <label className="text-[9px] font-black uppercase tracking-widest text-museum-brown mb-1 block">Title</label>
                            <input required type="text" name="title" className="museum-input text-lg font-serif italic" value={formData.title} onChange={handleChange} />
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="form-control">
                                <label className="text-[9px] font-black uppercase tracking-widest text-museum-brown mb-1 block">Date Opened</label>
                                <input required type="date" name="startDate" className="museum-input text-xs py-2" value={formData.startDate} onChange={handleChange} />
                            </div>
                            <div className="form-control">
                                <label className="text-[9px] font-black uppercase tracking-widest text-museum-brown mb-1 block">Date Closed</label>
                                <input type="date" name="endDate" className="museum-input text-xs py-2" value={formData.endDate} onChange={handleChange} />
                            </div>
                        </div>
                        <div className={`form-control transition-opacity ${!formData.endDate ? 'opacity-30' : 'opacity-100'}`}>
                            <label className="text-[9px] font-black uppercase tracking-widest text-museum-brown mb-1 block">Archival Summary</label>
                            <textarea 
                                name="summary" 
                                disabled={!formData.endDate}
                                placeholder={formData.endDate ? "NARRATIVE..." : "Lock enabled. Set a close date to provide summary."} 
                                className="museum-input h-32 p-3 text-sm resize-none border border-museum-dark/10 font-serif italic" 
                                value={formData.summary} 
                                onChange={handleChange} 
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-6 pt-6">
                        <button type="submit" className="btn-stamp px-8 py-3 text-[10px] flex-1">Commit Entry</button>
                        <button type="button" onClick={() => navigate(-1)} className="text-[9px] font-black uppercase opacity-40 hover:opacity-100 tracking-widest">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LifePhaseForm;