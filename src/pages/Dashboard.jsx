import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router';
import { UserContext } from '../contexts/UserContext';
import * as lifePhaseService from '../services/lifePhaseService';
import * as memoryService from '../services/memoryService';
import { Library, Landmark, PenTool, ArrowRight, Fingerprint, Map as MapIcon, Image as ImageIcon, Calendar, Tag } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(UserContext);
    const [lifePhases, setLifePhases] = useState([]);
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
                
                // Now that we added index to memoryService, this will work:
                const allMemories = await memoryService.index();
                const imageMemories = allMemories
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

    return (
        <main className="min-h-screen relative bg-museum-cream pb-20 selection:bg-crimson selection:text-white">
            <div className="blueprint-grid"></div>

            {/* HERO SECTION */}
            <section className="h-[60vh] spotlight flex items-center justify-center px-6 relative overflow-hidden border-b border-museum-dark/10 bg-museum-beige/20">
                <div key={heroIndex} className="text-center animate-hero z-10 flex flex-col items-center">
                    <div className="p-4 rounded-full bg-museum-cream/50 mb-6 border border-museum-dark/5 shadow-inner">
                        <Fingerprint size={32} className="text-museum-dark opacity-80" />
                    </div>
                    <span className="text-[8px] uppercase tracking-[0.8em] font-black opacity-60 mb-4 block text-museum-dark">Archive of {user?.username}</span>
                    <h1 className="text-4xl md:text-5xl font-serif italic mb-6 text-museum-dark tracking-tight">{slogans[heroIndex].main}</h1>
                    <div className="h-[1px] w-16 bg-museum-dark/20 mb-6"></div>
                    <p className="text-[9px] uppercase tracking-[0.4em] font-bold opacity-70 text-museum-brown">{slogans[heroIndex].sub}</p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 relative z-10">
                
                {/* RECENT ACQUISITIONS (IMAGES) */}
                <section className="mb-24">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-[9px] uppercase tracking-[0.5em] font-black opacity-40">Recent Acquisitions</h3>
                        <div className="h-[1px] flex-grow mx-8 bg-museum-dark/5"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {recentMemories.map((mem) => (
                            <Link key={mem._id} to={`/memories/${mem._id}`} className="group relative bg-white p-2 shadow-sm border border-museum-dark/5">
                                <div className="aspect-square overflow-hidden relative">
                                    <img 
                                        src={mem.contentUrl} 
                                        alt={mem.title} 
                                        className="w-full h-full object-cover grayscale-[0.4] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                    />
                                    <div className="absolute inset-0 bg-museum-dark/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4 text-white">
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

                {/* ARCHITECTURAL FLOOR PLAN (PHASES) */}
                <section className="mb-24">
                    <h3 className="text-[9px] uppercase tracking-[0.5em] font-black opacity-40 mb-10">Architectural Floor Plan</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-museum-dark/10">
                        {lifePhases.map((p, index) => (
                            <Link 
                                key={p._id} 
                                to={`/lifePhases/${p._id}`} 
                                className="group relative p-12 border border-museum-dark/5 bg-transparent hover:bg-museum-dark transition-all duration-500 overflow-hidden"
                            >
                                <span className="absolute top-6 left-8 text-[9px] font-mono opacity-30 group-hover:text-white/40 transition-colors">
                                    REF. {index + 1}
                                </span>
                                <div className="relative z-10 flex flex-col justify-center h-full pt-4">
                                    <h5 className="text-2xl font-serif italic text-museum-dark group-hover:text-museum-cream transition-colors leading-tight">
                                        {p.title}
                                    </h5>
                                    <p className="text-[7px] uppercase tracking-[0.3em] font-black mt-2 opacity-0 group-hover:opacity-40 text-white transition-all duration-700">
                                        Open Wing
                                    </p>
                                </div>
                                <MapIcon size={100} className="absolute -bottom-8 -right-8 opacity-[0.02] group-hover:opacity-[0.05] group-hover:text-white transition-all -rotate-12" />
                            </Link>
                        ))}
                    </div>
                </section>

                {/* QUICK ACTIONS SECTION */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <Link to="/lifePhases/new" className="toolkit-card p-8 group flex flex-col justify-between border border-museum-dark/10 hover:border-crimson transition-colors">
                        <PenTool size={20} className="opacity-40" />
                        <div className="mt-12">
                            <h4 className="text-lg font-serif italic">New Archive</h4>
                            <p className="text-[10px] opacity-60 uppercase tracking-wider mt-1">Designate a new era</p>
                        </div>
                    </Link>
                    <Link to="/profile" className="toolkit-card p-8 group flex flex-col justify-between border border-museum-dark/10">
                        <Landmark size={20} className="opacity-40" />
                        <div className="mt-12">
                            <h4 className="text-lg font-serif italic">Curator Suite</h4>
                            <p className="text-[10px] opacity-60 uppercase tracking-wider mt-1">Personnel Records</p>
                        </div>
                    </Link>
                    <Link to="/lifePhases" className="toolkit-card p-8 group flex flex-col justify-between border border-museum-dark/10">
                        <Library size={20} className="opacity-40" />
                        <div className="mt-12">
                            <h4 className="text-lg font-serif italic">Inventory</h4>
                            <p className="text-[10px] opacity-60 uppercase tracking-wider mt-1">Full Collection</p>
                        </div>
                    </Link>
                </section>
            </div>
        </main>
    );
};

export default Dashboard;