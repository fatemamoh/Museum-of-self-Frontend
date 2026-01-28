import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Plus, LayoutPanelLeft, Archive, Microscope } from 'lucide-react';
import * as lifePhaseService from '../services/lifePhaseService';

const LifePhaseList = () => {
    const [lifePhases, setLifePhases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); 

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

    const filteredPhases = lifePhases.filter(phase => {
        if (filter === 'active') return !phase.endDate;
        if (filter === 'archived') return !!phase.endDate;
        return true;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-museum-cream flex items-center justify-center italic opacity-40">
                Consulting Catalog...
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-museum-cream p-6 md:p-12 relative overflow-hidden">
            <div className="blueprint-grid"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <nav className="breadcrumb-nav" aria-label="Breadcrumb">
                    <Link to="/">Hall</Link>
                    <span className="breadcrumb-separator mx-2">/</span>
                    <span>All Exhibition Wings</span>
                </nav>

                <header className="mb-12 flex flex-col md:flex-row justify-between items-end border-b-2 border-museum-dark pb-8 gap-6">
                    <div>
                        <span className="text-[9px] uppercase tracking-[0.5em] font-black text-museum-tan">Master Catalog</span>
                        <h1 className="text-6xl font-serif italic tracking-tighter text-museum-dark mt-2"> Exhibition </h1>
                    </div>
                    
                    <div className="flex flex-col items-end gap-4 w-full md:w-auto">
                        <div className="flex bg-museum-dark/5 p-1 rounded-sm border border-museum-dark/10">
                            {[
                                { id: 'all', label: 'All', icon: LayoutPanelLeft },
                                { id: 'active', label: 'Active', icon: Microscope },
                                { id: 'archived', label: 'Archived', icon: Archive }
                            ].map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setFilter(t.id)}
                                    className={`flex items-center gap-2 px-4 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all ${
                                        filter === t.id 
                                        ? 'bg-museum-dark text-museum-cream' 
                                        : 'text-museum-dark opacity-40 hover:opacity-100'
                                    }`}
                                >
                                    <t.icon size={10} />
                                    {t.label}
                                </button>
                            ))}
                        </div>
                        <Link to="/lifePhases/new" className="btn-museum text-xs py-3 px-8 w-full md:w-auto text-center">
                            New Exhibition Wing
                        </Link>
                    </div>
                </header>

                {lifePhases.length === 0 ? (
                    <div className="mt-20 flex flex-col items-center justify-center text-center animate-hero">
                        <div className="relative mb-8">
                            <div className="w-32 h-32 border-2 border-dashed border-museum-dark/20 rounded-full flex items-center justify-center">
                                <LayoutPanelLeft size={48} className="text-museum-dark/20" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-museum-cream p-2">
                                <Plus size={24} className="text-museum-brown" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-serif italic text-museum-dark mb-4">The Drafting Table is Clear</h2>
                        <p className="max-w-md text-sm opacity-60 leading-relaxed mb-8 font-serif">
                            Every great museum begins with a single architectural sketch. 
                            The floors are polished, and the wings are waiting for your history.
                        </p>
                        <Link to="/lifePhases/new" className="btn-stamp px-10 py-4 text-[10px]">
                            Initialize First Wing
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPhases.map((phase, index) => (
                            <Link 
                                to={`/lifePhases/${phase._id}`} 
                                key={phase._id} 
                                className="group relative z-10 block"
                            >
                                <article className="museum-card p-8 h-64 flex flex-col justify-between border border-museum-dark/10 group-hover:scale-[1.02] transition-transform duration-300">
                                    <div>
                                        <div className="flex justify-between items-center mb-6">
                                            <span className="text-[8px] font-black tracking-widest uppercase opacity-30 group-hover:opacity-100 transition-opacity">
                                                Wing G-{lifePhases.length - index}
                                            </span>
                                            <div 
                                                className={`h-1.5 w-1.5 rotate-45 ${phase.endDate ? 'bg-museum-brown' : 'bg-red-700 animate-pulse'}`}
                                            ></div>
                                        </div>
                                        <h3 className="text-3xl font-serif italic group-hover:translate-x-2 transition-transform duration-500 line-clamp-2">
                                            {phase.title}
                                        </h3>
                                    </div>
                                    <div className="pt-6 border-t border-museum-dark/5 flex justify-between items-center">
                                        <span className="text-[9px] font-bold tracking-widest uppercase opacity-60 group-hover:text-white">
                                            {new Date(phase.startDate).getFullYear()} {phase.endDate ? `— ${new Date(phase.endDate).getFullYear()}` : '— Active'}
                                        </span>
                                        <span className="text-[7px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                                            Enter Wing
                                        </span>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
                
                {lifePhases.length > 0 && filteredPhases.length === 0 && (
                    <div className="text-center py-20 opacity-40 italic font-serif">
                        No {filter} exhibitions found in the catalog.
                    </div>
                )}
            </div>
        </main>
    );
};

export default LifePhaseList;