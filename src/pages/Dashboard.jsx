import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router';
import { UserContext } from '../contexts/UserContext';
import * as lifePhaseService from '../services/lifePhaseService';
import * as memoryService from '../services/memoryService';
import { Library, Landmark, PenTool, ArrowRight, Fingerprint, Map as MapIcon, Image as ImageIcon, Calendar, Tag, Activity } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(UserContext);
    const [lifePhases, setLifePhases] = useState([]);
    const [allMemories, setAllMemories] = useState([]);
    const [recentMemories, setRecentMemories] = useState([]);
    const [heroIndex, setHeroIndex] = useState(0);

    const slogans = [
        { main: "The Architecture of Self", sub: "CURATING THE DEFINITIVE TIMELINE" },
        { main: "Every Era a Gallery", sub: "PRESERVING THE TRANSITIONS OF LIFE" }
    ];

    useEffect(() => {
        const timer = setInterval(() => setHeroIndex((p) => (p + 1) % slogans.length), 6000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const phasesData = await lifePhaseService.index();
                setLifePhases(phasesData);
                
                const memoriesData = await memoryService.index();
                setAllMemories(memoriesData);
                
                const imageMemories = memoriesData
                    .filter(m => m.type === 'Image')
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 4);
                
                setRecentMemories(imageMemories);
            } catch (err) { 
                console.error("Dashboard Data Error:", err); 
            }
        };
        if (user) fetchDashboardData();
    }, [user]);

    const active = lifePhases.find(p => !p.endDate);
    
    // Calculate the most recent activity date
    const lastUpdate = allMemories.length > 0 
        ? new Date(Math.max(...allMemories.map(m => new Date(m.createdAt))))
        : null;

    return (
        <main className="min-h-screen relative bg-museum-cream pb-20 selection:bg-crimson selection:text-white overflow-x-hidden">
            <div className="blueprint-grid fixed inset-0 opacity-20 pointer-events-none"></div>

            {/* HERO SECTION WITH COUNTERS */}
            <section className="h-[65vh] spotlight flex items-center justify-center px-6 relative overflow-hidden border-b border-museum-dark/10 bg-museum-beige/20">
                <div key={heroIndex} className="text-center animate-hero z-10 flex flex-col items-center">
                    
                    <div className="flex items-center gap-6 mb-10">
                        <div className="flex flex-col items-end">
                            <span className="text-[7px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Total Assets</span>
                            <span className="text-sm font-mono font-bold text-crimson">{allMemories.length.toString().padStart(2, '0')}</span>
                        </div>
                        
                        <div className="w-[1px] h-10 bg-museum-dark/10"></div>
                        
                        <div className="p-4 rounded-full bg-museum-cream/80 border border-museum-dark/5 shadow-sm">
                            <Fingerprint size={32} className="text-museum-dark opacity-80" />
                        </div>
                        
                        <div className="w-[1px] h-10 bg-museum-dark/10"></div>
                        
                        <div className="flex flex-col items-start">
                            <span className="text-[7px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Active Wings</span>
                            <span className="text-sm font-mono font-bold text-museum-dark">{lifePhases.length.toString().padStart(2, '0')}</span>
                        </div>
                    </div>

                    <span className="text-[8px] uppercase tracking-[0.8em] font-black opacity-60 mb-4 block text-museum-dark">Archive of {user?.username}</span>
                    <h1 className="text-4xl md:text-5xl font-serif italic mb-6 text-museum-dark tracking-tight">{slogans[heroIndex].main}</h1>
                    
                    {lastUpdate && (
                        <div className="flex items-center gap-2 opacity-40 mb-8">
                            <Activity size={10} className="text-crimson" />
                            <span className="text-[7px] font-black uppercase tracking-[0.2em]">
                                Last Curated: {lastUpdate.toLocaleDateString()}
                            </span>
                        </div>
                    )}

                    <div className="h-[1px] w-16 bg-museum-dark/20 mb-6"></div>
                    <p className="text-[9px] uppercase tracking-[0.4em] font-bold opacity-70 text-museum-brown">{slogans[heroIndex].sub}</p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 relative z-10">
                
                {/* RECENT ACQUISITIONS */}
                <section className="mb-24">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-[9px] uppercase tracking-[0.5em] font-black opacity-40">Recent Acquisitions</h3>
                        <div className="h-[1px] flex-grow mx-8 bg-museum-dark/5"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {recentMemories.map((mem) => (
                            <Link key={mem._id} to={`/memories/${mem._id}`} className="group relative bg-white p-2 shadow-sm border border-museum-dark/5 transition-transform hover:-translate-y-1 duration-500">
                                <div className="aspect-square overflow-hidden relative">
                                    <img 
                                        src={mem.contentUrl} 
                                        alt={mem.title} 
                                        className="w-full h-full object-cover grayscale-[0.4] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                    />
                                    <div className="absolute inset-0 bg-museum-dark/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4 text-white text-left">
                                        <div className="flex items-center gap-2 text-[7px] font-black uppercase tracking-widest mb-1">
                                            <Calendar size={10} /> {new Date(mem.capturedDate).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-2 text-[7px] font-black uppercase tracking-widest text-crimson">
                                            <Tag size={10} /> {mem.moodTag}
                                        </div>
                                    </div>
                                </div>
                                <div className="py-3 px-1">
                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-60 truncate">{mem.title}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="mb-24">
                    <h3 className="text-[9px] uppercase tracking-[0.5em] font-black opacity-40 mb-10">Architectural Exhibition Wings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-museum-dark/20 shadow-2xl">
                        {lifePhases.map((p, index) => (
                            <Link 
                                key={p._id} 
                                to={`/lifePhases/${p._id}`} 
                                className="group relative p-12 overflow-hidden transition-all duration-700 border-[0.5px] border-museum-dark/10 bg-[#f9f5eb] hover:bg-museum-dark"
                            >
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] group-hover:invert transition-all"></div>
                                <span className="absolute top-6 left-8 text-[10px] font-mono font-bold opacity-30 group-hover:text-crimson transition-colors tracking-tighter">
                                    SECTION_0{index + 1}
                                </span>
                                <div className="relative z-10">
                                    <h5 className="text-2xl md:text-3xl font-serif italic text-museum-dark group-hover:text-museum-cream transition-colors leading-tight mb-4">
                                        {p.title}
                                    </h5>
                                    <div className="flex items-center gap-3">
                                        <div className="h-[1px] w-12 bg-museum-dark/20 group-hover:bg-crimson group-hover:w-20 transition-all duration-700"></div>
                                        <span className="text-[7px] font-black uppercase tracking-[0.3em] opacity-40 group-hover:opacity-100 group-hover:text-white transition-opacity">
                                            View Wing
                                        </span>
                                    </div>
                                </div>
                                <MapIcon size={120} className="absolute -bottom-6 -right-6 opacity-[0.04] group-hover:opacity-10 group-hover:text-white transition-all -rotate-12 group-hover:rotate-0" />
                                <div className="absolute top-6 right-8 h-8 w-8 rounded-full border border-museum-dark/10 flex items-center justify-center group-hover:border-white/20">
                                    <span className="text-[9px] font-mono group-hover:text-white opacity-40">
                                        {p.memories?.length || 0}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* BOTTOM TOOLS */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Link to="/lifePhases/new" className="toolkit-card p-8 group border border-museum-dark/10 hover:border-crimson transition-colors bg-[#fdfcf9]">
                        <PenTool size={20} className="opacity-40" />
                        <div className="mt-12">
                            <h4 className="text-lg font-serif italic">New Wing</h4>
                            <p className="text-[10px] opacity-60 uppercase tracking-wider mt-1">Designate a new era</p>
                        </div>
                    </Link>
                    <Link to="/profile" className="toolkit-card p-8 group border border-museum-dark/10 bg-[#fdfcf9]">
                        <Landmark size={20} className="opacity-40" />
                        <div className="mt-12">
                            <h4 className="text-lg font-serif italic">Curator Suite</h4>
                            <p className="text-[10px] opacity-60 uppercase tracking-wider mt-1">Personnel Records</p>
                        </div>
                    </Link>
                    <Link to="/lifePhases" className="toolkit-card p-8 group border border-museum-dark/10 bg-[#fdfcf9]">
                        <Library size={20} className="opacity-40" />
                        <div className="mt-12">
                            <h4 className="text-lg font-serif italic">Exhibition</h4>
                            <p className="text-[10px] opacity-60 uppercase tracking-wider mt-1">Full Collection</p>
                        </div>
                    </Link>
                </section>
            </div>
        </main>
    );
};

export default Dashboard;