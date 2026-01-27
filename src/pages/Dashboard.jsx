import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router';
import { UserContext } from '../contexts/UserContext';
import * as lifePhaseService from '../services/lifePhaseService';
import { Library, Landmark, PenTool, ArrowRight, Fingerprint, Map as MapIcon } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(UserContext);
    const [lifePhases, setLifePhases] = useState([]);
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
        const fetch = async () => {
            try {
                const data = await lifePhaseService.index();
                setLifePhases(data);
            } catch (err) { console.error(err); }
        };
        if (user) fetch();
    }, [user]);

    const active = lifePhases.find(p => !p.endDate);

    return (
        <main className="min-h-screen relative bg-museum-cream pb-20">
            {/* Using the global blueprint-grid style */}
            <div className="blueprint-grid"></div>

            <section className="h-[60vh] flex items-center justify-center px-6 relative overflow-hidden border-b border-museum-dark/1010">
                <div key={heroIndex} className="text-center animate-hero z-10 flex flex-col items-center">
                    <Fingerprint size={32} className="mb-6 opacity-20 text-museum-darkrk" />
                    <span className="text-[9px] uppercase tracking-[0.8em] font-black opacity-40 mb-4 block text-museum-dark">Archive of {user?.username}</span>
                    <h1 className="text-4xl md:text-6xl font-serif italic mb-6 text-museum-dark">{slogans[heroIndex].main}</h1>
                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-60 text-museum-dark">{slogans[heroIndex].sub}</p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 relative z-10">
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <Link to="/lifePhases/new" className="toolkit-card p-8 group min-h-50 flex flex-col justify-between">
                        <PenTool size={20} className="opacity-40" />
                        <div>
                            <h4 className="text-xl font-serif italic">New Archive</h4>
                            <p className="text-[11px] opacity-60">Add a new life phase record.</p>
                        </div>
                    </Link>
                    <Link to="/profile" className="toolkit-card p-8 group min-h-50 flex flex-col justify-between">
                        <Landmark size={20} className="opacity-40" />
                        <div>
                            <h4 className="text-xl font-serif italic">Curator Suite</h4>
                            <p className="text-[11px] opacity-60">Manage your museum profile.</p>
                        </div>
                    </Link>
                    <Link to="/lifePhases" className="toolkit-card p-8 group min-h-50 flex flex-col justify-between">
                        <Library size={20} className="opacity-40" />
                        <div>
                            <h4 className="text-xl font-serif italic">Inventory</h4>
                            <p className="text-[11px] opacity-60">View all archival wings.</p>
                        </div>
                    </Link>
                </section>

                <section className="mb-20">
                    <h3 className="text-[9px] uppercase tracking-[0.5em] font-black opacity-40 mb-8">Primary Exhibition</h3>
                    {active ? (
                        <Link to={`/lifePhases/${active._id}`} className="block border-2 border-museum-dark p-10 bg-[#E8DFCA] hover:bg-museum-dark hover:text-museum-creameam transition-all group relative overflow-hidden">
                            <div className="flex justify-between items-start relative z-10">
                                <div>
                                    <span className="text-[9px] font-black text-crimson uppercase group-hover:text-museum-cream/80">Currently Active</span>
                                    <h4 className="text-5xl font-serif italic mt-2">{active.title}</h4>
                                </div>
                                <ArrowRight size={32} className="opacity-20 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                            </div>
                        </Link>
                    ) : (
                        <div className="p-16 border-2 border-dashed border-museum-dark/20 text-center italic opacity-30">No active wings.</div>
                    )}
                </section>

                <section>
                    <h3 className="text-[9px] uppercase tracking-[0.5em] font-black opacity-40 mb-8">Architectural Floor Plan</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {lifePhases.map((p) => (
                            <Link key={p._id} to={`/lifePhases/${p._id}`} className="museum-card p-6 group min-h-45 flex flex-col justify-between">
                                <MapIcon size={14} className="opacity-20" />
                                <h5 className="text-2xl font-serif italic transition-colors group-hover:text-museum-cream">{p.title}</h5>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Dashboard;