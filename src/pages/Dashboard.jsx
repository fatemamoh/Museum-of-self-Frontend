import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router';
import { UserContext } from '../contexts/UserContext';
import * as lifePhaseService from '../services/lifePhaseService';

const Dashboard = () => {
    const { user } = useContext(UserContext);
    const [lifePhases, setLifePhases] = useState([]);
    const [heroIndex, setHeroIndex] = useState(0);

    const slogans = [
        { main: "The Architecture of Self", sub: "CURATING THE DEFINITIVE TIMELINE" },
        { main: "Every Era a Gallery", sub: "PRESERVING THE TRANSITIONS OF LIFE" },
        { main: "Your History, Well Kept", sub: "A PRIVATE ARCHIVE OF PERSONAL GROWTH" }
    ];

    useEffect(() => {
        const timer = setInterval(() => setHeroIndex((p) => (p + 1) % slogans.length), 6000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetch = async () => {
            const data = await lifePhaseService.index();
            setLifePhases(data);
        };
        if (user) fetch();
    }, [user]);

    const active = lifePhases.find(p => !p.endDate);

    return (
        <main className="min-h-screen relative bg-[#F5F0E1]">
            <section className="h-[55vh] flex items-center justify-center px-6 relative overflow-hidden border-b border-[#4B3D2A]/10">
                <div className="blueprint-grid opacity-10"></div>
                <div key={heroIndex} className="hero-text-box text-center animate-hero z-10">
                    <span className="text-[9px] uppercase tracking-[0.8em] font-black opacity-40 mb-4 block">Archive of {user?.username}</span>
                    <h1 className="text-4xl md:text-6xl font-serif italic mb-6 leading-tight">{slogans[heroIndex].main}</h1>
                    <div className="h-px w-16 bg-[#4B3D2A] mx-auto mb-6 opacity-20"></div>
                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-60">{slogans[heroIndex].sub}</p>
                </div>
                <div className="absolute bottom-8 flex gap-3 z-20">
                    {slogans.map((_, i) => (
                        <button key={i} onClick={() => setHeroIndex(i)} className={`h-1 transition-all duration-700 ${i === heroIndex ? 'w-12 bg-[#4B3D2A]' : 'w-3 bg-[#4B3D2A]/20'}`} />
                    ))}
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                    <Link to="/lifePhases/new" className="toolkit-card group">
                        <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Action 01</span>
                        <h4 className="text-xl font-serif italic">New Archive</h4>
                        <p className="text-[11px] opacity-60 leading-relaxed">Open a new wing for a current life era.</p>
                    </Link>
                    <Link to="/profile" className="toolkit-card">
                        <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Action 02</span>
                        <h4 className="text-xl font-serif italic">Curator Suite</h4>
                        <p className="text-[11px] opacity-60 leading-relaxed">Manage credentials and administrative metadata.</p>
                    </Link>
                    <Link to="/lifePhases" className="toolkit-card">
                        <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Action 03</span>
                        <h4 className="text-xl font-serif italic">Inventory</h4>
                        <p className="text-[11px] opacity-60 leading-relaxed">Access the complete directory of life wings.</p>
                    </Link>
                </section>

                <section className="mb-20">
                    <h3 className="text-[9px] uppercase tracking-[0.5em] font-black opacity-40 mb-6">Primary Exhibition</h3>
                    {active ? (
                        <Link to={`/lifePhases/${active._id}`} className="block border-2 border-[#4B3D2A] p-10 bg-[#E8DFCA] hover:bg-[#4B3D2A] hover:text-[#F5F0E1] transition-all group">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-[9px] font-black text-[#8a3a3c] uppercase tracking-widest group-hover:text-[#F5F0E1]">Currently Active</span>
                                    <h4 className="text-5xl font-serif italic mt-2">{active.title}</h4>
                                </div>
                                <span className="text-2xl opacity-20 group-hover:opacity-100 group-hover:translate-x-2 transition-all">→</span>
                            </div>
                            <p className="mt-6 text-sm italic opacity-70 max-w-2xl line-clamp-2">{active.summary}</p>
                        </Link>
                    ) : (
                        <div className="p-16 border-2 border-dashed border-[#4B3D2A]/20 text-center italic opacity-30 text-sm">No active wings.</div>
                    )}
                </section>

                <section>
                    <h3 className="text-[9px] uppercase tracking-[0.5em] font-black opacity-40 mb-8">Architectural Floor Plan</h3>
                    <div className="floor-plan-grid">
                        {lifePhases.map((p, i) => (
                            <Link key={p._id} to={`/lifePhases/${p._id}`} className={`museum-card p-6 group ${i % 6 === 0 ? 'md:col-span-3 md:row-span-2' : 'md:col-span-2'}`}>
                                <div className="flex justify-between items-start">
                                    <span className="text-[9px] font-mono opacity-30 group-hover:text-white/50">G-{String(lifePhases.length - i).padStart(2, '0')}</span>
                                    {!p.endDate && <div className="h-1.5 w-1.5 bg-[#8a3a3c] animate-pulse"></div>}
                                </div>
                                <h5 className={`${i % 6 === 0 ? 'text-3xl' : 'text-lg'} font-serif italic mt-4 group-hover:text-white`}>{p.title}</h5>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Dashboard;