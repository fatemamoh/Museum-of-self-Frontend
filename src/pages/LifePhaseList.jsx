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

  if (loading) return <div className="min-h-screen bg-museum-creameam flex items-center justify-center italic opacity-40">Consulting Catalog...</div>;

  return (
    <main className="min-h-screen bg-museum-cream p-6 md:p-12 relative overflow-hidden">
      <div className="blueprint-grid"></div>
      <div className="max-w-6xl mx-auto relative z-10">
        <nav className="breadcrumb-nav">
            <Link to="/">Dashboard</Link>
            <span className="breadcrumb-separator">/</span>
            <span>All_Archives</span>
        </nav>
        <header className="mb-20 flex flex-col md:flex-row justify-between items-end border-b-2 border-museum-dark pb-8 gap-6">
          <div>
            <span className="text-[9px] uppercase tracking-[0.5em] font-black text-museum-tan">Master Catalog</span>
            <h1 className="text-6xl font-serif italic tracking-tighter text-museum-dark mt-2">Floor Plan</h1>
          </div>
          <Link to="/lifePhases/new" className="btn-museum text-xs py-3! px-6!">New Archive</Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lifePhases.map((phase, index) => (
            <Link to={`/lifePhases/${phase._id}`} key={phase._id} className="group relative z-10">
              <article className="museum-card p-8 h-64 flex flex-col justify-between border border-museum-dark/10 group-hover:scale-[1.02] transition-transform duration-300">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[8px] font-black tracking-widest uppercase opacity-30 group-hover:opacity-100 transition-opacity">
                      Wing G-{lifePhases.length - index}
                    </span>
                    <div className={`h-1.5 w-1.5 rotate-45 ${phase.endDate ? 'bg-museum-brown' : 'bg-crimson animate-pulse'}`}></div>
                  </div>
                  <h3 className="text-3xl font-serif italic group-hover:translate-x-2 transition-transform duration-500 line-clamp-2">
                    {phase.title}
                  </h3>
                </div>
                <div className="pt-6 border-t border-museum-dark/5 flex justify-between items-center">
                  <span className="text-[9px] font-bold tracking-widest uppercase opacity-60 group-hover:text-white">
                    {new Date(phase.startDate).getFullYear()} {phase.endDate ? `— ${new Date(phase.endDate).getFullYear()}` : '— Active'}
                  </span>
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