import { useContext } from 'react';
import { Link } from 'react-router';
import { UserContext } from '../contexts/UserContext';
import { Fingerprint, ArrowRight, Scroll, Frame, ScanSearch, Compass } from 'lucide-react';

const Landing = () => {
    const { user } = useContext(UserContext);

    return (
        <main className="min-h-screen relative bg-museum-cream selection:bg-crimson selection:text-white overflow-x-hidden">
            <div className="fixed inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/felt.png')] z-50"></div>
            <div className="blueprint-grid opacity-[0.15]"></div>

            <section className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden border-b border-museum-dark/5">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-crimson/[0.02] blur-[120px] rounded-full animate-pulse"></div>
                
                <div className="z-10 max-w-6xl w-full flex flex-col items-center">
                    <div className="mb-12 flex items-center gap-6 opacity-40 animate-fadeIn">
                        <div className="h-[1px] w-12 bg-museum-dark"></div>
                        <Compass size={20} className="animate-spin-slow" />
                        <div className="h-[1px] w-12 bg-museum-dark"></div>
                    </div>

                    <div className="relative text-center space-y-4">
                        <h1 className="text-7xl md:text-9xl font-serif italic text-museum-dark tracking-tighter leading-[0.8] animate-hero">
                            The Museum
                        </h1>
                        <h1 className="text-7xl md:text-9xl font-serif italic text-crimson tracking-tighter leading-[0.8] animate-hero delay-150">
                            of Self.
                        </h1>
                    </div>
                    
                    <div className="mt-12 max-w-xl text-center">
                        <p className="text-sm md:text-base text-museum-brown font-serif italic leading-relaxed opacity-70 animate-fadeIn delay-300">
                            A sanctuary for the timeline of a soul. Curate your history with the architectural dignity it deserves.
                        </p>
                    </div>

                    <div className="flex items-center gap-12 mt-16 animate-fadeIn delay-500">
                        <Link to="/sign-up" className="group relative">
                            <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.5em] text-museum-dark group-hover:text-crimson transition-colors duration-500">
                                Open Your Wing
                            </span>
                            <div className="absolute -bottom-2 left-0 w-0 h-[1px] bg-crimson transition-all duration-700 group-hover:w-full"></div>
                        </Link>
                        
                        <div className="h-10 w-[1px] bg-museum-dark/10 rotate-[30deg]"></div>

                        <Link to="/sign-in" className="group flex items-center gap-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-museum-dark/40 group-hover:text-museum-dark transition-all">
                                Curator Entry
                            </span>
                            <ArrowRight size={14} className="text-crimson opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                        </Link>
                    </div>
                </div>

                <div className="absolute bottom-10 right-10 flex flex-col items-end gap-2 opacity-20 font-mono text-[8px] tracking-[0.2em] text-museum-dark uppercase">
                    <span>Index: {user ? user.username : "Guest"}</span>
                    <span>Ref: AC-2026</span>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-6 py-40 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                    {[
                        {
                            icon: Scroll,
                            title: "Archival Wings",
                            desc: "Catalog your journey through distinct exhibitions. Each era is a physical space in your memory."
                        },
                        {
                            icon: ScanSearch,
                            title: "Identity Audit",
                            desc: "A meticulous review of self. Analyze the transitions between who you were and who you are becoming."
                        },
                        {
                            icon: Frame,
                            title: "Curated View",
                            desc: "An interface designed for quiet reflection. Clean lines and intentional negative space."
                        }
                    ].map((feat, i) => (
                        <div key={i} className="group relative p-10 bg-white/20 border border-museum-dark/5 transition-all duration-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
                            <div className="absolute inset-0 border border-crimson/0 group-hover:border-crimson/20 transition-all duration-700 pointer-events-none"></div>
                            <feat.icon size={24} className="text-museum-dark mb-10 opacity-30 group-hover:opacity-100 group-hover:text-crimson transition-all duration-500" />
                            <h3 className="text-2xl font-serif italic text-museum-dark mb-4">{feat.title}</h3>
                            <p className="text-[13px] text-museum-brown/60 leading-relaxed font-medium transition-colors group-hover:text-museum-brown">{feat.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="py-48 relative overflow-hidden">
                <div className="absolute inset-0 bg-museum-beige/10"></div>
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <Fingerprint size={50} className="mx-auto text-crimson mb-12 opacity-20" />
                    <h2 className="text-5xl md:text-6xl font-serif italic text-museum-dark mb-16 leading-[1.1]">
                        "Your life is a masterwork. <br /> Don't leave it in the basement."
                    </h2>
                    <Link to="/sign-up" className="inline-flex flex-col items-center group">
                        <span className="text-[11px] font-black uppercase tracking-[0.8em] text-crimson group-hover:tracking-[1em] transition-all duration-700">
                            Begin Accession
                        </span>
                        <div className="mt-4 h-[1px] w-8 bg-museum-dark/20 group-hover:w-24 group-hover:bg-crimson transition-all duration-700"></div>
                    </Link>
                </div>
            </section>

            <footer className="py-12 border-t border-museum-dark/5 text-center">
                <p className="text-[9px] font-black uppercase tracking-[0.6em] text-museum-dark/30">
                    The Museum of Self // All Rights Reserved // 2026
                </p>
            </footer>
        </main>
    );
};

export default Landing;