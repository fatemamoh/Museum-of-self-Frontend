import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import * as lifePhaseService from '../services/lifePhaseService';
import * as memoryService from '../services/memoryService';
import LifePhaseForm from '../components/LifePhase/LifePhaseForm';
import MemoryForm from '../components/Memory/MemoryForm';
import MemoryCard from '../components/Memory/MemoryCard';
import { Plus } from 'lucide-react';

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
      const newMemory = await memoryService.create(formData);
      setMemories([newMemory, ...memories]);
      setShowMemoryForm(false);
    } catch (err) { console.error(err); }
  };

  if (!phase) return <div className="min-h-screen bg-museum-cream flex items-center justify-center italic opacity-40">Consulting Catalog...</div>;

  return (
    <main className="min-h-screen bg-museum-cream py-12 px-6 relative overflow-hidden">
      <div className="blueprint-grid opacity-20"></div>
      <div className="max-w-6xl mx-auto relative z-10">
        <nav className="breadcrumb-nav mb-12">
          <Link to="/">Dashboard</Link> / <Link to="/lifePhases">Archives</Link> / <span className="text-crimson">{phase.title}</span>
        </nav>

        {isEditing ? (
          <LifePhaseForm initialData={phase} onUpdate={handleUpdate} />
        ) : (
          <article className="animate-hero">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t-2 border-museum-dark pt-12 mb-20">
              <div className="lg:col-span-8">
                <span className="text-[9px] font-black uppercase opacity-30">Exhibit #{phase._id.slice(-4)}</span>
                <h1 className="text-5xl md:text-7xl font-serif italic mb-10 text-museum-dark">{phase.title}</h1>
                <p className="text-lg md:text-xl font-serif italic text-museum-dark/80 border-l-2 border-museum-beige pl-8">{phase.summary}</p>
              </div>
              <div className="lg:col-span-4 space-y-8">
                <div className="p-6 bg-museum-beige/30 border border-museum-dark/10 dusty-glass">
                  <h3 className="text-[8px] font-black uppercase tracking-widest mb-4 opacity-40">Chronology</h3>
                  <div className="text-[10px] font-bold uppercase space-y-4">
                    <div><p className="opacity-40">Inauguration</p><p>{new Date(phase.startDate).toLocaleDateString()}</p></div>
                    <div><p className="opacity-40">Conclusion</p><p>{phase.endDate ? new Date(phase.endDate).toLocaleDateString() : 'Ongoing'}</p></div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <button onClick={() => setIsEditing(true)} className="btn-museum text-[10px] py-3">Modify Record</button>
                  <button onClick={() => setShowDeletePopup(true)} className="text-[8px] font-black uppercase text-crimson text-center">Decommission Wing</button>
                </div>
              </div>
            </div>

            <section className="mt-24 border-t border-museum-dark/10 pt-16">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h2 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-2">Inventory</h2>
                  <h3 className="text-4xl font-serif italic">Curated Artifacts</h3>
                </div>
                {!showMemoryForm && <button onClick={() => setShowMemoryForm(true)} className="btn-stamp flex items-center gap-2 px-6 text-[9px]"><Plus size={14}/> Curate Artifact</button>}
              </div>
              {showMemoryForm && <MemoryForm phaseId={id} onSave={handleSaveMemory} onCancel={() => setShowMemoryForm(false)} />}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {memories.map((m) => <MemoryCard key={m._id} memory={m} />)}
              </div>
            </section>
          </article>
        )}
      </div>

      {showDeletePopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#141013]/90 backdrop-blur-sm p-4">
          <div className="bg-museum-cream border border-museum-dark p-10 max-w-sm w-full text-center">
            <h2 className="text-crimson font-serif italic text-2xl mb-4">Confirm Erasure</h2>
            <div className="flex flex-col gap-3">
              <button onClick={() => lifePhaseService.deleteLifePhase(id).then(() => navigate('/lifePhases'))} className="btn-museum border-crimson! text-crimson!">Confirm Delete</button>
              <button onClick={() => setShowDeletePopup(false)} className="text-[8px] font-black uppercase opacity-40">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default LifePhaseDetails;