import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import * as lifePhaseService from '../services/lifePhaseService';
import * as memoryService from '../services/memoryService';
import LifePhaseForm from '../components/LifePhase/LifePhaseForm';
import MemoryForm from '../components/Memory/MemoryForm';
import MemoryCard from '../components/Memory/MemoryCard';
import { Plus, ArrowLeft, Trash2, Edit3, Archive, Layers, ScanLine } from 'lucide-react';

const LifePhaseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [phase, setPhase] = useState(null);
  const [memories, setMemories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showMemoryForm, setShowMemoryForm] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const phases = await lifePhaseService.index();
        setPhase(phases.find(p => p._id === id));
        const memoryData = await memoryService.indexByPhase(id);
        setMemories(memoryData);
      } catch (err) { console.error(err); }
    };
    fetchDetails();
  }, [id]);

  const handleUpdate = (updated) => { setPhase(updated); setIsEditing(false); };

  const handleSaveMemory = async (formData) => {
    try {
      await memoryService.create(formData);
      const memoryData = await memoryService.indexByPhase(id);
      setMemories(memoryData);
      setShowMemoryForm(false);
    } catch (err) { console.error(err); }
  };

  if (!phase) return <div className="min-h-screen bg-museum-cream flex items-center justify-center italic opacity-40 font-serif">Consulting Archives...</div>;

  return (
    <div className="min-h-screen bg-museum-cream p-6 md:p-12 selection:bg-museum-brown selection:text-white relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-[70vh] pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5e3c10_1px,transparent_1px),linear-gradient(to_bottom,#8b5e3c10_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-museum-brown/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-[10%] -right-[5%] w-[30%] h-[50%] bg-museum-tan/10 rounded-full blur-[100px] animate-float"></div>
        
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-museum-brown/20 to-transparent animate-scan"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <nav className="flex items-center justify-between mb-16 border-b border-museum-dark/5 pb-8">
            <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
                <Link to="/lifePhases" className="hover:text-museum-brown flex items-center gap-2 transition-transform hover:-translate-x-1">
                    <ArrowLeft size={14} /> Return to Hall
                </Link>
                <div className="w-[1px] h-4 bg-museum-dark/10"></div>
                <span className="text-museum-brown flex items-center gap-2">
                    <ScanLine size={12} className="opacity-50" /> Wing G-{phase._id.slice(-4)}
                </span>
            </div>
            <div className="flex gap-8">
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 hover:text-museum-brown transition-all">
                    <Edit3 size={14} /> Edit Exhibition
                </button>
                <button onClick={() => setShowDeletePopup(true)} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-red-800/20 hover:text-red-800 transition-all">
                    <Trash2 size={14} /> Delete 
                </button>
            </div>
        </nav>

        {isEditing ? (
          <LifePhaseForm initialData={phase} onUpdate={handleUpdate} />
        ) : (
          <article className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-32">
                
                <div className="lg:col-span-3 space-y-6 pt-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-museum-brown animate-ping"></div>
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-museum-brown">Verified Exhibition</span>
                    </div>
                    <div className="border-l-2 border-museum-dark/10 pl-4 py-2">
                        <span className="text-[8px] font-black uppercase tracking-widest opacity-30 block mb-1">Timeframe</span>
                        <span className="text-xs font-mono font-bold tracking-widest">
                            {new Date(phase.startDate).getFullYear()} — {phase.endDate ? new Date(phase.endDate).getFullYear() : 'EXPANDING'}
                        </span>
                    </div>
                </div>

                <div className="lg:col-span-9 relative">
                    <header className="relative">
                        <div className="absolute -left-12 top-0 bottom-0 w-[1px] bg-gradient-to-b from-museum-brown/40 via-transparent to-transparent hidden lg:block"></div>
                        
                        <h1 className="text-5xl md:text-7xl font-serif italic mb-8 leading-[1.1] tracking-tight text-museum-dark drop-shadow-sm animate-hero">
                            {phase.title}
                        </h1>

                        <div className="flex items-center gap-4 mb-12">
                            <div className="h-[1px] w-12 bg-museum-brown"></div>
                            <span className={`text-[8px] font-black uppercase tracking-[0.5em] ${phase.endDate ? 'text-museum-dark' : 'text-museum-tan'}`}>
                                {phase.endDate ? 'Closed Exhibition' : 'Ongoing Installation'}
                            </span>
                        </div>
                    </header>

                    <div className="max-w-2xl">
                        <p className="text-lg md:text-2xl font-serif italic leading-relaxed text-museum-dark/70 first-letter:text-4xl first-letter:font-bold first-letter:text-museum-brown">
                            {phase.summary || ''}
                        </p>
                    </div>
                </div>
            </div>

            <section className="mt-40 border-t border-museum-dark/5 pt-20">
              <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                <div>
                    <h3 className="text-2xl font-serif italic mb-2">The Memory Gallery</h3>
                    <p className="text-[9px] uppercase font-black tracking-[0.3em] opacity-30">Artifacts from this era</p>
                </div>

                {!showMemoryForm && (
                  <button onClick={() => setShowMemoryForm(true)} className="btn-stamp px-8 py-4 text-[9px] tracking-[0.3em] bg-museum-dark text-white hover:bg-museum-brown transition-all shadow-lg hover:shadow-museum-brown/20">
                      <Plus size={14} className="inline mr-2"/> NEW ENTRY
                  </button>
                )}
              </div>

              {showMemoryForm && (
                <div className="mb-24 animate-hero">
                    <MemoryForm phaseId={id} onSave={handleSaveMemory} onCancel={() => setShowMemoryForm(false)} />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {memories.length > 0 ? (
                    memories.map((m) => <MemoryCard key={m._id} memory={m} />)
                ) : (
                    <div className="col-span-full py-24 border border-dashed border-museum-dark/10 flex flex-col items-center justify-center opacity-20">
                        <Archive size={32} className="mb-4" />
                        <span className="font-serif italic text-lg tracking-widest uppercase text-xs">Awaiting curation...</span>
                    </div>
                )}
              </div>
            </section>
          </article>
        )}
      </div>

      {showDeletePopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-museum-dark/95 backdrop-blur-sm p-4">
          <div className="bg-museum-cream border border-museum-dark/20 p-12 max-w-sm w-full text-center shadow-2xl">
            <h2 className="text-red-900 font-serif italic text-2xl mb-4">Decommission Wing?</h2>
            <p className="text-[10px] uppercase font-black tracking-widest opacity-40 mb-10 leading-relaxed">
                Permanent deletion of this era and its artifacts.
            </p>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => lifePhaseService.deleteLifePhase(id).then(() => navigate('/lifePhases'))} 
                className="bg-red-900 text-white font-black uppercase text-[10px] tracking-[0.4em] py-4"
              >
                Confirm Total Erasure
              </button>
              <button onClick={() => setShowDeletePopup(false)} className="text-[10px] font-black uppercase opacity-40 py-2">
                Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LifePhaseDetails;