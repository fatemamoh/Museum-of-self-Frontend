import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
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
        <div className="max-w-4xl mx-auto py-10">
            <nav className="breadcrumb-nav">
                <Link to="/">Dashboard</Link>
                <span className="breadcrumb-separator">/</span>
                <Link to="/lifePhases">Archives</Link>
                <span className="breadcrumb-separator">/</span>
                <span className="text-crimson">{initialData ? 'Update_Record' : 'New_Entry'}</span>
            </nav>

            <div className="museum-ledger flex flex-col md:flex-row min-h-125mate-hero">
                <div className="ledger-sidebar w-full md:w-1/3 p-8 flex flex-col justify-between border-b md:border-b-0">
                    <div>
                        <div className="w-12 h-1 bg-crimsonb-6"></div>
                        <h2 className="text-3xl font-serif italic text-museum-darkrk leading-tight">
                            {initialData ? 'Modify Gallery Wing' : 'Catalog New Era'}
                        </h2>
                        <p className="text-[10px] mt-4 opacity-60 leading-relaxed uppercase tracking-tighter">
                            Verify chronological data before final commit.
                        </p>
                    </div>
                    <div className="text-[7px] font-mono opacity-30 mt-8">
                        FORM_REF: {initialData ? initialData._id : 'TEMP_PHASE_NULL'}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 p-8 md:p-12 space-y-8 bg-white/30 relative z-50">
                    <div className="space-y-6">
                        <div className="form-control">
                            <label className="text-[9px] font-black uppercase tracking-widest text-museum-brownown mb-1 block">Title of Exhibit</label>
                            <input name="title" placeholder="ERA TITLE..." className="museum-input text-xl font-serif italic py-2" value={formData.title} onChange={handleChange} required />
                        </div>
                        <div className="grid grid-cols-2 gap-10">
                            <div className="form-control">
                                <label className="text-[9px] font-black uppercase tracking-widest text-museum-brownown mb-1 block">Date Opened</label>
                                <input type="date" name="startDate" className="museum-input text-xs py-2 opacity-70" value={formData.startDate} onChange={handleChange} required />
                            </div>
                            <div className="form-control">
                                <label className="text-[9px] font-black uppercase tracking-widest text-museum-brown mb-1 block">Date Closed</label>
                                <input type="date" name="endDate" className="museum-input text-xs py-2 opacity-70" value={formData.endDate} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-control">
                            <label className="text-[9px] font-black uppercase tracking-widest text-museum-brownown mb-1 block">Archival Summary</label>
                            <textarea name="summary" placeholder="NARRATIVE..." className="museum-input h-32 p-3 text-sm resize-none border border-museum-dark/1010 font-serif italic" value={formData.summary} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="flex items-center gap-6 pt-6">
                        <button type="submit" className="btn-stamp px-8 py-3 text-[10px] flex-1">Commit Entry</button>
                        <button type="button" onClick={() => navigate(-1)} className="text-[9px] font-black uppercase opacity-40 hover:opacity-100 transition-opacity tracking-widest">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LifePhaseForm;