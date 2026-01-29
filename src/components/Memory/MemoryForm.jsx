import { useState } from 'react';
import { X, Camera, Landmark, Fingerprint } from 'lucide-react';

const MemoryForm = ({ phaseId, onSave, onCancel }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [fileSizeInfo, setFileSizeInfo] = useState({ size: 0, percentage: 0 });
    
    const [formData, setFormData] = useState({
        title: '',
        type: 'Text',
        size: 'Medium',
        story: '',
        curatorNote: '',
        moodTag: 'Ordinary',
        origin: 'Self-Made',
        capturedDate: new Date().toISOString().split('T')[0]
    });

    const MAX_SIZE_BYTES = 10485760;

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const sizeInMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
            const percentage = (selectedFile.size / MAX_SIZE_BYTES) * 100;
            setFileSizeInfo({ size: parseFloat(sizeInMB), percentage });
            setFile(selectedFile);
            if (selectedFile.type.startsWith('image/')) {
                setPreview(URL.createObjectURL(selectedFile));
            } else {
                setPreview(null);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        data.append('phase', phaseId);
        if (file) data.append('file', file);
        try {
            await onSave(data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="bg-white/40 backdrop-blur-md border-l-[6px] border-museum-brown p-8 md:p-12 shadow-2xl relative overflow-hidden animate-hero">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-museum-brown mb-1">Accession Form</h3>
                    <p className="text-[9px] uppercase font-bold opacity-30 tracking-widest">Permanent Collection Documentation</p>
                </div>
                <button onClick={onCancel} className="p-2 hover:bg-red-50 text-red-900/40 hover:text-red-900 transition-all">
                    <X size={20}/>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <div className="form-control">
                        <label className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2 block">Artifact Title</label>
                        <input required name="title" className="museum-input text-lg font-serif italic" value={formData.title} onChange={handleChange} />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="form-control">
                            <label className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2 block">Medium</label>
                            <select name="type" className="museum-input text-[10px] font-bold" value={formData.type} onChange={handleChange}>
                                {['Text', 'Image', 'Video', 'Audio', 'Link'].map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2 block">Display Scale</label>
                            <select name="size" className="museum-input text-[10px] font-bold" value={formData.size} onChange={handleChange}>
                                {['Small', 'Medium', 'Large'].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2 block">Narrative Transcription</label>
                        <textarea name="story" className="museum-input h-40 italic leading-relaxed text-sm" value={formData.story} onChange={handleChange} />
                    </div>
                </div>

                <div className="space-y-8 bg-museum-dark/[0.02] p-6 border border-museum-dark/5">
                    {['Image', 'Video', 'Audio'].includes(formData.type) && (
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-museum-dark/10 p-8 text-center relative bg-white/50">
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFileChange} />
                                {preview ? (
                                    <img src={preview} alt="Preview" className="max-h-40 mx-auto shadow-md" />
                                ) : (
                                    <div className="py-4 opacity-40">
                                        <Camera className="mx-auto mb-4" size={40} />
                                        <p className="text-[9px] font-black uppercase tracking-widest">Select {formData.type}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="form-control">
                        <label className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2 block">Curator's Note</label>
                        <input name="curatorNote" maxLength={150} className="museum-input text-[10px] font-bold uppercase" value={formData.curatorNote} onChange={handleChange} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="form-control">
                            <label className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2 block flex items-center gap-1"><Landmark size={10}/> Origin</label>
                            <select name="origin" className="museum-input text-[10px] font-bold" value={formData.origin} onChange={handleChange}>
                                {originOptions.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2 block flex items-center gap-1"><Fingerprint size={10}/> Aura</label>
                            <select name="moodTag" className="museum-input text-[10px] font-bold" value={formData.moodTag} onChange={handleChange}>
                                {moodTags.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2 block">Date</label>
                            <input type="date" name="capturedDate" className="museum-input text-[10px] font-bold" value={formData.capturedDate} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="pt-6">
                        <button type="submit" disabled={fileSizeInfo.percentage > 100} className="w-full text-white text-[10px] font-black uppercase tracking-[0.4em] py-5 bg-museum-dark hover:bg-museum-brown transition-all">
                            Commit to Exhibition
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default MemoryForm;