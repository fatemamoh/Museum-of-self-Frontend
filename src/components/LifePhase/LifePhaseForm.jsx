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
        <form onSubmit={handleSubmit} className="space-y-6 bg-transparent">
            <div className="form-control">
                <label className="label" htmlFor="title">
                    <span className="label-text font-bold text-primary uppercase text-xs">Title</span>
                </label>
                <input type="text" id="title" name="title" placeholder="Era Title" className="input input-bordered rounded-none bg-base-200/30" value={formData.title} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                    <label className="label" htmlFor="startDate"><span className="label-text font-bold text-primary uppercase text-xs">Inauguration</span></label>
                    <input type="date" id="startDate" name="startDate" className="input input-bordered rounded-none bg-base-200/30" value={formData.startDate} onChange={handleChange} required />
                </div>
                <div className="form-control">
                    <label className="label" htmlFor="endDate"><span className="label-text font-bold text-primary uppercase text-xs">Conclusion</span></label>
                    <input type="date" id="endDate" name="endDate" className="input input-bordered rounded-none bg-base-200/30" value={formData.endDate} onChange={handleChange} />
                </div>
            </div>

            <div className="form-control">
                <label className="label" htmlFor="summary"><span className="label-text font-bold text-primary uppercase text-xs">Statement</span></label>
                {formData.endDate ? (
                    <textarea id="summary" name="summary" className="textarea textarea-bordered h-32 rounded-none bg-base-200/30" value={formData.summary} onChange={handleChange} required minLength={20} />
                ) : (
                    <div className="p-4 bg-base-200 border border-dashed border-primary/30 text-center italic text-sm">Set conclusion to unlock statement.</div>
                )}
            </div>

            <div className="form-control">
                <label className="label"><span className="label-text font-bold text-primary uppercase text-xs">Aesthetic</span></label>
                <div className="flex flex-wrap gap-4">
                    {themes.map(t => (
                        <label key={t} className="flex items-center gap-2 cursor-pointer" htmlFor={`theme-${t}`}>
                            <input type="radio" id={`theme-${t}`} name="theme" value={t} checked={formData.theme === t} onChange={handleChange} className="radio radio-primary" />
                            <span className="capitalize text-sm">{t}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <button type="submit" className="btn btn-primary flex-1 rounded-none uppercase">{initialData ? 'Save' : 'Open Wing'}</button>
                <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost rounded-none uppercase">Cancel</button>
            </div>
        </form>
    );
};

export default LifePhaseForm;