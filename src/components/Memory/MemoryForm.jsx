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

 const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("--- DEBUG: FRONTEND SUBMIT ---");
    
    const isMedia = ['Image', 'Video', 'Audio'].includes(formData.type);
    console.log("Artifact Type:", formData.type, "| Is Media:", isMedia);
    console.log("File State:", file);

    if (isMedia && !file) {
        return alert("File required for media artifacts.");
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
    });
    data.append('phase', phaseId);
    
    if (file) {
        data.append('file', file);
        console.log("FormData updated with 'file' key.");
    }

    // Checking FormData contents (special loop needed for FormData)
    for (let pair of data.entries()) {
        console.log("Appending to FormData:", pair[0], pair[1]);
    }

    try {
        await onSave(data);
    } catch (err) {
        console.error("Frontend Error:", err);
    }
};

    return (
        <div className="bg-white/50 border border-museum-dark/10 p-8 mb-12 animate-hero">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xs font-black uppercase tracking-[0.3em]">New Accession</h3>
                <button onClick={onCancel} className="opacity-40 hover:opacity-100"><X size={18}/></button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="form-control">
                        <label className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1 block">Artifact Title</label>
                        <input required name="title" className="museum-input" value={formData.title} onChange={handleChange} placeholder="OBJECT NAME..." />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1 block">Medium</label>
                            <select name="type" className="museum-input text-[10px]" value={formData.type} onChange={handleChange}>
                                {['Text', 'Image', 'Video', 'Audio', 'Link'].map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1 block">Scale</label>
                            <select name="size" className="museum-input text-[10px]" value={formData.size} onChange={handleChange}>
                                {['Small', 'Medium', 'Large'].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1 block">Narrative / URL</label>
                        <textarea name="story" className="museum-input h-32 italic" value={formData.story} onChange={handleChange} placeholder={formData.type === 'Link' ? 'https://...' : 'Describe...'} />
                    </div>
                </div>

                <div className="space-y-6">
                    {['Image', 'Video', 'Audio'].includes(formData.type) && (
                        <div className="border-2 border-dashed border-museum-dark/10 p-6 text-center group hover:border-crimson/40 transition-colors relative">
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                            {preview ? (
                                <img src={preview} alt="Preview" className="max-h-32 mx-auto mb-2 shadow-lg" />
                            ) : (
                                <Camera className="mx-auto mb-2 opacity-20" size={32} />
                            )}
                            <p className="text-[8px] font-black uppercase tracking-tighter opacity-40">Upload {formData.type}</p>
                        </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1 block">Mood</label>
                            <select name="moodTag" className="museum-input text-[10px]" value={formData.moodTag} onChange={handleChange}>
                                {['Nostalgic', 'Victorious', 'Radiant', 'Joyful', 'Quiet', 'Chaotic', 'Melancholic', 'Inspirational', 'Anxious', 'Peaceful', 'Bittersweet', 'Humorous', 'Profound', 'Ordinary', 'Rebellious'].map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1 block">Captured Date</label>
                            <input type="date" name="capturedDate" className="museum-input text-[10px]" value={formData.capturedDate} onChange={handleChange} />
                        </div>
                    </div>

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