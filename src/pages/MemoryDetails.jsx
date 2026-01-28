import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import * as memoryService from '../services/memoryService';
import * as reflectionService from '../services/reflectionService';
import { Calendar, Tag, Quote, ArrowLeft, ExternalLink, Trash2, Plus, X, Edit3, ScanLine } from 'lucide-react';

const MemoryDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [memory, setMemory] = useState(null);
    const [reflections, setReflections] = useState([]);
    const [isEditingMemory, setIsEditingMemory] = useState(false);
    const [editingRefId, setEditingRefId] = useState(null);
    const [showReflectionForm, setShowReflectionForm] = useState(false);
    const [newReflection, setNewReflection] = useState({ content: '', reflectionType: 'Growth', growthScale: 5 });

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
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteMemory = async () => {
        try {
            await memoryService.deleteMemory(id);
            navigate(-1);
        } catch (err) {
            console.error(err);
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
            <p className="italic opacity-40 font-serif text-xs tracking-widest uppercase">Consulting Archives...</p>
        </div>
    );

    return (
        <main className="min-h-screen bg-museum-cream py-10 px-6 relative selection:bg-crimson selection:text-white overflow-x-hidden">
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>

            <div className="max-w-5xl mx-auto relative z-10">
                <nav className="flex justify-between items-center mb-12 border-b border-museum-dark/10 pb-4">
                    <button onClick={() => navigate(-1)} className="group flex items-center gap-3 text-[8px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-all">
                        <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back
                    </button>
                    <div className="flex items-center gap-6">
                        <button onClick={() => setIsEditingMemory(!isEditingMemory)} className={`flex items-center gap-2 text-[8px] font-black uppercase tracking-widest transition-all ${isEditingMemory ? 'text-crimson' : 'opacity-30 hover:opacity-100'}`}>
                            <Edit3 size={13}/> {isEditingMemory ? 'Close' : 'Edit'}
                        </button>
                        <button onClick={handleDeleteMemory} className="text-crimson opacity-20 hover:opacity-100 transition-all">
                            <Trash2 size={14} />
                        </button>
                    </div>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-7 space-y-8">
                        {isEditingMemory ? (
                            <form onSubmit={handleUpdateMemory} className="p-8 bg-[#f2e8cf] border border-[#d4c3a3] shadow-xl animate-hero space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[7px] font-black uppercase tracking-[0.4em] opacity-30 block">Label</label>
                                    <input className="museum-input text-xl font-serif italic w-full bg-white/40 border-museum-brown/10 py-2" value={memory.title} onChange={(e) => setMemory({...memory, title: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[7px] font-black uppercase tracking-[0.4em] opacity-30 block">Narrative</label>
                                    <textarea className="museum-input h-48 italic leading-relaxed w-full bg-white/40 border-museum-brown/10 text-sm" value={memory.story} onChange={(e) => setMemory({...memory, story: e.target.value})} />
                                </div>
                                <button type="submit" className="w-full bg-museum-dark text-white py-3 text-[9px] font-black uppercase tracking-[0.4em] hover:bg-crimson transition-colors">Save Changes</button>
                            </form>
                        ) : (
                            <section className="animate-hero">
                                <div className="relative mb-8 group">
                                    <div 
                                        className="absolute -inset-8 blur-[60px] rounded-full opacity-40 transition-all duration-[3s] animate-pulse pointer-events-none"
                                        style={{ backgroundColor: getAuraColor(memory.moodTag) }}
                                    ></div>

                                    <div className="relative z-10">
                                        <div className="absolute -inset-3 border border-museum-dark/5 pointer-events-none"></div>
                                        {memory.type === 'Image' ? (
                                            <div className="bg-white p-2 shadow-lg border border-museum-dark/5">
                                                <div className="aspect-square w-full overflow-hidden bg-museum-cream">
                                                    <img 
                                                        src={memory.contentUrl} 
                                                        className="w-full h-full object-cover grayscale-[0.1] hover:grayscale-0 transition-all duration-700" 
                                                        alt={memory.title} 
                                                    />
                                                </div>
                                            </div>
                                        ) : memory.type === 'Link' ? (
                                            <div className="aspect-video bg-museum-dark text-museum-cream flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
                                                <Quote size={32} className="mb-4 opacity-10 text-crimson" />
                                                <h2 className="text-xl font-serif italic mb-6 max-w-xs">{memory.title}</h2>
                                                <a href={memory.story} target="_blank" rel="noreferrer" className="bg-museum-cream text-museum-dark px-6 py-3 text-[8px] font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-crimson hover:text-white transition-all">
                                                    <ExternalLink size={12}/> View Source
                                                </a>
                                            </div>
                                        ) : (
                                            <div className="p-12 bg-[#f2e8cf] border border-[#d4c3a3] shadow-inner min-h-[300px] flex flex-col items-center justify-center text-center">
                                                <p className="text-xl font-serif italic leading-relaxed text-museum-dark/80 italic">"{memory.story}"</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="max-w-xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="h-[1px] w-6 bg-crimson/30"></span>
                                        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-crimson">Archive Entry</span>
                                    </div>
                                    <h1 className="text-4xl font-serif italic mb-6 leading-tight text-museum-dark tracking-tight">
                                        {memory.title}
                                    </h1>
                                    <div className="flex gap-8 items-start opacity-50">
                                        <div className="space-y-1">
                                            <p className="text-[7px] font-black uppercase tracking-widest opacity-60">Date</p>
                                            <div className="flex items-center gap-1.5 text-xs font-serif italic">
                                                <Calendar size={11} /> {new Date(memory.capturedDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[7px] font-black uppercase tracking-widest opacity-60">Aura</p>
                                            <div className="flex items-center gap-1.5 text-xs font-serif italic">
                                                <Tag size={11} /> {memory.moodTag}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[7px] font-black uppercase tracking-widest opacity-60">ID</p>
                                            <div className="flex items-center gap-1.5 text-[10px] font-mono opacity-60 uppercase">
                                                <ScanLine size={11} /> {id.slice(-6)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="lg:col-span-5 space-y-10 pt-2">
                        <section className="space-y-8">
                            <div className="flex justify-between items-end border-b border-museum-dark/5 pb-4">
                                <div>
                                    <h3 className="text-[8px] font-black uppercase tracking-[0.4em] text-museum-dark/40">Reflections</h3>
                                </div>
                                {!showReflectionForm && (
                                    <button onClick={() => setShowReflectionForm(true)} className="group flex items-center gap-2 text-[8px] font-black text-crimson uppercase tracking-widest">
                                        <Plus size={12}/> New Entry
                                    </button>
                                )}
                            </div>

                            {showReflectionForm && (
                                <form onSubmit={handleAddReflection} className="p-6 bg-museum-dark text-museum-cream border-l-4 border-crimson shadow-lg">
                                    <div className="flex justify-between items-center mb-6">
                                        <select value={newReflection.reflectionType} onChange={(e) => setNewReflection({...newReflection, reflectionType: e.target.value})} className="bg-transparent border-b border-museum-cream/10 text-[9px] uppercase font-black tracking-widest outline-none py-1 block">
                                            {['Growth', 'Gratitude', 'Hindsight', 'Longing', 'Lesson', 'Amusement', 'Forgiveness', 'Revelation', 'Closure', 'Clarity'].map(t => <option key={t} value={t} className="text-black">{t}</option>)}
                                        </select>
                                        <button type="button" onClick={() => setShowReflectionForm(false)} className="text-crimson/50 hover:text-crimson"><X size={16}/></button>
                                    </div>
                                    <textarea required value={newReflection.content} onChange={(e) => setNewReflection({...newReflection, content: e.target.value})} placeholder="Write here..." className="w-full bg-transparent border-none outline-none font-serif italic text-base mb-6 h-24 resize-none placeholder:opacity-10" />
                                    <button type="submit" className="w-full py-3 bg-crimson text-white text-[8px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-crimson transition-all">Record</button>
                                </form>
                            )}

                            <div className="space-y-0 border-l border-museum-dark/5 ml-1">
                                {reflections.map((ref) => (
                                    <div key={ref._id} className="relative pl-8 pb-10 group">
                                        <div className="absolute left-[-3.5px] top-0 w-1.5 h-1.5 rounded-full bg-museum-cream border border-museum-dark group-hover:bg-crimson transition-colors"></div>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="text-[7px] font-black opacity-30 uppercase tracking-widest">{new Date(ref.createdAt).toLocaleDateString()} // {ref.reflectionType}</div>
                                            <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all">
                                                <button onClick={() => setEditingRefId(ref._id)} className="text-museum-dark/30 hover:text-museum-dark"><Edit3 size={11}/></button>
                                                <button onClick={() => handleDeleteReflection(ref._id)} className="text-crimson/10 hover:text-crimson"><Trash2 size={11} /></button>
                                            </div>
                                        </div>
                                        {editingRefId === ref._id ? (
                                            <textarea className="bg-white/50 p-3 w-full text-sm italic font-serif border border-crimson/10 outline-none h-20" defaultValue={ref.content} onBlur={(e) => handleUpdateReflection(ref._id, e.target.value)} autoFocus />
                                        ) : (
                                            <>
                                                <p className="text-sm font-serif italic opacity-70 leading-relaxed mb-4 text-museum-dark">{ref.content}</p>
                                                <div className="flex gap-1">
                                                    {[...Array(10)].map((_, i) => <div key={i} className={`h-[1px] w-3 ${i < ref.growthScale ? 'bg-crimson' : 'bg-museum-dark/5'}`}></div>)}
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