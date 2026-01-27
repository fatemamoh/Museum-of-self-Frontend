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
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  useEffect(() => {
    const fetchPhase = async () => {
      try {
        const data = await lifePhaseService.index();
        const current = data.find(p => p._id === id);
        setPhase(current);
        if (current) setTheme(current.theme);
      } catch (err) { console.error(err); }
    };
    fetchPhase();
    return () => setTheme('classic');
  }, [id, setTheme]);

  const handleUpdate = (updatedPhase) => {
    setPhase(updatedPhase);
    setTheme(updatedPhase.theme);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      await lifePhaseService.deleteLifePhase(id);
      navigate('/lifePhases');
    } catch (err) { console.error(err); }
  };

  if (!phase) return <div className="min-h-screen flex items-center justify-center italic opacity-30">Consulting Curator...</div>;

  return (
    <main className="min-h-screen transition-museum bg-base-100 text-base-content p-10 md:p-24">
      <div className="max-w-4xl mx-auto">
        {isEditing ? (
          <div className="bg-base-200/50 p-10 border border-primary/10">
            <h2 className="text-4xl font-serif italic mb-10">Renovating Wing</h2>
            <LifePhaseForm 
                initialData={phase} 
                onUpdate={handleUpdate} 
                onCancel={() => setIsEditing(false)} 
            />
          </div>
        ) : (
          <>
            <header className="mb-20 border-b border-primary/20 pb-10">
              <span className="text-[10px] font-black tracking-[0.5em] uppercase opacity-40">Exhibition Wing</span>
              <h1 className="text-8xl font-serif italic mt-4">{phase.title}</h1>
              <p className="text-lg tracking-widest opacity-60 mt-6">
                {new Date(phase.startDate).toLocaleDateString()} — {phase.endDate ? new Date(phase.endDate).toLocaleDateString() : 'Present Era'}
              </p>
            </header>
            
            <section className="prose prose-xl font-serif italic opacity-80 leading-relaxed mb-20">
              {phase.summary || "This wing is currently silent. No statement has been recorded for this period."}
            </section>

            <div className="flex gap-6 items-center">
              <button onClick={() => setIsEditing(true)} className="btn btn-primary rounded-none px-12">Renovate</button>
              <button onClick={() => setShowDeletePopup(true)} className="btn btn-outline btn-error rounded-none px-12">Erase Wing</button>
              <button onClick={() => navigate('/lifePhases')} className="btn btn-ghost rounded-none">Floor Plan</button>
            </div>
          </>
        )}
      </div>

      {showDeletePopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-base-100 border-2 border-error p-12 max-w-lg w-full shadow-2xl text-center">
            <h2 className="text-error font-serif italic text-4xl mb-6">Critical Warning</h2>
            <p className="mb-12 text-lg opacity-80 leading-relaxed">
              Permanently destroy the <span className="font-bold underline text-primary">"{phase.title}"</span> wing? This record will be erased from the archives forever.
            </p>
            <div className="flex flex-col gap-4">
              <button onClick={handleDelete} className="btn btn-error rounded-none text-white w-full uppercase tracking-widest font-bold">Destroy Record</button>
              <button onClick={() => setShowDeletePopup(false)} className="btn btn-ghost rounded-none w-full uppercase tracking-widest font-bold">Abort</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default LifePhaseDetails;