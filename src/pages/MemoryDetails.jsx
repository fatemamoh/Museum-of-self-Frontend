import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import * as memoryService from '../services/memoryService';
import * as reflectionService from '../services/reflectionService';
import { Calendar, Tag, ArrowLeft, Trash2, Plus, X, Edit3, ScanLine, Landmark, FileText, Check, RotateCcw } from 'lucide-react';

const MemoryDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [memory, setMemory] = useState(null);
    const [reflections, setReflections] = useState([]);
    const [isEditingMemory, setIsEditingMemory] = useState(false);
    const [editingRefId, setEditingRefId] = useState(null);
    const [editRefContent, setEditRefContent] = useState('');
    const [showReflectionForm, setShowReflectionForm] = useState(false);
    const [newReflection, setNewReflection] = useState({ content: '', reflectionType: 'Growth', growthScale: 5 });

    const originOptions = [
        'Collection', 'Found', 'Gifted', 'Habit', 'Hand-Me-Down', 
        'Lesson', 'Message', 'Milestone', 'Recording', 'Rediscovered', 
        'Screen-Grab', 'Self-Made', 'Shared', 'Snapshot', 'Soundtrack', 
        'Souvenir', 'Thought', 'Witnessed'
    ];

    const moodTags = [
        'Anxious', 'Bittersweet', 'Chaotic', 'Humorous', 'Inspirational', 
        'Joyful', 'Melancholic', 'Nostalgic', 'Ordinary', 'Peaceful', 
        'Profound', 'Quiet', 'Radiant', 'Rebellious', 'Victorious'
    ];

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

    const getAuraColor = (mood) => {
        const moods = {
            'Nostalgic': 'rgba(212, 175, 55, 0.15)', 'Radiant': 'rgba(255, 223, 0, 0.12)',
            'Victorious': 'rgba(45, 90, 39, 0.1)', 'Melancholic': 'rgba(128, 0, 32, 0.12)',
            'Peaceful': 'rgba(70, 130, 180, 0.12)', 'Profound': 'rgba(147, 112, 219, 0.1)',
            'Anxious': 'rgba(255, 69, 0, 0.1)', 'Chaotic': 'rgba(0, 0, 0, 0.05)',
            'Joyful': 'rgba(255, 105, 180, 0.15)', 'Quiet': 'rgba(173, 216, 230, 0.1)'
        };
        return moods[mood] || 'rgba(188, 71, 73, 0.08)'; 
    };

    const handleUpdateMemory = async (e) => {
        e.preventDefault();
        try {
            const updated = await memoryService.update(id, memory);
            setMemory(updated);
            setIsEditingMemory(false);
        } catch (err) { console.error(err); }
    };

    const handleAddReflection = async (e) => {
        e.preventDefault();
        try {
            const created = await reflectionService.create(id, newReflection);
            setReflections([created, ...reflections]);
            setNewReflection({ content: '', reflectionType: 'Growth', growthScale: 5 });
            setShowReflectionForm(false);
        } catch (err) { console.error(err); }
    };

    const handleStartEditRef = (ref) => {
        setEditingRefId(ref._id);
        setEditRefContent(ref.content);
    };

    const handleUpdateReflection = async (refId) => {
        try {
            const updated = await reflectionService.update(refId, { content: editRefContent });
            setReflections(reflections.map(r => r._id === refId ? updated : r));
            setEditingRefId(null);
        } catch (err) { console.error(err); }
    };

    const handleDeleteReflection = async (refId) => {
        if (!window.confirm("Delete this reflection?")) return;
        try {
            await reflectionService.deleteReflection(refId);
            setReflections(reflections.filter(r => r._id !== refId));
        } catch (err) { console.error(err); }
    };

    if (!memory) return <div className="min-h-screen bg-museum-cream flex items-center justify-center italic opacity-40 text-xs">Consulting Archives...</div>;

    return (
        <main className="min-h-screen bg-museum-cream py-10 px-6 relative selection:bg-crimson selection:text-white">
            <div className="max-w-5xl mx-auto relative z-10">
                <nav className="flex justify-between items-center mb-12 border-b border-museum-dark/10 pb-4">
                    <button onClick={() => navigate(-1)} className="text-[8px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 flex items-center gap-3">
                        <ArrowLeft size={12} /> Back
                    </button>
                    <div className="flex items-center gap-6">
                        <button onClick={() => setIsEditingMemory(!isEditingMemory)} className={`text-[8px] font-black uppercase tracking-widest transition-all ${isEditingMemory ? 'text-crimson' : 'opacity-30 hover:opacity-100'} flex items-center gap-2`}>
                            <Edit3 size={13}/> {isEditingMemory ? 'Cancel' : 'Edit'}
                        </button>
                        <button onClick={() => memoryService.deleteMemory(id).then(() => navigate(-1))} className="text-crimson opacity-20 hover:opacity-100"><Trash2 size={14} /></button>
                    </div>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-7 space-y-12">
                        {isEditingMemory ? (
                            <form onSubmit={handleUpdateMemory} className="p-8 bg-[#f2e8cf] border border-[#d4c3a3] space-y-6 shadow-xl animate-hero">
                                <div className="space-y-1"><label className="text-[7px] font-black uppercase opacity-40">Artifact Title</label><input className="museum-input text-xl font-serif italic w-full bg-white/40" value={memory.title} onChange={(e) => setMemory({...memory, title: e.target.value})} /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1"><label className="text-[7px] font-black uppercase opacity-40">Provenance</label><select className="museum-input text-[10px] font-bold w-full bg-white/40" value={memory.origin} onChange={(e) => setMemory({...memory, origin: e.target.value})}>{originOptions.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
                                    <div className="space-y-1"><label className="text-[7px] font-black uppercase opacity-40">Aura</label><select className="museum-input text-[10px] font-bold w-full bg-white/40" value={memory.moodTag} onChange={(e) => setMemory({...memory, moodTag: e.target.value})}>{moodTags.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
                                </div>
                                <div className="space-y-1"><label className="text-[7px] font-black uppercase opacity-40">Curator Note</label><input className="museum-input text-[10px] font-bold w-full bg-white/40" value={memory.curatorNote || ''} onChange={(e) => setMemory({...memory, curatorNote: e.target.value})} /></div>
                                <div className="space-y-1"><label className="text-[7px] font-black uppercase opacity-40">Main Narrative</label><textarea className="museum-input h-48 italic leading-relaxed text-sm w-full bg-white/40" value={memory.story} onChange={(e) => setMemory({...memory, story: e.target.value})} /></div>
                                <button type="submit" className="w-full bg-museum-dark text-white py-4 text-[9px] font-black uppercase tracking-[0.4em]">Update Accession</button>
                            </form>
                        ) : (
                            <section className="animate-hero">
                                <div className="relative mb-12">
                                    <div className="absolute -inset-8 blur-[80px] rounded-full opacity-40" style={{ backgroundColor: getAuraColor(memory.moodTag) }}></div>
                                    <div className="relative z-10">
                                        {memory.type === 'Image' ? (
                                            <div className="bg-white p-2 shadow-2xl border border-museum-dark/5 mb-8">
                                                <img src={memory.contentUrl} className="w-full grayscale-[0.2]" alt={memory.title} />
                                            </div>
                                        ) : (
                                            <div className="aspect-video bg-museum-dark flex items-center justify-center p-12 mb-8 shadow-2xl">
                                                <FileText size={48} className="text-museum-cream opacity-10" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="max-w-2xl">
                                    <h1 className="text-5xl font-serif italic mb-8 text-museum-dark tracking-tight leading-tight">{memory.title}</h1>
                                    <div className="mb-12">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="h-[1px] w-8 bg-crimson/40"></div>
                                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-crimson">Story of the Memory</span>
                                        </div>
                                        <p className="text-lg font-serif italic text-museum-dark/90 leading-[1.8] first-letter:text-4xl first-letter:font-black first-letter:mr-3 first-letter:float-left">{memory.story}</p>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 opacity-40 border-t border-museum-dark/10 pt-8 mb-10">
                                        <div className="space-y-1"><p className="text-[7px] font-black uppercase tracking-widest">Date</p><div className="flex items-center gap-1.5 text-xs font-serif italic"><Calendar size={11} /> {new Date(memory.capturedDate).toLocaleDateString()}</div></div>
                                        <div className="space-y-1"><p className="text-[7px] font-black uppercase tracking-widest">Feeling</p><div className="flex items-center gap-1.5 text-xs font-serif italic"><Tag size={11} /> {memory.moodTag}</div></div>
                                        <div className="space-y-1"><p className="text-[7px] font-black uppercase tracking-widest">Origin</p><div className="flex items-center gap-1.5 text-xs font-serif italic"><Landmark size={11} /> {memory.origin}</div></div>
                                        <div className="space-y-1"><p className="text-[7px] font-black uppercase tracking-widest">ID</p><div className="flex items-center gap-1.5 text-[10px] font-mono"><ScanLine size={11} /> {id.slice(-6)}</div></div>
                                    </div>
                                    {memory.curatorNote && (
                                        <div className="p-6 bg-museum-dark/[0.04] border-l-4 border-museum-dark/20 italic">
                                            <p className="text-[8px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Curator Note</p>
                                            <p className="text-[11px] font-serif opacity-60 uppercase tracking-tighter leading-relaxed">{memory.curatorNote}</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="lg:col-span-5 space-y-10">
                        <div className="flex justify-between items-end border-b border-museum-dark/5 pb-4">
                            <h3 className="text-[8px] font-black uppercase tracking-[0.4em] opacity-40">Temporal Reflections</h3>
                            <button onClick={() => setShowReflectionForm(true)} className="text-[8px] font-black text-crimson uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform"><Plus size={12}/> New Entry</button>
                        </div>
                        {showReflectionForm && (
                            <form onSubmit={handleAddReflection} className="p-6 bg-museum-dark text-museum-cream border-l-4 border-crimson space-y-4 shadow-2xl animate-hero">
                                <div className="grid grid-cols-2 gap-4">
                                    <select value={newReflection.reflectionType} onChange={(e) => setNewReflection({...newReflection, reflectionType: e.target.value})} className="bg-transparent border-b border-white/10 text-[9px] uppercase font-black outline-none block w-full">{['Growth', 'Gratitude', 'Hindsight', 'Longing', 'Lesson', 'Revelation', 'Clarity'].map(t => <option key={t} value={t} className="text-black">{t}</option>)}</select>
                                    <div className="space-y-1">
                                        <label className="text-[7px] font-black uppercase tracking-widest opacity-50 block text-right">Impact Scale: {newReflection.growthScale}</label>
                                        <input type="range" min="1" max="10" value={newReflection.growthScale} onChange={(e) => setNewReflection({...newReflection, growthScale: e.target.value})} className="w-full accent-crimson h-1" />
                                    </div>
                                </div>
                                <textarea required value={newReflection.content} onChange={(e) => setNewReflection({...newReflection, content: e.target.value})} className="w-full bg-transparent border-none outline-none font-serif italic text-base h-24 resize-none" placeholder="Transcribe reflection..." />
                                <button type="submit" className="w-full py-3 bg-crimson text-white text-[8px] font-black uppercase tracking-[0.4em]">Record entry</button>
                            </form>
                        )}
                        <div className="border-l border-museum-dark/5 ml-1">
                            {reflections.map((ref) => (
                                <div key={ref._id} className="pl-8 pb-10 group relative">
                                    <div className="absolute left-[-3.5px] top-0 w-1.5 h-1.5 rounded-full bg-museum-cream border border-museum-dark group-hover:bg-crimson transition-colors"></div>
                                    <div className="flex justify-between text-[7px] font-black opacity-30 uppercase tracking-widest mb-3">
                                        <span>{new Date(ref.createdAt).toLocaleDateString()} // {ref.reflectionType} (Impact: {ref.growthScale || 5})</span>
                                        <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleStartEditRef(ref)}><Edit3 size={10} /></button>
                                            <button onClick={() => handleDeleteReflection(ref._id)}><Trash2 size={10} className="text-crimson" /></button>
                                        </div>
                                    </div>
                                    {editingRefId === ref._id ? (
                                        <div className="space-y-3">
                                            <textarea className="w-full bg-white/50 border border-museum-dark/10 p-2 font-serif italic text-sm outline-none" value={editRefContent} onChange={(e) => setEditRefContent(e.target.value)} />
                                            <div className="flex gap-2">
                                                <button onClick={() => handleUpdateReflection(ref._id)} className="bg-museum-dark text-white p-1 rounded"><Check size={12}/></button>
                                                <button onClick={() => setEditingRefId(null)} className="bg-white border border-museum-dark/10 p-1 rounded"><X size={12}/></button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm font-serif italic opacity-70 leading-relaxed text-museum-dark">{ref.content}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default MemoryDetails;