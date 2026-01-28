import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Plus, LayoutPanelLeft, Archive, Microscope, Map as MapIcon, Search, ArrowUpDown } from 'lucide-react';
import * as lifePhaseService from '../services/lifePhaseService';

const LifePhaseList = () => {
    const [lifePhases, setLifePhases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); 
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('desc'); 

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

    const filteredAndSortedPhases = lifePhases
        .filter(phase => {
            const matchesFilter = filter === 'all' 
                || (filter === 'active' && !phase.endDate) 
                || (filter === 'archived' && !!phase.endDate);
            
            const matchesSearch = phase.title.toLowerCase().includes(searchQuery.toLowerCase());
            
            return matchesFilter && matchesSearch;
        })
        .sort((a, b) => {
            const dateA = new Date(a.startDate);
            const dateB = new Date(b.startDate);
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });

    if (loading) {
        return (
            <div className="min-h-screen bg-museum-cream flex items-center justify-center italic opacity-40 font-serif tracking-widest">
                Consulting Catalog...
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-museum-cream p-6 md:p-12 relative overflow-hidden selection:bg-crimson selection:text-white">
            <div className="blueprint-grid fixed inset-0 opacity-20 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <nav className="mb-8 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] opacity-40" aria-label="Breadcrumb">
                    <Link to="/" className="hover:text-crimson transition-colors">Hall</Link>
                    <span>/</span>
                    <span className="text-museum-dark">All Exhibition Wings</span>
                </nav>

                <header className="mb-16 border-b border-museum-dark/10 pb-12">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
                        <div className="text-left">
                            <span className="text-[10px] uppercase tracking-[0.6em] font-black text-crimson mb-2 block">Master Catalog</span>
                            <h1 className="text-6xl md:text-7xl font-serif italic tracking-tighter text-museum-dark leading-none"> Exhibition </h1>
                        </div>

                        <div className="flex flex-col gap-6 w-full lg:w-3/5 items-end">
                            <div className="flex flex-col md:flex-row gap-4 w-full justify-end items-center">
                                <div className="relative w-full md:flex-grow group">
                                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:text-crimson transition-all" />
                                    <input 
                                        type="text"
                                        placeholder="SEARCH REFERENCE..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-white/40 border border-museum-dark/10 rounded-sm py-3 pl-12 pr-4 text-[10px] font-black uppercase tracking-[0.2em] focus:outline-none focus:border-crimson focus:bg-white transition-all"
                                    />
                                </div>
                                
                                <button 
                                    onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                                    className="flex items-center gap-3 px-6 py-3 border border-museum-dark/10 bg-white/40 rounded-sm text-[9px] font-black uppercase tracking-widest hover:border-crimson transition-all"
                                    title={sortOrder === 'desc' ? "Showing Newest First" : "Showing Oldest First"}
                                >
                                    <ArrowUpDown size={12} className={sortOrder === 'asc' ? 'rotate-180 transition-transform' : 'transition-transform'} />
                                    {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
                                </button>
                            </div>

                            <div className="flex flex-col md:flex-row items-end gap-6 w-full justify-end">
                                <div className="flex bg-white/50 backdrop-blur-sm p-1 rounded-full border border-museum-dark/10 shadow-inner">
                                    {[
                                        { id: 'all', label: 'All', icon: LayoutPanelLeft },
                                        { id: 'active', label: 'Active', icon: Microscope },
                                        { id: 'archived', label: 'Archived', icon: Archive }
                                    ].map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => { setFilter(t.id); setSearchQuery(''); }}
                                            className={`flex items-center gap-2 px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-500 ${
                                                filter === t.id 
                                                ? 'bg-museum-dark text-museum-cream shadow-md' 
                                                : 'text-museum-dark opacity-40 hover:opacity-100'
                                            }`}
                                        >
                                            <t.icon size={12} />
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                                <Link to="/lifePhases/new" className="group flex items-center gap-4 bg-museum-dark text-museum-cream px-8 py-4 rounded-sm text-[10px] font-black uppercase tracking-[0.3em] hover:bg-crimson transition-all duration-500 shadow-xl whitespace-nowrap">
                                    <Plus size={14} />
                                    New Wing
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                {filteredAndSortedPhases.length === 0 ? (
                    <div className="mt-20 flex flex-col items-center justify-center text-center py-24 border border-dashed border-museum-dark/10">
                        <h2 className="text-3xl font-serif italic text-museum-dark mb-4 opacity-40">No matching records found</h2>
                        <button onClick={() => {setSearchQuery(''); setFilter('all');}} className="text-[9px] font-black uppercase tracking-widest text-crimson hover:underline">
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-museum-dark/10 shadow-2xl">
                        {filteredAndSortedPhases.map((phase) => (
                            <Link 
                                to={`/lifePhases/${phase._id}`} 
                                key={phase._id} 
                                className="group relative p-12 overflow-hidden transition-all duration-700 border-[0.5px] border-museum-dark/5 bg-[#f9f5eb] hover:bg-museum-dark"
                            >
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] group-hover:invert transition-all"></div>
                                
                                <div className="flex justify-between items-start mb-12 relative z-10">
                                    <span className="text-[10px] font-mono font-bold opacity-30 group-hover:text-crimson transition-colors tracking-tighter uppercase">
                                        REF_{phase._id.substring(0, 4)}
                                    </span>
                                    <div className={`h-2 w-2 rounded-full ${phase.endDate ? 'bg-museum-brown/40' : 'bg-crimson animate-pulse shadow-[0_0_10px_rgba(153,27,27,0.5)]'}`}></div>
                                </div>

                                <div className="relative z-10 mb-12">
                                    <h3 className="text-3xl font-serif italic text-museum-dark group-hover:text-museum-cream transition-colors leading-tight group-hover:translate-x-2 duration-700">
                                        {phase.title}
                                    </h3>
                                </div>

                                <div className="relative z-10 pt-6 border-t border-museum-dark/10 group-hover:border-white/10 flex justify-between items-center">
                                    <span className="text-[9px] font-black tracking-[0.2em] uppercase opacity-40 group-hover:text-white transition-opacity">
                                        {new Date(phase.startDate).getFullYear()} {phase.endDate ? `— ${new Date(phase.endDate).getFullYear()}` : '— Present'}
                                    </span>
                                    <span className="text-[8px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 text-crimson transition-all translate-x-4 group-hover:translate-x-0">
                                        Enter Wing
                                    </span>
                                </div>

                                <MapIcon size={120} className="absolute -bottom-8 -right-8 opacity-[0.04] group-hover:opacity-10 group-hover:text-white transition-all -rotate-12 group-hover:rotate-0" />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default LifePhaseList;