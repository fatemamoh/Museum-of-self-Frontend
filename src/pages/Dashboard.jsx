import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import * as lifePhaseService from '../services/lifePhaseService';
import LifePhaseForm from '../components/LifePhase/LifePhaseForm';
import LifePhaseList from '../components/LifePhase/LifePhaseList';

const Dashboard = () => {
    const { user } = useContext(UserContext);
    const [lifePhases, setLifePhases] = useState([]);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const fetchPhases = async () => {
            try {
                const data = await lifePhaseService.index();
                setLifePhases(data);
            } catch (error) {
                console.error(error);
            }
        };
        if (user) fetchPhases();
    }, [user]);

    const handleAddPhase = (newPhase) => {
        setLifePhases([newPhase, ...lifePhases]);
        setIsAdding(false);
    };

    return (
        <main className="min-h-screen bg-[#424036] p-6 md:p-12 relative">
            <div className={`transition-all duration-500 ${isAdding ? 'blur-md grayscale opacity-50 scale-95' : ''}`}>
                <header className="max-w-6xl mx-auto flex justify-between items-end mb-12 border-b-2 border-[#916f3b] pb-6">
                    <div>
                        <h1 className="text-4xl font-black text-[#9b8f6a] uppercase tracking-tighter">Museum Floor Plan</h1>
                        <div className="flex gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#916f3b]">
                            <span>Curator: {user?.username}</span>
                            <span className="opacity-30">|</span>
                            <span> {lifePhases.length} Rooms</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-[#9b8f6a] text-[#2f2e29] px-8 py-3 font-black uppercase text-xs hover:bg-white transition-all shadow-[5px_5px_0px_0px_rgba(47,46,41,1)]"
                    >
                        Open New Wing
                    </button>
                </header>

                <div className="max-w-6xl mx-auto">
                    <LifePhaseList lifePhases={lifePhases} />
                </div>
            </div>

            {isAdding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2f2e29]/90 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg bg-[#2f2e29] border-2 border-[#916f3b] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-[#424036] flex justify-between items-center bg-[#2f2e29]">
                            <h2 className="text-[#916f3b] font-black uppercase tracking-[0.3em] text-xs">New Exhibit </h2>
                            <button onClick={() => setIsAdding(false)} className="text-[#9b8f6a] hover:text-white">✕</button>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <LifePhaseForm onAdd={handleAddPhase} onCancel={() => setIsAdding(false)} />
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Dashboard;