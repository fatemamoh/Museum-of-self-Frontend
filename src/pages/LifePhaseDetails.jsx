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

  if (!phase) return <div className="min-h-screen bg-museum-cream flex items-center justify-center italic opacity-40">Consulting Catalog...</div>;

  return (
    <main className="min-h-screen bg-museum-cream py-12 px-6 relative overflow-hidden">
      <div className="blueprint-grid"></div>
      <div className="max-w-5xl mx-auto relative z-10">
        <nav className="breadcrumb-nav">
            <Link to="/">Dashboard</Link>
            <span className="breadcrumb-separator">/</span>
            <Link to="/lifePhases">Archives</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="text-crimson">{phase.title}</span>
        </nav>

        {isEditing ? (
          <LifePhaseForm initialData={phase} onUpdate={handleUpdate} />
        ) : (
          <article className="animate-hero">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t-2 border-museum-dark pt-12">
              <div className="lg:col-span-8">
                <div className="flex items-center gap-4 mb-6">
                   <span className="text-[9px] font-black tracking-widest uppercase opacity-30">Exhibit #{phase._id.slice(-4)}</span>
                   {!phase.endDate && <span className="h-2 w-2 rounded-full bg-crimson animate-pulse"></span>}
                </div>
                <h1 className="text-5xl md:text-7xl font-serif italic mb-10 leading-tight text-museum-dark">{phase.title}</h1>
                <div className="text-lg md:text-xl font-serif italic text-museum-dark/80 leading-relaxed border-l-2 border-museum-beige pl-8">
                  {phase.summary || "Archival summary pending documentation..."}
                </div>
              </div>
              <div className="lg:col-span-4 space-y-8">
                <div className="p-6 bg-museum-beige/30 border border-museum-dark/10 relative overflow-hidden dusty-glass">
                    <h3 className="text-[8px] font-black uppercase tracking-widest mb-4 opacity-40">Chronology</h3>
                    <div className="space-y-4 text-[10px] font-bold uppercase relative z-10">
                        <div>
                            <p className="opacity-40 mb-1">Inauguration</p>
                            <p className="text-museum-dark">{new Date(phase.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</p>
                        </div>
                        <div>
                            <p className="opacity-40 mb-1">Conclusion</p>
                            <p className="text-museum-dark">{phase.endDate ? new Date(phase.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long' }) : 'Ongoing'}</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-3 relative z-50">
                    <button onClick={() => setIsEditing(true)} className="btn-museum text-[10px] py-3">Modify Record</button>
                    <button onClick={() => setShowDeletePopup(true)} className="text-[8px] font-black uppercase tracking-widest text-crimson text-center mt-2 cursor-pointer">Decommission Wing</button>
                </div>
              </div>
            </div>
          </article>
        )}
      </div>

      {showDeletePopup && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-[#141013]/90 backdrop-blur-sm p-4">
          <div className="bg-museum-cream border border-museum-dark p-10 max-w-sm w-full text-center relative">
            <h2 className="text-crimson font-serif italic text-2xl mb-4">Confirm Erasure</h2>
            <p className="mb-8 text-[9px] uppercase tracking-widest font-bold opacity-60 text-museum-dark">Permanent purging from catalog.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => lifePhaseService.deleteLifePhase(id).then(() => navigate('/lifePhases'))} className="btn-museum border-crimson! text-crimson! hover:bg-crimson! hover:text-white!">Confirm Delete</button>
              <button onClick={() => setShowDeletePopup(false)} className="text-[8px] font-black uppercase tracking-widest opacity-40 cursor-pointer">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default LifePhaseDetails;