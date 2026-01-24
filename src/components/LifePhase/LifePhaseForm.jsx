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
        try {
            if (initialData) {
                const updated = await lifePhaseService.update(initialData._id, formData);
                onUpdate(updated);
            } else {
                const newPhase = await lifePhaseService.create(formData);
                onAdd(newPhase);
            }
        } catch (err) {
            console.error("Archive Error:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <label htmlFor="title" className="text-[9px] font-bold text-[#916f3b] uppercase tracking-widest">
                    Exhibit Title
                </label>
                <input 
                    type="text"
                    id="title"
                    name="title" 
                    placeholder="e.g., The Childhood Phase"
                    className="bg-[#424036] border-b border-[#535346] p-2 text-[#9b8f6a] outline-none focus:border-[#916f3b] text-sm" 
                    value={formData.title} 
                    onChange={handleChange} 
                    required 
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label htmlFor="startDate" className="text-[9px] font-bold text-[#916f3b] uppercase tracking-widest">
                        Start Date
                    </label>
                    <input 
                        type="date" 
                        id="startDate"
                        name="startDate" 
                        className="bg-[#424036] border-b border-[#535346] p-2 text-[#9b8f6a] outline-none text-xs" 
                        value={formData.startDate} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="endDate" className="text-[9px] font-bold text-[#916f3b] uppercase tracking-widest">
                        End Date
                    </label>
                    <input 
                        type="date" 
                        id="endDate"
                        name="endDate" 
                        className="bg-[#424036] border-b border-[#535346] p-2 text-[#9b8f6a] outline-none text-xs" 
                        value={formData.endDate} 
                        onChange={handleChange} 
                    />
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="summary" className="text-[9px] font-bold text-[#916f3b] uppercase tracking-widest">
                    Gallery Overview
                </label>
                <textarea 
                    id="summary"
                    name="summary" 
                    placeholder="Describe the significance of this wing..."
                    className="bg-[#424036] border-b border-[#535346] p-2 text-[#9b8f6a] h-20 outline-none focus:border-[#916f3b] resize-none text-sm" 
                    value={formData.summary} 
                    onChange={handleChange} 
                    required 
                />
            </div>

            <div className="flex flex-col gap-3 py-2 border-t border-[#424036]">
                <span className="text-[9px] font-bold text-[#916f3b] uppercase">Theme Selection</span>
                <div className="flex gap-4">
                    {themes.map(t => (
                        <label key={t} htmlFor={`theme-${t}`} className="cursor-pointer relative">
                            <input 
                                type="radio" 
                                id={`theme-${t}`}
                                name="theme" 
                                value={t} 
                                checked={formData.theme === t} 
                                onChange={handleChange} 
                                className="hidden" 
                            />
                            <div className={`w-6 h-6 rounded-full border-2 transition-transform ${formData.theme === t ? 'border-white scale-110' : 'border-transparent'}`} style={{ backgroundColor: t === 'gold' ? '#916f3b' : t === 'olive' ? '#535346' : t === 'charcoal' ? '#2f2e29' : t === 'terracotta' ? '#8a3a3c' : '#424036' }} />
                        </label>
                    ))}
                </div>
            </div>

            <button type="submit" className="w-full bg-[#916f3b] text-[#2f2e29] font-black py-3 mt-2 hover:bg-white transition-colors uppercase text-[10px] tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
                {initialData ? 'Update Wing' : 'Create Wing'}
            </button>
        </form>
    );
};

export default LifePhaseForm;