import { useState } from 'react';
import { useNavigate } from 'react-router';
import * as lifePhaseService from '../../services/lifePhaseService';

const LifePhaseForm = ({ initialData, onUpdate }) => {
    const navigate = useNavigate();
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
        try {
            if (initialData) {
                const updated = await lifePhaseService.update(initialData._id, formData);
                if (onUpdate) onUpdate(updated);
            } else {
                await lifePhaseService.create(formData);
                navigate('/lifePhases');
            }
        } catch (err) { console.error(err); }
    };

    return (
        <div className="max-w-3xl mx-auto px-6 py-12">
            <div className="museum-form-container p-8 md:p-12 shadow-2xl animate-hero">
                <div className="absolute inset-2 border border-[#4B3D2A]/10 pointer-events-none"></div>
                <form onSubmit={handleSubmit} className="relative z-10 space-y-10">
                    <header className="border-b-2 border-[#4B3D2A] pb-8">
                        <span className="text-[9px] uppercase tracking-[0.5em] font-black opacity-40">Documentation Protocol</span>
                        <h2 className="text-4xl font-serif italic text-[#4B3D2A] mt-2">
                            {initialData ? 'Update Gallery Record' : 'Commence New Archive'}
                        </h2>
                    </header>
                    
                    <div className="form-control">
                        <label className="label uppercase text-[9px] tracking-[0.3em] font-black text-[#7A5B3A]" htmlFor="title">Era Designation</label>
                        <input id="title" name="title" placeholder="ERAS TITLE..." className="museum-input input w-full" value={formData.title} onChange={handleChange} required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="form-control">
                            <label className="label uppercase text-[9px] tracking-[0.3em] font-black text-[#7A5B3A]" htmlFor="startDate">Opening Date</label>
                            <input type="date" id="startDate" name="startDate" className="museum-input input w-full" value={formData.startDate} onChange={handleChange} required />
                        </div>
                        <div className="form-control">
                            <label className="label uppercase text-[9px] tracking-[0.3em] font-black text-[#7A5B3A]" htmlFor="endDate">Closing Date</label>
                            <input type="date" id="endDate" name="endDate" className="museum-input input w-full" value={formData.endDate} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label uppercase text-[9px] tracking-[0.3em] font-black text-[#7A5B3A]" htmlFor="summary">Curator Narrative</label>
                        <textarea id="summary" name="summary" placeholder="PROVIDE ARCHIVAL OVERVIEW..." className="museum-input textarea h-48 w-full pt-4" value={formData.summary} onChange={handleChange} />
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 pt-6">
                        <button type="submit" className="btn-museum flex-1">Commit to Archives</button>
                        <button type="button" onClick={() => navigate(-1)} className="text-[9px] font-black uppercase tracking-[0.4em] text-[#4B3D2A] hover:text-[#8a3a3c] transition-colors">Abort Entry</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LifePhaseForm;