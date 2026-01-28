import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import * as memoryService from '../services/memoryService';
import * as reflectionService from '../services/reflectionService';
import { Calendar, Tag, Quote, Clock, ArrowLeft, ExternalLink, Trash2, Plus, X, Star } from 'lucide-react';

const MemoryDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [memory, setMemory] = useState(null);
    const [reflections, setReflections] = useState([]);
    const [showReflectionForm, setShowReflectionForm] = useState(false);
    const [pin, setPin] = useState('');
    const [newReflection, setNewReflection] = useState({ 
        content: '', 
        reflectionType: 'Growth', 
        growthScale: 5 
    });

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const memData = await memoryService.show(id);
                setMemory(memData);
                const refData = await reflectionService.indexByMemory(id);
                setReflections(refData);
            } catch (err) { console.error(err); }
        };
        fetchAll();
    }, [id]);

    const handleDeleteMemory = async () => {
        if (!window.confirm("Decommission this artifact from the archives?")) return;
        try {
            await memoryService.deleteMemory(id);
            navigate(-1);
        } catch (err) { console.error(err); }
    };

    const handleAddReflection = async (e) => {
        e.preventDefault();
        try {
            const created = await reflectionService.create(id, newReflection, pin);
            setReflections([created, ...reflections]);
            setNewReflection({ content: '', reflectionType: 'Growth', growthScale: 5 });
            setShowReflectionForm(false);
        } catch (err) { 
            alert(err.response?.data?.err || "Verification Failed");
        }
    };

    const handleDeleteReflection = async (refId) => {
        try {
            await reflectionService.deleteReflection(refId, pin);
            setReflections(reflections.filter(r => r._id !== refId));
        } catch (err) { 
            alert("PIN required for vaulted deletions");
        }
    };

    if (!memory) return <div className="min-h-screen bg-museum-cream flex items-center justify-center italic opacity-40">Consulting Catalog...</div>;

    return (
        <main className="min-h-screen bg-museum-cream py-12 px-6 relative">
            <div className="blueprint-grid opacity-10"></div>
            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex justify-between items-center mb-12">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity">
                        <ArrowLeft size={14}/> Return to Wing
                    </button>
                    <button onClick={handleDeleteMemory} className="text-crimson opacity-40 hover:opacity-100 transition-all">
                        <Trash2 size={18} />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-7">
                        <div className="relative group">
                            <div className="absolute -inset-4 border border-museum-dark/5 pointer-events-none"></div>
                            {memory.type === 'Image' ? (
                                <img src={memory.contentUrl} className="w-full h-auto shadow-2xl border border-museum-dark/10" alt={memory.title} />
                            ) : memory.type === 'Link' ? (
                                <div className="aspect-video bg-museum-dark text-museum-cream flex flex-col items-center justify-center p-12 text-center">
                                    <Quote size={40} className="mb-6 opacity-20" />
                                    <h2 className="text-3xl font-serif italic mb-8">{memory.title}</h2>
                                    <a href={memory.story} target="_blank" rel="noreferrer" className="btn-stamp bg-museum-cream text-museum-dark px-10 flex items-center gap-2">
                                        <ExternalLink size={14}/> Open External Link
                                    </a>
                                </div>
                            ) : (
                                <div className="p-16 bg-white/40 border border-museum-dark/5 shadow-inner min-h-[400px] flex items-center justify-center text-center">
                                    <p className="text-4xl font-serif italic leading-relaxed opacity-80">"{memory.story}"</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-5 space-y-12">
                        <section>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 mb-4 block">Archive Record</span>
                            <h1 className="text-5xl font-serif italic mb-6 leading-tight">{memory.title}</h1>
                            <div className="grid grid-cols-2 gap-6 py-8 border-y border-museum-dark/10">
                                <div className="flex items-center gap-3">
                                    <Calendar size={18} className="opacity-30" />
                                    <div><p className="text-[8px] font-black uppercase opacity-40">Recorded</p><p className="text-xs font-bold">{new Date(memory.capturedDate).toLocaleDateString()}</p></div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Tag size={18} className="opacity-30" />
                                    <div><p className="text-[8px] font-black uppercase opacity-40">Aura</p><p className="text-xs font-bold">{memory.moodTag}</p></div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Curator's Log</h3>
                                {!showReflectionForm && (
                                    <button onClick={() => setShowReflectionForm(true)} className="text-[10px] font-bold text-crimson uppercase tracking-widest flex items-center gap-1">
                                        <Plus size={12}/> New Perspective
                                    </button>
                                )}
                            </div>

                            {showReflectionForm && (
                                <form onSubmit={handleAddReflection} className="mb-10 p-6 bg-museum-dark text-museum-cream animate-hero border-l-4 border-crimson">
                                    <div className="flex justify-between items-center mb-6">
                                        <select 
                                            value={newReflection.reflectionType}
                                            onChange={(e) => setNewReflection({...newReflection, reflectionType: e.target.value})}
                                            className="bg-transparent border-b border-museum-cream/20 text-[10px] uppercase font-black tracking-widest outline-none"
                                        >
                                            {['Growth', 'Gratitude', 'Hindsight', 'Longing', 'Lesson', 'Amusement', 'Forgiveness', 'Revelation', 'Closure', 'Clarity'].map(t => <option key={t} value={t} className="text-black">{t}</option>)}
                                        </select>
                                        <button type="button" onClick={() => setShowReflectionForm(false)}><X size={14}/></button>
                                    </div>
                                    
                                    <textarea 
                                        required
                                        value={newReflection.content}
                                        onChange={(e) => setNewReflection({...newReflection, content: e.target.value})}
                                        placeholder="Add a new perspective..."
                                        className="w-full bg-transparent border-none outline-none font-serif italic text-sm mb-6 h-24 resize-none"
                                    />

                                    <div className="flex items-center justify-between mb-6">
                                        <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Growth Scale: {newReflection.growthScale}</span>
                                        <input 
                                            type="range" min="1" max="10" 
                                            value={newReflection.growthScale} 
                                            onChange={(e) => setNewReflection({...newReflection, growthScale: parseInt(e.target.value)})}
                                            className="w-1/2 accent-crimson"
                                        />
                                    </div>

                                    {memory.isVaulted && (
                                        <input 
                                            type="password" 
                                            placeholder="ENTER MASTER PIN" 
                                            required
                                            value={pin}
                                            onChange={(e) => setPin(e.target.value)}
                                            className="w-full bg-white/10 border-none p-2 text-[10px] font-mono tracking-[0.5em] mb-4 text-center"
                                        />
                                    )}
                                    
                                    <button type="submit" className="w-full py-3 bg-museum-cream text-museum-dark text-[10px] font-black uppercase tracking-widest hover:bg-white transition-colors">Commit to Timeline</button>
                                </form>
                            )}

                            <div className="space-y-0 border-l-2 border-museum-dark/5 ml-2">
                                {reflections.map((ref) => (
                                    <div key={ref._id} className="relative pl-8 pb-10 group">
                                        <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-museum-cream border-2 border-museum-dark group-hover:bg-crimson transition-all"></div>
                                        <div className="flex justify-between items-start">
                                            <div className="text-[9px] font-black opacity-30 uppercase mb-2">
                                                {new Date(ref.createdAt).toLocaleDateString()} — {ref.reflectionType}
                                            </div>
                                            <button onClick={() => handleDeleteReflection(ref._id)} className="opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-opacity">
                                                <Trash2 size={10} className="text-crimson" />
                                            </button>
                                        </div>
                                        <p className="text-sm font-serif italic opacity-80 leading-relaxed mb-3">{ref.content}</p>
                                        <div className="flex gap-1">
                                            {[...Array(10)].map((_, i) => (
                                                <div key={i} className={`h-1 w-3 ${i < ref.growthScale ? 'bg-crimson/60' : 'bg-museum-dark/5'}`}></div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default MemoryDetails;