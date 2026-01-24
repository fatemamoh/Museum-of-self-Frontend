import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import * as lifePhaseService from '../../services/lifePhaseService';
import LifePhaseForm from './LifePhaseForm';

const LifePhaseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [phase, setPhase] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const themeColors = { gold: '#916f3b', olive: '#535346', charcoal: '#2f2e29', terracotta: '#8a3a3c', slate: '#424036' };

    useEffect(() => {
        const fetchPhase = async () => {
            try {
                const data = await lifePhaseService.index();
                const current = data.find(phase => phase._id === id);
                setPhase(current);
            } catch (error) {
                console.error(error)
            };

        }; fetchPhase();
    }, [id]);

    const handleDelete = async ()=>{
        try {
            await lifePhaseService.deleteLifePhase(id);
            navigate('/');
        } catch (error) {
            console.error(error)
        }
    }

    const handleUpdate = (updatePhase) =>{
        setPhase(updatePhase);
        setIsEditing(false);
    };

    if (!phase) return <main className="min-h-screen bg-[#2f2e29] flex items-center justify-center text-[#916f3b] font-black uppercase">Retrieving Archive...</main>;

    const accent = themeColors[phase.theme] || themeColors.gold;

    if (isEditing) {
        return (
            <main className="min-h-screen bg-[#2f2e29] p-12">
                <div className="max-w-4xl mx-auto">
                    <button onClick={() => setIsEditing(false)} className="text-[#9b8f6a] text-[10px] font-bold uppercase tracking-widest mb-8">← Cancel Renovation</button>
                    <LifePhaseForm 
                        initialData={phase} 
                        id={id} 
                        onUpdate={handleUpdate} 
                    />
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#2f2e29] p-6 md:p-12 lg:p-24">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <button onClick={() => navigate('/')} className="text-[#9b8f6a] text-[10px] font-bold uppercase tracking-widest hover:underline flex items-center gap-2">← Back to Floor Plan</button>
                    
                    <div className="flex gap-4">
                        <button onClick={() => setIsEditing(true)} className="text-[#9b8f6a] text-[10px] font-bold uppercase border border-[#9b8f6a] px-6 py-2 hover:bg-[#9b8f6a] hover:text-[#2f2e29] transition-all shadow-[4px_4px_0px_0px_rgba(155,143,106,0.3)]">
                            Modify Wing
                        </button>
                        <button onClick={handleDelete} className="text-red-800 text-[10px] font-bold uppercase border border-red-800 px-6 py-2 hover:bg-red-800 hover:text-white transition-all">
                            Delete Wing 
                        </button>
                    </div>
                </div>

                <article className="border-t-8 pt-12" style={{ borderColor: accent }}>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block" style={{ color: accent }}>Exhibition Record</span>
                            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-[#9b8f6a]">{phase.title}</h1>
                        </div>
                        <div className="text-right">
                            <p className="text-[#9b8f6a] text-xs font-bold uppercase tracking-widest">Phase Range</p>
                            <p className="text-xl font-black text-[#916f3b] uppercase">
                                {new Date(phase.startDate).getFullYear()} 
                                {phase.endDate ? ` — ${new Date(phase.endDate).getFullYear()}` : ' — Present'}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-[#424036] pt-12">
                        <div className="lg:col-span-2">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#916f3b] mb-6">Gallery Overview</h3>
                            <p className="text-[#9b8f6a] text-2xl font-serif italic leading-relaxed border-l-4 pl-8" style={{ borderColor: accent }}>"{phase.summary}"</p>
                        </div>
                    </div>
                </article>
            </div>
        </main>
    );
};

export default LifePhaseDetails;
