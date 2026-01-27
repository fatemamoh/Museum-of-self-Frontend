import { useState } from 'react';
import { useNavigate } from 'react-router';
import * as lifePhaseService from '../../services/lifePhaseService';

const LifePhaseForm = ({ initialData }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        summary: initialData?.summary || '',
        startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
        endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
        theme: initialData?.theme || 'classic'
    });

    const themes = ['classic', 'crimson', 'autumn', 'dusk'];

    const handleChange = (evt) => {
        setFormData({ ...formData, [evt.target.name]: evt.target.value });
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        const dataToSubmit = { ...formData };
        if (!dataToSubmit.endDate) dataToSubmit.summary = ""; 

        try {
            if (initialData) {
                await lifePhaseService.update(initialData._id, dataToSubmit);
                window.location.reload();
            } else {
                await lifePhaseService.create(dataToSubmit);
                navigate('/lifePhases');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex justify-center p-4">
            <form onSubmit={handleSubmit} className="card w-full max-w-2xl bg-base-100 p-8 space-y-6 rounded-none">
                <h2 className="text-3xl font-serif text-base-content border-b border-museum-beige pb-4 italic">
                    {initialData ? 'Renovate Wing' : 'Initialize New Wing'}
                </h2>

                <div className="form-control">
                    <label className="label" htmlFor="title">
                        <span className="label-text font-bold text-primary uppercase text-xs">Title</span>
                    </label>
                    <input type="text" id="title" name="title" placeholder="e.g., The Early Years" className="input input-bordered rounded-none bg-base-200/50" value={formData.title} onChange={handleChange} required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="form-control">
                        <label className="label" htmlFor="startDate"><span className="label-text font-bold text-primary uppercase text-xs">Inauguration</span></label>
                        <input type="date" id="startDate" name="startDate" className="input input-bordered rounded-none bg-base-200/50" value={formData.startDate} onChange={handleChange} required />
                    </div>
                    <div className="form-control">
                        <label className="label" htmlFor="endDate"><span className="label-text font-bold text-primary uppercase text-xs">Conclusion</span></label>
                        <input type="date" id="endDate" name="endDate" className="input input-bordered rounded-none bg-base-200/50" value={formData.endDate} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-control">
                    <label className="label" htmlFor="summary"><span className="label-text font-bold text-primary uppercase text-xs">Curator Statement</span></label>
                    {formData.endDate ? (
                        <textarea id="summary" name="summary" placeholder="Reflect on this era..." className="textarea textarea-bordered h-32 rounded-none bg-base-200/50" value={formData.summary} onChange={handleChange} required minLength={20} />
                    ) : (
                        <div className="p-4 bg-base-200 border border-dashed border-primary/30 text-center italic text-sm">Conclusion date required to unlock summary.</div>
                    )}
                </div>

                <div className="form-control">
                    <label className="label"><span className="label-text font-bold text-primary uppercase text-xs">Gallery Theme</span></label>
                    <div className="flex flex-wrap gap-6">
                        {themes.map(t => (
                            <label key={t} className="flex items-center gap-2 cursor-pointer" htmlFor={`theme-${t}`}>
                                <input type="radio" id={`theme-${t}`} name="theme" value={t} checked={formData.theme === t} onChange={handleChange} className="radio checked:bg-primary" />
                                <span className="capitalize text-sm">{t}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4 pt-6">
                    <button type="submit" className="btn btn-primary flex-1 rounded-none uppercase">{initialData ? 'Update Record' : 'Open Wing'}</button>
                    <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost rounded-none uppercase">Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default LifePhaseForm;