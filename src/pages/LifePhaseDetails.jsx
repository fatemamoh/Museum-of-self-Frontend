import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import * as lifePhaseService from '../services/lifePhaseService';
import LifePhaseForm from '../components/LifePhase/LifePhaseForm';

const LifePhaseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [phase, setPhase] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  useEffect(() => {
    const fetchPhase = async () => {
      try {
        const data = await lifePhaseService.index();
        setPhase(data.find(p => p._id === id));
      } catch (err) { console.error(err); }
    };
    fetchPhase();
  }, [id]);

  const handleUpdate = (updated) => {
    setPhase(updated);
    setIsEditing(false);
  };

  if (!phase) return <div className="min-h-screen bg-[#F5F0E1] flex items-center justify-center italic opacity-40">Consulting Catalog...</div>;

  return (
    <main className="min-h-screen bg-[#F5F0E1] relative py-12 px-6 md:px-24 overflow-hidden">
      <div className="blueprint-grid"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <nav className="mb-12 flex items-center justify-between animate-hero">
            <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] opacity-40">
                <Link to="/" className="hover:text-[#4B3D2A] transition-colors">Dashboard</Link>
                <span>/</span>
                <Link to="/lifePhases" className="hover:text-[#4B3D2A] transition-colors">Floor Plan</Link>
                <span>/</span>
                <span className="text-[#4B3D2A]">{phase.title}</span>
            </div>
            
            <button 
                onClick={() => navigate('/lifePhases')} 
                className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.4em] text-[#4B3D2A] group"
            >
                <span className="group-hover:-translate-x-2 transition-transform duration-300">←</span> 
                Return to Index
            </button>
        </nav>

        {isEditing ? (
          <LifePhaseForm initialData={phase} onUpdate={handleUpdate} />
        ) : (
          <article className="animate-hero">
            <header className="mb-16 border-b-4 border-[#4B3D2A] pb-10">
                <div className="flex justify-between items-start mb-6">
                    <span className="text-[9px] font-black tracking-[0.5em] uppercase text-[#A68A6B]">Wing Display No. {phase._id.slice(-4)}</span>
                    {!phase.endDate && <span className="bg-[#8a3a3c] text-white text-[8px] font-black px-4 py-1 uppercase tracking-widest">Active Exhibition</span>}
                </div>
                <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter leading-none">{phase.title}</h1>
                <div className="mt-12 flex flex-wrap gap-10 text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">
                    <div className="flex flex-col gap-2">
                        <span className="opacity-40">Opening Date</span>
                        <span>{new Date(phase.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="opacity-40">Status</span>
                        <span>{phase.endDate ? `Closed ${new Date(phase.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}` : 'In Perpetuity'}</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-2">
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] mb-10 opacity-30">Curator Summary</h2>
                <div className="text-xl md:text-2xl font-serif italic text-[#4B3D2A] leading-relaxed border-l-4 border-[#D9C6A0] pl-10 py-2">
                  {phase.summary || "This record contains no narrative summary."}
                </div>
              </div>

              <aside>
                <div className="p-8 bg-[#D9C6A0] border border-[#4B3D2A]/10 space-y-6 shadow-xl">
                    <h3 className="text-[9px] font-black uppercase tracking-widest opacity-40 border-b border-[#4B3D2A]/10 pb-4">Administrative Controls</h3>
                    <button onClick={() => setIsEditing(true)} className="btn-museum w-full text-center">Renovate Wing</button>
                    <button onClick={() => setShowDeletePopup(true)} className="w-full text-[9px] font-black uppercase tracking-widest text-[#8a3a3c] hover:underline transition-all">Decommission Era</button>
                </div>
              </aside>
            </div>
          </article>
        )}
      </div>

      {showDeletePopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#141013]/95 backdrop-blur-sm p-6">
          <div className="bg-[#F5F0E1] border-2 border-[#4B3D2A] p-10 max-w-lg w-full text-center">
            <h2 className="text-[#8a3a3c] font-serif italic text-4xl mb-4">Confirm Erasure</h2>
            <p className="mb-10 text-[10px] uppercase tracking-widest font-bold opacity-60 leading-relaxed">This action will permanently remove the era from the museum's catalog.</p>
            <div className="flex flex-col gap-4">
              <button onClick={() => lifePhaseService.deleteLifePhase(id).then(() => navigate('/lifePhases'))} className="btn-museum bg-[#8a3a3c] hover:bg-black">Decommission Wing</button>
              <button onClick={() => setShowDeletePopup(false)} className="text-[9px] font-black uppercase tracking-widest opacity-40 cursor-pointer">Abort Protocol</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default LifePhaseDetails;