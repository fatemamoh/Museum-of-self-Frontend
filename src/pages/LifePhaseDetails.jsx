import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ThemeContext } from '../contexts/ThemeContext';
import * as lifePhaseService from '../services/lifePhaseService';
import LifePhaseForm from '../components/LifePhase/LifePhaseForm';

const LifePhaseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setTheme } = useContext(ThemeContext);
    const [phase, setPhase] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        const fetchPhase = async () => {
            try {
                const data = await lifePhaseService.index();
                const current = data.find(p => p._id === id);
                setPhase(current);
                if (current) setTheme(current.theme);
            } catch (error) {
                console.error(error);
            }
        }; 
        fetchPhase();
        return () => setTheme('classic');
    }, [id, setTheme]);

    const handleDelete = async () => {
        try {
            await lifePhaseService.deleteLifePhase(id);
            navigate('/lifePhases');
        } catch (error) {
            console.error(error);
        }
    };

    if (!phase) return <main className="p-8 italic">Opening Archive...</main>;

    return (
        <main className="min-h-screen transition-museum p-8 bg-base-100 text-base-content">
            <div className="max-w-4xl mx-auto p-12 shadow-2xl border border-museum-brown/10 bg-base-100">
                {isEditing ? (
                    <LifePhaseForm initialData={phase} />
                ) : (
                    <>
                        <header className="border-b border-museum-beige pb-8 mb-8">
                            <h1 className="text-5xl font-serif italic mb-4">{phase.title}</h1>
                            <div className="flex justify-between items-center text-primary uppercase tracking-widest font-bold text-xs">
                                <span>Inaugurated: {new Date(phase.startDate).toLocaleDateString()}</span>
                                <span>Conclusion: {phase.endDate ? new Date(phase.endDate).toLocaleDateString() : 'Active'}</span>
                            </div>
                        </header>
                        <section className="mb-12">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4 opacity-70">Curator's Narrative</h3>
                            <p className="text-2xl font-serif italic leading-relaxed">
                                {phase.summary ? `"${phase.summary}"` : "This chapter of the museum is still being written..."}
                            </p>
                        </section>
                        <div className="flex gap-4 border-t border-museum-beige pt-8">
                            <button onClick={() => setIsEditing(true)} className="btn btn-outline rounded-none uppercase">Renovate Wing</button>
                            <button onClick={() => setIsDeleteModalOpen(true)} className="btn btn-error btn-outline rounded-none uppercase">Erase Record</button>
                            <button onClick={() => navigate('/lifePhases')} className="btn btn-ghost rounded-none uppercase">Back to Floor Plan</button>
                        </div>
                    </>
                )}
            </div>

            <div className={`modal ${isDeleteModalOpen ? 'modal-open' : ''}`}>
                <div className="modal-box rounded-none border-2 border-error bg-base-100">
                    <h3 className="font-serif italic text-2xl text-error mb-4">Critical Action</h3>
                    <p className="py-4 text-base-content">Permanently erase the wing "{phase.title}"?</p>
                    <div className="modal-action flex gap-4">
                        <button onClick={handleDelete} className="btn btn-error rounded-none flex-1 uppercase">Confirm</button>
                        <button onClick={() => setIsDeleteModalOpen(false)} className="btn btn-ghost rounded-none flex-1 uppercase">Abort</button>
                    </div>
                </div>
                <div className="modal-backdrop" onClick={() => setIsDeleteModalOpen(false)}></div>
            </div>
        </main>
    );
};

export default LifePhaseDetails;