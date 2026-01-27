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

  const handleDelete = async () => {
    try {
      await lifePhaseService.deleteLifePhase(id);
      navigate('/lifePhases');
    } catch (err) { console.error(err); }
  };

  if (!phase) return <div className="min-h-screen flex items-center justify-center italic opacity-30">Consulting Curator...</div>;

  return (
    <main className="min-h-screen p-6 md:p-24 transition-museum">
      <div className="max-w-5xl mx-auto p-12 md:p-20 shadow-[0_0_80px_rgba(0,0,0,0.1)] bg-base-100 border border-primary/10 relative overflow-hidden">
        {isEditing ? (
          <LifePhaseForm initialData={phase} />
        ) : (
          <>
            <header className="border-b border-primary/20 pb-12 mb-12">
              <h1 className="text-5xl md:text-8xl font-serif italic mb-8 leading-tight">{phase.title}</h1>
              <div className="flex justify-between items-center text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                <span>Inaugurated: {new Date(phase.startDate).toLocaleDateString()}</span>
                <span>Conclusion: {phase.endDate ? new Date(phase.endDate).toLocaleDateString() : 'Active Era'}</span>
              </div>
            </header>
            <section className="mb-20">
              <p className="text-3xl md:text-4xl font-serif italic leading-[1.6] opacity-90">
                {phase.summary ? `"${phase.summary}"` : "This gallery remains open for further contributions."}
              </p>
            </section>
            <div className="flex flex-wrap gap-6 pt-12 border-t border-primary/10">
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