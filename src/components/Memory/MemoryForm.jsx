import { useState } from 'react';
import { X, Camera } from 'lucide-react';

const MemoryForm = ({ phaseId, onSave, onCancel }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        type: 'Text',
        size: 'Medium',
        story: '',
        curatorNote: '',
        moodTag: 'Ordinary',
        origin: 'Self-Made',
        capturedDate: new Date().toISOString().split('T')[0],
        isVaulted: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) setPreview(URL.createObjectURL(selectedFile));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const isMedia = ['Image', 'Video', 'Audio'].includes(formData.type);
        if (isMedia && !file) return alert("File required for media artifacts.");

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        data.append('phase', phaseId);
        
        if (formData.type === 'Link') data.append('contentUrl', formData.story);
        if (file && isMedia) data.append('file', file);

        onSave(data);
    };

    return (
        <div className="museum-form-fixed p-8 animate-hero mb-12">
            <div className="flex justify-between items-center mb-6 border-b border-museum-dark/10 pb-4">
                <h3 className="font-serif italic text-2xl">Curate New Artifact</h3>
                <button type="button" onClick={onCancel} className="opacity-40 hover:opacity-100"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="form-control">
                        <label htmlFor="title" className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1 block">Title</label>
                        <input id="title" required name="title" className="museum-input text-lg font-serif italic" value={formData.title} onChange={handleChange} placeholder="The Golden Hour" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label htmlFor="type" className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1 block">Format</label>
                            <select id="type" name="type" className="museum-input text-[10px]" value={formData.type} onChange={handleChange}>
                                {['Text', 'Image', 'Video', 'Audio', 'Link'].map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="form-control">
                            <label htmlFor="size" className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1 block">Size</label>
                            <select id="size" name="size" className="museum-input text-[10px]" value={formData.size} onChange={handleChange}>
                                {['Small', 'Medium', 'Large'].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="form-control">
                        <label htmlFor="story" className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1 block">Content</label>
                        {['Text', 'Link'].includes(formData.type) ? (
                            <textarea id="story" name="story" className="museum-input h-40 p-3 text-sm font-serif italic" value={formData.story} onChange={handleChange} placeholder={formData.type === 'Link' ? "Paste URL..." : "Narrative..."} required />
                        ) : (
                            <div className="border-2 border-dashed border-museum-dark/20 h-40 flex flex-col items-center justify-center relative bg-museum-cream/30">
                                {preview ? <img src={preview} className="absolute inset-0 w-full h-full object-cover opacity-50" /> : <Camera size={24} className="opacity-20" />}
                                <input type="file" id="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label htmlFor="capturedDate" className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1 block">Date</label>
                            <input id="capturedDate" type="date" name="capturedDate" className="museum-input text-[10px]" value={formData.capturedDate} onChange={handleChange} required />
                        </div>
                        <div className="form-control">
                            <label htmlFor="moodTag" className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1 block">Mood</label>
                            <select id="moodTag" name="moodTag" className="museum-input text-[10px]" value={formData.moodTag} onChange={handleChange}>
                                {['Nostalgic', 'Victorious', 'Radiant', 'Joyful', 'Quiet', 'Chaotic', 'Melancholic', 'Inspirational', 'Anxious', 'Peaceful', 'Bittersweet', 'Humorous', 'Profound', 'Ordinary', 'Rebellious'].map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="form-control">
                        <label htmlFor="origin" className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1 block">Origin</label>
                        <select id="origin" name="origin" className="museum-input text-[10px]" value={formData.origin} onChange={handleChange}>
                            {['Self-Made', 'Gifted', 'Rediscovered', 'Snapshot', 'Shared', 'Found', 'Hand-Me-Down', 'Collection', 'Soundtrack', 'Message', 'Screen-Grab', 'Recording', 'Thought', 'Witnessed', 'Lesson', 'Souvenir', 'Milestone', 'Habit'].map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>
                    <input name="curatorNote" maxLength="150" className="museum-input text-[10px] italic" value={formData.curatorNote} onChange={handleChange} placeholder="Curator Note (max 150)" />
                    <label className="flex items-center gap-3 p-4 bg-museum-dark/5 border border-museum-dark/10 cursor-pointer">
                        <input type="checkbox" name="isVaulted" checked={formData.isVaulted} onChange={handleChange} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Vault Artifact</span>
                    </label>
                    <button type="submit" className="btn-stamp w-full">Commit to Catalog</button>
                </div>
            </form>
        </div>
    );
};

export default MemoryForm;