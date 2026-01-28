import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import * as memoryService from '../services/memoryService';
import * as reflectionService from '../services/reflectionService';
import { Calendar, Tag, Quote, ArrowLeft, ExternalLink, Trash2, Plus, X, Edit3, Lock, ShieldAlert, CheckCircle } from 'lucide-react';

const MemoryDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [memory, setMemory] = useState(null);
    const [reflections, setReflections] = useState([]);
    const [isEditingMemory, setIsEditingMemory] = useState(false);
    const [editingRefId, setEditingRefId] = useState(null);
    const [showReflectionForm, setShowReflectionForm] = useState(false);
    const [newReflection, setNewReflection] = useState({ content: '', reflectionType: 'Growth', growthScale: 5 });

    const [pin, setPin] = useState('');
    const [showPinPopup, setShowPinPopup] = useState(false);
    const [statusPopup, setStatusPopup] = useState(null); 
    const [pendingAction, setPendingAction] = useState(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const memData = await memoryService.show(id, pin);
                setMemory(memData);
                const refData = await reflectionService.indexByMemory(id, pin);
                setReflections(refData);
            } catch (err) {
                if (err.response?.status === 403 || err.response?.status === 401) {
                    setShowPinPopup(true);
                }
            }
        };
        fetchAll();
    }, [id, pin]);

    const handleActionWithAuth = async (actionFn) => {
        try {
            await actionFn();
            setShowPinPopup(false);
            setPendingAction(null);
        } catch (err) {
            if (err.response?.status === 403 || err.response?.status === 401) {
                setPendingAction(() => actionFn);
                setShowPinPopup(true);
            } else {
                setStatusPopup({ message: err.response?.data?.err || "Action failed", type: 'error' });
            }
        }
    };

    const handleUpdateMemory = async (e) => {
        e.preventDefault();
        handleActionWithAuth(async () => {
            const updated = await memoryService.update(id, memory, pin);
            setMemory(updated);
            setIsEditingMemory(false);
            setStatusPopup({ message: "Archive record updated", type: 'success' });
        });
    };

    const handleDeleteMemory = async () => {
        setPendingAction(() => async () => {
            await memoryService.deleteMemory(id, pin);
            navigate(-1);
        });
        setStatusPopup({ 
            message: "Confirm permanent erasure of this artifact?", 
            type: 'confirm',
            onConfirm: () => setShowPinPopup(true) 
        });
    };

    const handleAddReflection = async (e) => {
        e.preventDefault();
        handleActionWithAuth(async () => {
            const created = await reflectionService.create(id, newReflection, pin);
            setReflections([created, ...reflections]);
            setNewReflection({ content: '', reflectionType: 'Growth', growthScale: 5 });
            setShowReflectionForm(false);
            setStatusPopup({ message: "Perspective added to timeline", type: 'success' });
        });
    };

    const handleUpdateReflection = async (refId, updatedContent) => {
        handleActionWithAuth(async () => {
            const updated = await reflectionService.update(refId, { content: updatedContent }, pin);
            setReflections(reflections.map(r => r._id === refId ? updated : r));
            setEditingRefId(null);
        });
    };

    const handleDeleteReflection = async (refId) => {
        setPendingAction(() => async () => {
            await reflectionService.deleteReflection(refId, pin);
            setReflections(reflections.filter(r => r._id !== refId));
        });
        setStatusPopup({ 
            message: "Remove this perspective?", 
            type: 'confirm',
            onConfirm: () => setShowPinPopup(true) 
        });
    };

    if (!memory) return <div className="min-h-screen bg-museum-cream flex items-center justify-center italic opacity-40">Consulting Catalog...</div>;

    return (
        <main className="min-h-screen bg-museum-cream py-12 px-6 relative">
            {showPinPopup && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                    <div className="bg-museum-cream border-2 border-museum-dark p-10 max-w-sm w-full shadow-2xl">
                        <div className="flex flex-col items-center mb-6">
                            <Lock className="text-crimson mb-4" size={32} />
                            <h2 className="text-xl font-serif italic text-center">Vault Authorization</h2>
                            <p className="text-[10px] uppercase font-black opacity-40 mt-2 text-center">Enter Master PIN to proceed</p>
                        </div>
                        <input 
                            type="password"
                            className="museum-input text-center tracking-[1em] text-2xl mb-6"
                            placeholder="****"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            autoFocus
                        />
                        <div className="flex flex-col gap-3">
                            <button onClick={() => pendingAction ? handleActionWithAuth(pendingAction) : setShowPinPopup(false)} className="btn-stamp w-full">Verify Identity</button>
                            <button onClick={() => { setShowPinPopup(false); setPendingAction(null); }} className="text-[9px] font-black uppercase opacity-40">Abort</button>
                        </div>
                    </div>
                </div>
            )}

            {statusPopup && (
                <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white border border-museum-dark p-8 max-w-xs w-full text-center shadow-xl">
                        {statusPopup.type === 'error' && <ShieldAlert className="mx-auto text-crimson mb-4" />}
                        {statusPopup.type === 'success' && <CheckCircle className="mx-auto text-green-600 mb-4" />}
                        <p className="font-serif italic text-sm mb-6">{statusPopup.message}</p>
                        <div className="flex flex-col gap-2">
                            {statusPopup.type === 'confirm' ? (
                                <>
                                    <button onClick={() => { statusPopup.onConfirm(); setStatusPopup(null); }} className="btn-stamp w-full bg-crimson text-white border-crimson">Confirm</button>
                                    <button onClick={() => setStatusPopup(null)} className="text-[9px] font-black uppercase opacity-40">Cancel</button>
                                </>
                            ) : (
                                <button onClick={() => setStatusPopup(null)} className="btn-stamp w-full">Acknowledged</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="blueprint-grid opacity-10"></div>
            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex justify-between items-center mb-12">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity">
                        <ArrowLeft size={14}/> Return to Wing
                    </button>
                    <div className="flex gap-4">
                        <button onClick={() => setIsEditingMemory(!isEditingMemory)} className="text-museum-dark opacity-40 hover:opacity-100"><Edit3 size={18}/></button>
                        <button onClick={handleDeleteMemory} className="text-crimson opacity-40 hover:opacity-100"><Trash2 size={18} /></button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-7">
                        {isEditingMemory ? (
                            <form onSubmit={handleUpdateMemory} className="space-y-6 p-8 border border-museum-dark/10 bg-white/50 animate-hero">
                                <input className="museum-input text-2xl font-serif italic" value={memory.title} onChange={(e) => setMemory({...memory, title: e.target.value})} />
                                <textarea className="museum-input h-48 italic" value={memory.story} onChange={(e) => setMemory({...memory, story: e.target.value})} />
                                <button type="submit" className="btn-stamp w-full">Commit Changes</button>
                            </form>
                        ) : (
                            <div className="relative group">
                                <div className="absolute -inset-4 border border-museum-dark/5 pointer-events-none"></div>
                                {memory.type === 'Image' ? (
                                    <img src={memory.contentUrl} className="w-full h-auto shadow-2xl border border-museum-dark/10" alt={memory.title} />
                                ) : memory.type === 'Link' ? (
                                    <div className="aspect-video bg-museum-dark text-museum-cream flex flex-col items-center justify-center p-12 text-center">
                                        <Quote size={40} className="mb-6 opacity-20" />
                                        <h2 className="text-3xl font-serif italic mb-8">{memory.title}</h2>
                                        <a href={memory.story} target="_blank" rel="noreferrer" className="btn-stamp bg-museum-cream text-museum-dark px-10 flex items-center gap-2"><ExternalLink size={14}/> Open Link</a>
                                    </div>
                                ) : (
                                    <div className="p-16 bg-white/40 border border-museum-dark/5 shadow-inner min-h-[400px] flex items-center justify-center text-center">
                                        <p className="text-4xl font-serif italic leading-relaxed opacity-80">"{memory.story}"</p>
                                    </div>
                                )}
                            </div>
                        )}
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
                                {!showReflectionForm && <button onClick={() => setShowReflectionForm(true)} className="text-[10px] font-bold text-crimson uppercase tracking-widest">+ New Perspective</button>}
                            </div>

                            {showReflectionForm && (
                                <form onSubmit={handleAddReflection} className="mb-10 p-6 bg-museum-dark text-museum-cream animate-hero border-l-4 border-crimson">
                                    <div className="flex justify-between items-center mb-6">
                                        <select value={newReflection.reflectionType} onChange={(e) => setNewReflection({...newReflection, reflectionType: e.target.value})} className="bg-transparent border-b border-museum-cream/20 text-[10px] uppercase font-black tracking-widest outline-none">
                                            {['Growth', 'Gratitude', 'Hindsight', 'Longing', 'Lesson', 'Amusement', 'Forgiveness', 'Revelation', 'Closure', 'Clarity'].map(t => <option key={t} value={t} className="text-black">{t}</option>)}
                                        </select>
                                        <button type="button" onClick={() => setShowReflectionForm(false)}><X size={14}/></button>
                                    </div>
                                    <textarea required value={newReflection.content} onChange={(e) => setNewReflection({...newReflection, content: e.target.value})} placeholder="Add a new perspective..." className="w-full bg-transparent border-none outline-none font-serif italic text-sm mb-6 h-24 resize-none" />
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Growth Scale: {newReflection.growthScale}</span>
                                        <input type="range" min="1" max="10" value={newReflection.growthScale} onChange={(e) => setNewReflection({...newReflection, growthScale: parseInt(e.target.value)})} className="w-1/2 accent-crimson" />
                                    </div>
                                    <button type="submit" className="w-full py-3 bg-museum-cream text-museum-dark text-[10px] font-black uppercase tracking-widest">Commit to Timeline</button>
                                </form>
                            )}

                            <div className="space-y-0 border-l-2 border-museum-dark/5 ml-2">
                                {reflections.map((ref) => (
                                    <div key={ref._id} className="relative pl-8 pb-10 group">
                                        <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-museum-cream border-2 border-museum-dark group-hover:bg-crimson transition-all"></div>
                                        <div className="flex justify-between items-start">
                                            <div className="text-[9px] font-black opacity-30 uppercase mb-2">{new Date(ref.createdAt).toLocaleDateString()} — {ref.reflectionType}</div>
                                            <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => setEditingRefId(ref._id)} className="text-museum-dark/40 hover:text-museum-dark"><Edit3 size={12}/></button>
                                                <button onClick={() => handleDeleteReflection(ref._id)} className="text-crimson/40 hover:text-crimson"><Trash2 size={12} /></button>
                                            </div>
                                        </div>
                                        {editingRefId === ref._id ? (
                                            <div className="mt-2 space-y-4">
                                                <textarea className="museum-input text-xs italic h-20" defaultValue={ref.content} onBlur={(e) => handleUpdateReflection(ref._id, e.target.value)} autoFocus />
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[7px] font-black uppercase opacity-30">Tab/Click away to save</span>
                                                    <button onClick={() => setEditingRefId(null)} className="text-[8px] font-black uppercase opacity-40 underline">Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-sm font-serif italic opacity-80 leading-relaxed mb-3">{ref.content}</p>
                                                <div className="flex gap-1">
                                                    {[...Array(10)].map((_, i) => <div key={i} className={`h-1 w-3 ${i < ref.growthScale ? 'bg-crimson/60' : 'bg-museum-dark/5'}`}></div>)}
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