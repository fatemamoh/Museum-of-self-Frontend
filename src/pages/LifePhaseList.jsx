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
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPhases();
    }, []);

    const calculateDuration = (start, end) => {
        const startDate = new Date(start);
        const endDate = end ? new Date(end) : new Date();
        const years = endDate.getFullYear() - startDate.getFullYear();
        return years === 0 ? 'Current Era' : `${years} Year${years > 1 ? 's' : ''}`;
    };

    if (loading) return <main className="p-8 italic text-museum-brown">Consulting the archives...</main>;

    return (
        <main className="p-8 max-w-7xl mx-auto">
            <header className="mb-12 border-b border-museum-beige pb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-serif italic text-museum-dark">Floor Plan</h1>
                    <p className="uppercase tracking-[0.3em] text-xs text-museum-brown mt-2 font-bold">Chronological Archives</p>
                </div>
                <Link to="/lifePhases/new" className="btn btn-primary rounded-none px-8">
                    Open New Wing
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {lifePhases.map((phase, index) => (
                    <Link 
                        to={`/lifePhases/${phase._id}`} 
                        key={phase._id} 
                        className="group relative flex transition-museum hover:-translate-y-1"
                    >
                        <div className="w-16 shrink-0 flex flex-col items-center pt-2">
                            <span className="text-museum-brown font-serif italic text-xl">
                                {String(lifePhases.length - index).padStart(2, '0')}
                            </span>
                            <div className="w-px h-full bg-museum-beige mt-4 group-hover:bg-museum-brown"></div>
                        </div>

                        <article 
                            className="artifact-card flex-1 bg-base-100 p-8 shadow-sm hover:shadow-xl border-l-8 transition-museum" 
                            style={{ borderLeftColor: `var(--p)` }}
                            data-theme={phase.theme}
                        >
                            <div className="flex justify-between items-baseline mb-6">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-base-content/60">
                                    {new Date(phase.startDate).getFullYear()} 
                                    {phase.endDate ? ` — ${new Date(phase.endDate).getFullYear()}` : ' — Present'}
                                </span>
                                <span className="text-[10px] uppercase tracking-widest font-bold text-primary">
                                    {calculateDuration(phase.startDate, phase.endDate)}
                                </span>
                            </div>

                            <h3 className="text-3xl font-serif italic text-base-content mb-4 group-hover:text-primary transition-colors">
                                {phase.title}
                            </h3>

                            <p className="text-sm leading-relaxed text-base-content/80 italic line-clamp-2">
                                {phase.summary ? `"${phase.summary}"` : "This exhibition wing is currently being curated..."}
                            </p>

                            <div className="mt-8 flex items-center justify-end text-[10px] uppercase tracking-[0.2em] font-black gap-2">
                                <span>Explore Wing</span>
                                <span className="h-px w-8 bg-primary"></span>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>
        </main>
    );
};

export default LifePhaseList;