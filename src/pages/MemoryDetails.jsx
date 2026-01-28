import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import * as memoryService from '../services/memoryService';
import * as reflectionService from '../services/reflectionService';
import { Calendar, Tag, Quote, ArrowLeft, ExternalLink, Trash2, Plus, X, Edit3, ShieldAlert, CheckCircle, Fingerprint, ScanLine } from 'lucide-react';

const MemoryDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [memory, setMemory] = useState(null);
    const [reflections, setReflections] = useState([]);
    const [isEditingMemory, setIsEditingMemory] = useState(false);
    const [editingRefId, setEditingRefId] = useState(null);
    const [showReflectionForm, setShowReflectionForm] = useState(false);
    const [newReflection, setNewReflection] = useState({ content: '', reflectionType: 'Growth', growthScale: 5 });
    const [statusPopup, setStatusPopup] = useState(null); 

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const memData = await memoryService.show(id);
                setMemory(memData);
                const refData = await reflectionService.indexByMemory(id);
                setReflections(refData);
            } catch (err) {
                console.error("Archive Retrieval Error:", err);
            }
        };
        fetchAll();
    }, [id]);

    const getAuraColor = (mood) => {
        const moods = {
            'Gratitude': 'rgba(212, 175, 55, 0.15)', 
            'Growth': 'rgba(45, 90, 39, 0.1)',      
            'Longing': 'rgba(128, 0, 32, 0.12)',    
            'Clarity': 'rgba(70, 130, 180, 0.12)',   
            'Hindsight': 'rgba(94, 77, 65, 0.15)',   
            'Revelation': 'rgba(147, 112, 219, 0.1)' 
        };
        return moods[mood] || 'rgba(188, 71, 73, 0.08)'; 
    };

    const handleUpdateMemory = async (e) => {
        e.preventDefault();
        try {
            const updated = await memoryService.update(id, memory);
            setMemory(updated);
            setIsEditingMemory(false);
            setStatusPopup({ message: "Archive record updated", type: 'success' });
        } catch (err) {
            setStatusPopup({ message: "Update failed", type: 'error' });
        }
    };

    const handleDeleteMemory = async () => {
        try {
            await memoryService.deleteMemory(id);
            navigate(-1);
        } catch (err) {
            setStatusPopup({ message: "Erasure failed", type: 'error' });
        }
    };

    const handleAddReflection = async (e) => {
        e.preventDefault();
        try {
            const created = await reflectionService.create(id, newReflection);
            setReflections([created, ...reflections]);
            setNewReflection({ content: '', reflectionType: 'Growth', growthScale: 5 });
            setShowReflectionForm(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateReflection = async (refId, updatedContent) => {
        try {
            const updated = await reflectionService.update(refId, { content: updatedContent });
            setReflections(reflections.map(r => r._id === refId ? updated : r));
            setEditingRefId(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteReflection = async (refId) => {
        try {
            await reflectionService.deleteReflection(refId);
            setReflections(reflections.filter(r => r._id !== refId));
        } catch (err) {
            console.error(err);
        }
    };

    if (!memory) return (
        <div className="min-h-screen bg-[#f2e8cf] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-[1px] bg-museum-brown animate-pulse"></div>
            <p className="italic opacity-40 font-serif text-sm tracking-widest uppercase">Consulting Archives...</p>
        </div>
    );

    return (
        <main className="min-h-screen bg-museum-cream py-10 px-6 relative selection:bg-crimson selection:text-white overflow-x-hidden">
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <nav className="flex justify-between items-center mb-16 border-b border-museum-dark/10 pb-6">
                    <button onClick={() => navigate(-1)} className="group flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-all">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Collection
                    </button>
                    <div className="flex items-center gap-8">
                        <button onClick={() => setIsEditingMemory(!isEditingMemory)} className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all ${isEditingMemory ? 'text-crimson' : 'opacity-30 hover:opacity-100'}`}>
                            <Edit3 size={15}/> {isEditingMemory ? 'Exit Editor' : 'Edit Artifact'}
                        </button>
                        <div className="h-4 w-[1px] bg-museum-dark/10"></div>
                        <button onClick={handleDeleteMemory} className="text-crimson opacity-20 hover:opacity-100 transition-all">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    
                    <div className="lg:col-span-7 space-y-10">
                        {isEditingMemory ? (
                            <form onSubmit={handleUpdateMemory} className="p-10 bg-[#f2e8cf] border border-[#d4c3a3] shadow-2xl animate-hero space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[8px] font-black uppercase tracking-[0.4em] opacity-30 block">Label Designation</label>
                                    <input className="museum-input text-3xl font-serif italic w-full bg-white/40 border-museum-brown/10 py-3" value={memory.title} onChange={(e) => setMemory({...memory, title: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[8px] font-black uppercase tracking-[0.4em] opacity-30 block">Narrative Content</label>
                                    <textarea className="museum-input h-72 italic leading-relaxed w-full bg-white/40 border-museum-brown/10 text-base" value={memory.story} onChange={(e) => setMemory({...memory, story: e.target.value})} />
                                </div>
                                <button type="submit" className="w-full bg-museum-dark text-white py-4 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-crimson transition-colors">Commit Changes</button>
                            </form>
                        ) : (
                            <section className="animate-hero">
                                <div className="relative mb-12 group">
                                    <div 
                                        className="absolute -inset-10 blur-[80px] rounded-full opacity-60 transition-all duration-[3s] animate-pulse pointer-events-none"
                                        style={{ backgroundColor: getAuraColor(memory.moodTag) }}
                                    ></div>

                                    <div className="relative z-10">
                                        <div className="absolute -inset-4 border border-museum-dark/5 pointer-events-none group-hover:border-museum-dark/10 transition-colors"></div>
                                        {memory.type === 'Image' ? (
                                            <div className="bg-white p-3 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-museum-dark/5">
                                                <img src={memory.contentUrl} className="w-full h-auto grayscale-[0.2] hover:grayscale-0 transition-all duration-1000" alt={memory.title} />
                                            </div>
                                        ) : memory.type === 'Link' ? (
                                            <div className="aspect-[16/10] bg-museum-dark text-museum-cream flex flex-col items-center justify-center p-12 text-center relative overflow-hidden shadow-2xl">
                                                <div className="absolute top-0 left-0 w-full h-1 bg-crimson opacity-50"></div>
                                                <Quote size={48} className="mb-8 opacity-10 text-crimson" />
                                                <h2 className="text-4xl font-serif italic mb-10 relative z-10 max-w-md leading-tight tracking-tight">{memory.title}</h2>
                                                <a href={memory.story} target="_blank" rel="noreferrer" className="group/link bg-museum-cream text-museum-dark px-10 py-4 text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-3 hover:bg-crimson hover:text-white transition-all relative z-10">
                                                    <ExternalLink size={14}/> Access External Archive
                                                </a>
                                            </div>
                                        ) : (
                                            <div className="p-16 md:p-24 bg-[#f2e8cf] border border-[#d4c3a3] shadow-inner min-h-[450px] flex flex-col items-center justify-center text-center relative overflow-hidden">
                                                <Quote size={120} className="absolute -top-10 -left-10 opacity-[0.03] text-museum-brown rotate-12" />
                                                <p className="text-4xl font-serif italic leading-[1.6] text-museum-dark/80 relative z-10">"{memory.story}"</p>
                                                <div className="mt-12 w-16 h-[1px] bg-crimson/20"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="max-w-2xl">
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="h-[1px] w-8 bg-crimson/30"></span>
                                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-crimson">Artifact Record</span>
                                    </div>
                                    <h1 className="text-6xl font-serif italic mb-8 leading-[0.9] text-museum-dark tracking-tighter">
                                        {memory.title}
                                    </h1>
                                    <div className="flex gap-12 items-start opacity-60">
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-black uppercase tracking-widest opacity-50">Timestamp</p>
                                            <div className="flex items-center gap-2 text-xs font-bold font-serif italic">
                                                <Calendar size={13} /> {new Date(memory.capturedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-black uppercase tracking-widest opacity-50">Aura Classification</p>
                                            <div className="flex items-center gap-2 text-xs font-bold font-serif italic">
                                                <Tag size={13} /> {memory.moodTag}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-black uppercase tracking-widest opacity-50">Catalog ID</p>
                                            <div className="flex items-center gap-2 text-xs font-mono opacity-60 uppercase">
                                                <ScanLine size={13} /> {id.slice(-6)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="lg:col-span-5 space-y-12 pt-4">
                        <section className="space-y-10">
                            <div className="flex justify-between items-end border-b border-museum-dark/5 pb-6">
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-museum-dark/40 mb-1">Perspective Log</h3>
                                    <p className="text-[8px] uppercase opacity-20 font-bold tracking-widest text-crimson">Timeline of curator reflections</p>
                                </div>
                                {!showReflectionForm && (
                                    <button onClick={() => setShowReflectionForm(true)} className="group flex items-center gap-2 text-[10px] font-black text-crimson uppercase tracking-widest">
                                        <Plus size={14} className="group-hover:rotate-90 transition-transform duration-500"/> Add Reflection
                                    </button>
                                )}
                            </div>

                            {showReflectionForm && (
                                <form onSubmit={handleAddReflection} className="p-10 bg-museum-dark text-museum-cream animate-hero border-l-[8px] border-crimson shadow-2xl relative">
                                    <div className="flex justify-between items-center mb-10">
                                        <select value={newReflection.reflectionType} onChange={(e) => setNewReflection({...newReflection, reflectionType: e.target.value})} className="bg-transparent border-b border-museum-cream/10 text-[11px] uppercase font-black tracking-[0.2em] outline-none py-1 block">
                                            {['Growth', 'Gratitude', 'Hindsight', 'Longing', 'Lesson', 'Amusement', 'Forgiveness', 'Revelation', 'Closure', 'Clarity'].map(t => <option key={t} value={t} className="text-black">{t}</option>)}
                                        </select>
                                        <button type="button" onClick={() => setShowReflectionForm(false)} className="text-crimson/50 hover:text-crimson"><X size={20}/></button>
                                    </div>
                                    <textarea required value={newReflection.content} onChange={(e) => setNewReflection({...newReflection, content: e.target.value})} placeholder="Begin transcription..." className="w-full bg-transparent border-none outline-none font-serif italic text-xl mb-10 h-40 resize-none leading-relaxed placeholder:opacity-10" />
                                    <div className="flex items-center justify-between mb-10 p-5 bg-white/5 border border-white/5">
                                        <span className="text-[8px] font-black uppercase tracking-[0.4em] opacity-40">Growth Scale [0{newReflection.growthScale}]</span>
                                        <input type="range" min="1" max="10" value={newReflection.growthScale} onChange={(e) => setNewReflection({...newReflection, growthScale: parseInt(e.target.value)})} className="w-1/2 accent-crimson cursor-ew-resize" />
                                    </div>
                                    <button type="submit" className="w-full py-5 bg-crimson text-white text-[10px] font-black uppercase tracking-[0.5em] hover:bg-white hover:text-crimson transition-all">Record Entry</button>
                                </form>
                            )}

                            <div className="space-y-0 border-l border-museum-dark/10 ml-1">
                                {reflections.map((ref) => (
                                    <div key={ref._id} className="relative pl-10 pb-16 group">
                                        <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-museum-cream border-2 border-museum-dark group-hover:border-crimson group-hover:bg-crimson transition-all duration-500"></div>
                                        <div className="flex justify-between items-start mb-5">
                                            <div className="text-[9px] font-black opacity-30 uppercase tracking-[0.3em] group-hover:opacity-100 group-hover:text-crimson transition-all">{new Date(ref.createdAt).toLocaleDateString()} // {ref.reflectionType}</div>
                                            <div className="flex gap-5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0">
                                                <button onClick={() => setEditingRefId(ref._id)} className="text-museum-dark/30 hover:text-museum-dark transition-colors"><Edit3 size={14}/></button>
                                                <button onClick={() => handleDeleteReflection(ref._id)} className="text-crimson/10 hover:text-crimson transition-colors"><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                        {editingRefId === ref._id ? (
                                            <div className="mt-2 space-y-4 animate-hero bg-[#f2e8cf] p-6 border border-crimson/10 shadow-lg">
                                                <textarea className="bg-transparent border-none outline-none w-full text-base italic h-32 font-serif text-museum-dark leading-relaxed" defaultValue={ref.content} onBlur={(e) => handleUpdateReflection(ref._id, e.target.value)} autoFocus />
                                                <p className="text-[7px] font-black uppercase opacity-20 tracking-widest text-right">Auto-saving...</p>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-[17px] font-serif italic opacity-70 leading-[1.8] mb-6 text-museum-dark tracking-tight">{ref.content}</p>
                                                <div className="flex gap-1.5">
                                                    {[...Array(10)].map((_, i) => <div key={i} className={`h-[2px] w-5 transition-all duration-[1s] ${i < ref.growthScale ? 'bg-crimson' : 'bg-museum-dark/5'}`}></div>)}
                                                </div>
                                            </>
                                        )}
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