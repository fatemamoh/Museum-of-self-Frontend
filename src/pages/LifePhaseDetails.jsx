import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import * as lifePhaseService from '../services/lifePhaseService';
import LifePhaseForm from '../components/LifePhase/LifePhaseForm';

const LifePhaseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [phase, setPhase] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    const themeColors = { gold: '#916f3b', olive: '#535346', charcoal: '#2f2e29', terracotta: '#8a3a3c', slate: '#424036' };

    useEffect(() => {
        const fetchPhase = async () => {
            try {
                const data = await lifePhaseService.index();
                const current = data.find(p => p._id === id);
                setPhase(current);
            } catch (error) {
                console.error(error);
            }
        }; 
        fetchPhase();
    }, [id]);

    const handleDelete = async () => {
        try {
            await lifePhaseService.deleteLifePhase(id);
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdate = (updatedPhase) => {
        setPhase(updatedPhase);
        setIsEditing(false);
    };

    if (!phase) return <main className="min-h-screen bg-[#2f2e29] flex items-center justify-center text-[#916f3b] font-black uppercase">Retrieving Archive...</main>;

    const accent = themeColors[phase.theme] || themeColors.gold;

    return (
        <main className="min-h-screen bg-[#2f2e29] p-6 md:p-12 lg:p-24 relative">
            <div className={`max-w-4xl mx-auto transition-all duration-500 ${(isEditing || showDeleteModal) ? 'blur-md grayscale opacity-50 scale-95' : ''}`}>
                <div className="flex justify-between items-center mb-12">
                    <button onClick={() => navigate('/')} className="text-[#9b8f6a] text-[10px] font-bold uppercase tracking-widest hover:underline flex items-center gap-2">← Back to Floor Plan</button>
                    <div className="flex gap-4">
                        <button onClick={() => setIsEditing(true)} className="text-[#9b8f6a] text-[10px] font-bold uppercase border border-[#9b8f6a] px-6 py-2 hover:bg-[#9b8f6a] hover:text-[#2f2e29] transition-all">Modify Wing</button>
                        <button onClick={() => setShowDeleteModal(true)} className="text-red-600 text-[10px] font-bold uppercase border border-red-900/30 px-6 py-2 hover:bg-red-600 hover:text-white transition-all">Delete Wing</button>
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

            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-[#2f2e29]/90 backdrop-blur-sm overflow-y-auto">
                    <div className="w-full max-w-2xl bg-[#2f2e29] p-1 border-2 border-[#916f3b] shadow-2xl my-8">
                        <div className="bg-[#2f2e29] p-8 md:p-12 border border-[#424036]">
                            <div className="flex justify-between items-center mb-8 sticky top-0 bg-[#2f2e29] z-10 pb-4">
                                <h2 className="text-[#916f3b] font-black uppercase tracking-[0.3em]">Renovate Wing</h2>
                                <button onClick={() => setIsEditing(false)} className="text-[#9b8f6a] hover:text-white">✕</button>
                            </div>
                            <LifePhaseForm initialData={phase} onUpdate={handleUpdate} onCancel={() => setIsEditing(false)} />
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/20 backdrop-blur-md">
                    <div className="bg-[#2f2e29] border-4 border-red-600 p-12 text-center max-w-md shadow-2xl">
                        <h2 className="text-red-500 font-black uppercase tracking-[0.4em] mb-4 text-sm">Critical Action</h2>
                        <p className="text-[#9b8f6a] mb-10 text-xs uppercase tracking-widest leading-relaxed">Are you sure you want to permanently erase the <span className="text-white">"{phase.title}"</span> wing?</p>
                        <div className="flex flex-col gap-4">
                            <button onClick={handleDelete} className="bg-red-600 text-white font-black py-4 uppercase text-xs tracking-[0.3em] hover:bg-white hover:text-red-600 transition-all">Confirm Destruction</button>
                            <button onClick={() => setShowDeleteModal(false)} className="text-[#9b8f6a] font-bold uppercase text-[10px] tracking-widest hover:text-white transition-colors">Abort & Return</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default LifePhaseDetails;