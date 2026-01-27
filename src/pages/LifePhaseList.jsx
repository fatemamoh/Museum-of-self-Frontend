import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import * as lifePhaseService from '../services/lifePhaseService';

const LifePhaseList = () => {
  const [lifePhases, setLifePhases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhases = async () => {
      try {
        const data = await lifePhaseService.index();
        setLifePhases(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchPhases();
  }, []);

  if (loading) return <div className="min-h-screen bg-[#F5F0E1] flex items-center justify-center font-serif italic text-[#4B3D2A] opacity-40">Consulting Catalog...</div>;

  return (
    <main className="min-h-screen bg-[#F5F0E1] p-10 md:p-24 relative overflow-hidden">
      <div className="blueprint-grid"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-24 flex flex-col md:flex-row justify-between items-end border-b-2 border-[#4B3D2A] pb-10 gap-8">
          <div>
            <h1 className="text-7xl md:text-8xl font-serif italic tracking-tighter text-[#4B3D2A]">Floor Plan</h1>
            <p className="text-[10px] uppercase tracking-[0.5em] font-black text-[#A68A6B] mt-4">The Complete Directory</p>
          </div>
          <Link to="/lifePhases/new" className="btn-museum">Add New Gallery</Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {lifePhases.map((phase, index) => (
            <Link to={`/lifePhases/${phase._id}`} key={phase._id} className="group">
              <article className="museum-card p-12 h-full flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-10">
                    <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-50 group-hover:text-[#F5F0E1]/50">
                      G-0{lifePhases.length - index}
                    </span>
                    <div className={`h-2 w-2 rotate-45 ${phase.endDate ? 'bg-[#7A5B3A]' : 'bg-[#8a3a3c] animate-pulse'}`}></div>
                  </div>
                  <h3 className="text-5xl font-serif italic mb-6 group-hover:translate-x-3 transition-transform duration-500">
                    {phase.title}
                  </h3>
                  <p className="text-sm italic opacity-70 group-hover:text-[#F5F0E1]/80 line-clamp-3">
                    {phase.summary || "Archival summary pending documentation..."}
                  </p>
                </div>
                <div className="mt-12 pt-8 border-t border-[#4B3D2A]/10 group-hover:border-white/10 flex justify-between items-center">
                  <span className="text-[10px] font-bold tracking-widest uppercase">
                    {new Date(phase.startDate).getFullYear()} — {phase.endDate ? new Date(phase.endDate).getFullYear() : 'ACTIVE'}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">Enter Gallery →</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default LifePhaseList;