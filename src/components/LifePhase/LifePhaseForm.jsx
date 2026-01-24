import { useState } from 'react';
import * as lifePhaseService from '../../services/lifePhaseService';

const LifePhaseForm = ({ initialData, onAdd, onUpdate, onCancel }) => {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        summary: initialData?.summary || '',
        startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
        endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
        theme: initialData?.theme || 'gold'
    });

    const themes = ['gold', 'olive', 'charcoal', 'terracotta', 'slate'];

    const handleChange = (evt) => {
        setFormData({ ...formData, [evt.target.name]: evt.target.value });
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        const dataToSubmit = { ...formData };
        if (!dataToSubmit.endDate) {
            dataToSubmit.summary = ""; 
        }

        try {
            if (initialData) {
                const updated = await lifePhaseService.update(initialData._id, dataToSubmit);
                onUpdate(updated);
            } else {
                const newPhase = await lifePhaseService.create(dataToSubmit);
                onAdd(newPhase);
            }
        } catch (err) {
            console.error("Archive Error:", err.response?.data || err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="title">Exhibit Title</label>
                <input 
                    type="text"
                    id="title"
                    name="title" 
                    placeholder="Name this life chapter..."
                    value={formData.title} 
                    onChange={handleChange} 
                    required 
                />
            </div>

            <div>
                <div>
                    <label htmlFor="startDate">Start Date</label>
                    <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="endDate">End Date</label>
                    <input type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleChange} />
                </div>
            </div>

            {formData.endDate ? (
                <div>
                    <label htmlFor="summary">Reflections & Summary (Min. 20 chars)</label>
                    <textarea 
                        id="summary"
                        name="summary" 
                        minLength="20"
                        placeholder="Summary field..."
                        value={formData.summary} 
                        onChange={handleChange} 
                        required 
                    />
                    {formData.summary.length > 0 && formData.summary.length < 20 && (
                        <span>{20 - formData.summary.length} more characters required</span>
                    )}
                </div>
            ) : (
                <div>
                    <p>Define an End Date to unlock the Summary field</p>
                </div>
            )}

            <div>
                <span>Gallery Theme</span>
                <div>
                    {themes.map(t => (
                        <label key={t} htmlFor={`theme-${t}`}>
                            <input 
                                type="radio" 
                                id={`theme-${t}`}
                                name="theme" 
                                value={t} 
                                checked={formData.theme === t} 
                                onChange={handleChange} 
                            />
                            {t}
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <button type="submit">{initialData ? 'Update Wing' : 'Initialize Wing'}</button>
                {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
            </div>
        </form>
    );
};

export default LifePhaseForm;