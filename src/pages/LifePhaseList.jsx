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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPhases();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center italic opacity-50">Consulting Archives...</div>;

  return (
    <main className="p-10 md:p-20 max-w-7xl mx-auto">
      <header className="mb-24 flex justify-between items-end border-b border-primary/10 pb-10">
        <div>
          <h1 className="text-7xl font-serif italic">Floor Plan</h1>
          <p className="text-[10px] uppercase tracking-[0.5em] font-black opacity-40 mt-4">Curated Chronology</p>
        </div>
        <Link to="/lifePhases/new" className="btn btn-primary rounded-none px-12 uppercase tracking-widest text-xs">New Wing</Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {lifePhases.map((phase, index) => (
          <Link to={`/lifePhases/${phase._id}`} key={phase._id} className="group relative">
            <div className="absolute -inset-4 bg-primary/5 scale-95 group-hover:scale-100 transition-all duration-700 opacity-0 group-hover:opacity-100 border border-primary/10"></div>
            <article data-theme={phase.theme} className="relative z-10 bg-base-100 p-12 border border-primary/5 shadow-2xl transition-museum">
              <div className="flex justify-between items-center mb-10">
                <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-30">
                  Wing {String(lifePhases.length - index).padStart(2, '0')}
                </span>
                <div className="h-px w-20 bg-primary/20"></div>
              </div>
              <h3 className="text-4xl font-serif italic mb-6 group-hover:translate-x-3 transition-transform duration-500">
                {phase.title}
              </h3>
              <p className="text-sm italic opacity-60 leading-relaxed line-clamp-2 mb-10">
                {phase.summary || "This exhibition wing is currently being prepared for display..."}
              </p>
              <div className="flex justify-between items-center pt-8 border-t border-primary/5">
                <span className="text-[10px] font-bold tracking-widest opacity-40">
                  {new Date(phase.startDate).getFullYear()} — {phase.endDate ? new Date(phase.endDate).getFullYear() : 'Active'}
                </span>
                <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em] group-hover:mr-2 transition-all">Enter Room</span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default LifePhaseList;