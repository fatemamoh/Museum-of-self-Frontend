import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import * as lifePhaseService from '../services/lifePhaseService';
import * as memoryService from '../services/memoryService';
import LifePhaseForm from '../components/LifePhase/LifePhaseForm';
import MemoryForm from '../components/Memory/MemoryForm';
import MemoryCard from '../components/Memory/MemoryCard';
import { Plus, Lock } from 'lucide-react';

const LifePhaseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [phase, setPhase] = useState(null);
  const [memories, setMemories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showMemoryForm, setShowMemoryForm] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [pin, setPin] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const phases = await lifePhaseService.index();
        setPhase(phases.find(p => p._id === id));
        const memoryData = await memoryService.indexByPhase(id, pin);
        setMemories(memoryData);
      } catch (err) { console.error(err); }
    };
    fetchDetails();
  }, [id, pin]);

  const handleUpdate = (updated) => { setPhase(updated); setIsEditing(false); };

  const handleSaveMemory = async (formData) => {
    try {
      await memoryService.create(formData);
      const memoryData = await memoryService.indexByPhase(id, pin);
      setMemories(memoryData);
      setShowMemoryForm(false);
    } catch (err) { console.error(err); }
  };

  if (!phase) return <div className="min-h-screen bg-museum-cream flex items-center justify-center italic opacity-40">Opening Archive...</div>;

  return (
    <div className="min-h-screen bg-museum-cream p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <nav className="breadcrumb-nav mb-12">
          <Link to="/">Hall</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/lifePhases">Exhibition</Link>
          <span className="breadcrumb-separator">/</span>
          <span>{phase.title}</span>
        </nav>

        {isEditing ? (
          <LifePhaseForm initialData={phase} onUpdate={handleUpdate} />
        ) : (
          <article className="relative">
            <header className="mb-20 border-b-2 border-museum-dark pb-10 flex flex-col md:flex-row justify-between items-end gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[10px] font-black tracking-widest uppercase opacity-40 px-3 py-1 border border-museum-dark/20 rounded-full">Record ID: {phase._id.slice(-6)}</span>
                  {phase.endDate && <span className="text-[10px] font-black tracking-widest uppercase bg-museum-brown text-white px-3 py-1">Archived</span>}
                </div>
                <h1 className="text-6xl md:text-8xl font-serif italic mb-6 leading-tight">{phase.title}</h1>
                <div className="flex gap-12">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase opacity-30 mb-1">Time Period</span>
                        <span className="text-xs font-bold tracking-widest">{new Date(phase.startDate).toLocaleDateString()} — {phase.endDate ? new Date(phase.endDate).toLocaleDateString() : 'Active'}</span>
                    </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setIsEditing(true)} className="btn-museum px-8">Edit Phase</button>
                <button onClick={() => setShowDeletePopup(true)} className="btn-museum px-8 border-crimson/20 text-crimson hover:bg-crimson/5">Erase</button>
              </div>
            </header>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-24">
              <div className="lg:col-span-2 space-y-8">
                <div className="flex items-center gap-4 opacity-20">
                  <div className="h-px flex-1 bg-museum-dark"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Curator's Statement</span>
                </div>
                <p className="text-xl md:text-2xl font-serif italic leading-relaxed opacity-80">{phase.summary || "No archival notes provided for this period."}</p>
              </div>
            </section>

            <section className="mt-32">
              <div className="flex justify-between items-center mb-12 border-b border-museum-dark/10 pb-6">
                <div className="flex items-center gap-8">
                  <h3 className="text-sm font-black uppercase tracking-[0.3em] text-museum-dark/30 italic">Curated Artifacts</h3>
                  <div className="flex items-center gap-2 bg-museum-dark/5 px-4 py-2 border border-museum-dark/10">
                    <Lock size={12} className="opacity-30" />
                    <input 
                      type="password" 
                      placeholder="Enter Vault PIN" 
                      className="bg-transparent text-[10px] outline-none w-24 font-black uppercase tracking-widest"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                    />
                  </div>
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
              <button onClick={() => setShowDeletePopup(false)} className="text-[10px] font-black uppercase opacity-40 py-2">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LifePhaseDetails;