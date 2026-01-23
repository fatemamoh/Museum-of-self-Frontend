import { useState } from 'react';
import * as lifePhaseService from '../../services/lifePhaseService'

const LifePhaseForm = (props) => {
    const [formData, setFormData] = useState({
        title: '',
        summary: '',
        startDate: '',
        endDate: '',
        theme: 'gold'
    });

    const themes = ['gold', 'olive', 'charcoal', 'terracotta', 'slate'];

    const handleChange = (evt) => {
        setFormData({ ...formData, [evt.target.name]: evt.target.value });
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        try {
            const newPhase = await lifePhaseService.create(formData);
            props.onAdd(newPhase);
            setFormData({ title: '', summary: '', startDate: '', endDate: '', theme: 'gold' });
        } catch (err) {
            console.error("Archive Error:", err);
        }
    };

    return (
        <section className="bg-[#2f2e29] border-4 border-[#916f3b] p-8 mb-12 shadow-[10px_10px_0px_0px_rgba(145,111,59,1)]">
            <h2 className="text-xl font-black uppercase text-[#916f3b] mb-6 tracking-tighter">
                Initialize New Exhibition Wing
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">


                <div className="flex flex-col gap-2">
                    <label htmlFor="title" className="text-[10px] font-bold text-[#916f3b] uppercase">
                        Exhibition Title
                    </label>
                    <input
                        id="title"
                        name="title"
                        placeholder="E.G., THE UNIVERSITY YEARS"
                        className="bg-[#424036] border-b-2 border-[#535346] p-3 text-[#9b8f6a] outline-none focus:border-[#916f3b] uppercase font-bold"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>


                <div className="flex flex-col gap-2">
                    <label htmlFor="summary" className="text-[10px] font-bold text-[#916f3b] uppercase">
                        Gallery Overview
                    </label>
                    <textarea
                        id="summary"
                        name="summary"
                        placeholder="DESCRIBE THIS ERA IN AT LEAST 20 CHARACTERS..."
                        className="bg-[#424036] border-b-2 border-[#535346] p-3 text-[#9b8f6a] h-24 outline-none focus:border-[#916f3b] italic"
                        value={formData.summary}
                        onChange={handleChange}
                        required
                    />
                </div>


                <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="startDate" className="text-[10px] font-bold text-[#916f3b] uppercase">
                            Opening Date
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            className="bg-[#424036] p-2 text-[#9b8f6a] border-b-2 border-[#535346] outline-none"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="endDate" className="text-[10px] font-bold text-[#916f3b] uppercase">
                            Archived Date
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            placeholder="LEAVE BLANK IF CURRENT"
                            className="bg-[#424036] p-2 text-[#9b8f6a] border-b-2 border-[#535346] outline-none"
                            value={formData.endDate}
                            onChange={handleChange}
                        />
                    </div>
                </div>


                <div className="flex flex-col gap-4 py-4 border-t border-[#424036]">
                    <span className="text-[10px] font-bold text-[#916f3b] uppercase">Gallery Visual Theme</span>
                    <div className="flex gap-6">
                        {themes.map(theme => (
                            <label key={theme} className="cursor-pointer relative">
                                <input
                                    type="radio"
                                    name="theme"
                                    value={theme}
                                    checked={formData.theme === theme}
                                    onChange={handleChange}
                                    className="hidden"
                                />
                                <div
                                    className={`w-8 h-8 rounded-full border-4 transition-transform hover:scale-110 ${formData.theme === theme ? 'border-white' : 'border-transparent'}`}
                                    style={{ backgroundColor: theme === 'gold' ? '#916f3b' : theme === 'olive' ? '#535346' : theme === 'charcoal' ? '#2f2e29' : theme === 'terracotta' ? '#8a3a3c' : '#424036' }}
                                />
                            </label>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-[#916f3b] text-[#2f2e29] font-black py-4 mt-4 hover:bg-white transition-colors uppercase tracking-widest shadow-[5px_5px_0px_0px_rgba(0,0,0,0.3)]"
                >
                    Finalize Exhibition
                </button>
            </form>
        </section>
    );
};

export default LifePhaseForm;
