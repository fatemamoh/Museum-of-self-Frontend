import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router';
import { UserContext } from '../contexts/UserContext';
import * as lifePhaseService from '../services/lifePhaseService';
import LifePhaseList from './LifePhaseList';

const Dashboard = () => {
    const { user } = useContext(UserContext);
    const [lifePhases, setLifePhases] = useState([]);
    const [stats, setStats] = useState({ wings: 0, activeSince: '...' });

    useEffect(() => {
        const fetchPhases = async () => {
            try {
                const data = await lifePhaseService.index();
                setLifePhases(data);
                if (data.length > 0) {
                    const oldest = new Date(Math.min(...data.map(p => new Date(p.startDate))));
                    setStats({ wings: data.length, activeSince: oldest.getFullYear() });
                }
            } catch (error) { console.error(error); }
        };
        if (user) fetchPhases();
    }, [user]);

    return (
        <main className="min-h-screen bg-base-100 transition-museum">
            <div className="max-w-6xl mx-auto px-6 py-20">
                
                {/* GRAND HEADER */}
                <header className="flex flex-col items-center text-center mb-32 group">
                    <div className="mb-6 opacity-40 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-black tracking-[1em] uppercase border-b border-primary/30 pb-2">
                            The Archives of {user?.username}
                        </span>
                    </div>
                    <h1 className="text-8xl md:text-9xl font-serif italic tracking-tighter mb-8 leading-none">
                        Main Lobby
                    </h1>
                    <p className="max-w-md italic font-serif opacity-60 text-lg">
                        "Preserving the ephemera of existence since {stats.activeSince}."
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
                    
                    {/* LEFT COLUMN: CURATOR'S DESK */}
                    <div className="md:col-span-4 space-y-12">
                        <section className="p-8 border-l-2 border-primary/20 bg-primary/5">
                            <h2 className="text-[10px] font-black uppercase tracking-widest text-primary mb-6">Curator's Statement</h2>
                            <blockquote className="font-serif italic text-xl opacity-80 leading-relaxed">
                                "Every era is a room; every memory is an artifact. Curation is the art of deciding what remains."
                            </blockquote>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-[10px] font-black uppercase tracking-widest opacity-40">Museum Directory</h2>
                            <nav className="flex flex-col gap-2">
                                <Link to="/lifePhases" className="text-sm uppercase tracking-tighter hover:pl-4 transition-all duration-300">→ All Exhibition Wings ({stats.wings})</Link>
                                <Link to="/profile" className="text-sm uppercase tracking-tighter hover:pl-4 transition-all duration-300">→ Management Suite (Profile)</Link>
                                <Link to="/lifePhases/new" className="text-sm uppercase tracking-tighter hover:pl-4 transition-all duration-300">→ Commission New Wing</Link>
                            </nav>
                        </section>
                    </div>

                    {/* RIGHT COLUMN: RECENT EXHIBITS */}
                    <div className="md:col-span-8">
                        <div className="flex items-center justify-between mb-12 border-b border-primary/10 pb-4">
                            <h2 className="text-[10px] font-black uppercase tracking-widest opacity-50 text-primary">Current Feature</h2>
                            <span className="h-px flex-1 mx-8 bg-primary/10"></span>
                            <Link to="/lifePhases" className="text-[9px] uppercase tracking-widest underline">Full Catalog</Link>
                        </div>
                        
                        {/* Highlights the most recent wing as a "Special Exhibition" */}
                        {lifePhases.length > 0 ? (
                            <Link to={`/lifePhases/${lifePhases[0]._id}`} className="block group">
                                <article className="bg-base-200/50 p-12 border border-primary/5 hover:border-primary transition-colors">
                                    <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Ongoing Era</span>
                                    <h3 className="text-5xl font-serif italic mt-4 group-hover:translate-x-4 transition-transform duration-500">
                                        {lifePhases[0].title}
                                    </h3>
                                    <p className="mt-8 opacity-60 line-clamp-2 max-w-xl italic leading-relaxed">
                                        {lifePhases[0].summary || "No curator summary recorded for this wing..."}
                                    </p>
                                </article>
                            </Link>
                        ) : (
                            <div className="p-20 border-2 border-dashed border-primary/10 text-center">
                                <p className="italic opacity-30">The galleries are currently empty.</p>
                                <Link to="/lifePhases/new" className="btn btn-ghost btn-sm mt-4 uppercase">Begin Collection</Link>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </main>
    );
};

export default Dashboard;