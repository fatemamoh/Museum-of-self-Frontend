import { useState } from 'react';
import { X, Camera, Link as LinkIcon, FileText, Music, Film } from 'lucide-react';

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
        capturedDate: new Date().toISOString().split('T')[0]
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) setPreview(URL.createObjectURL(selectedFile));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const isMedia = ['Image', 'Video', 'Audio'].includes(formData.type);
        if (isMedia && !file) {
            return alert("File required for media artifacts.");
        }

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
        data.append('phase', phaseId);
        
        if (file) data.append('file', file);

        try {
            await onSave(data);
        } catch (err) {
            console.error("Accession Error:", err);
        }
    };

    const getTypeIcon = () => {
        switch(formData.type) {
            case 'Image': return <Camera size={16} />;
            case 'Video': return <Film size={16} />;
            case 'Audio': return <Music size={16} />;
            case 'Link': return <LinkIcon size={16} />;
            default: return <FileText size={16} />;
        }
    };

    return (
        <div className="bg-white/40 backdrop-blur-md border-l-[6px] border-museum-brown p-8 md:p-12 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                {getTypeIcon()}
            </div>

            <div className="flex justify-between items-center mb-10">
                <div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-museum-brown mb-1">New Accession</h3>
                    <p className="text-[9px] uppercase font-bold opacity-30">Documenting an artifact for the permanent collection</p>
                </div>
                <button onClick={onCancel} className="p-2 hover:bg-red-50 text-red-900/40 hover:text-red-900 transition-all">
                    <X size={20}/>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <div className="form-control">
                        <label className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2 block">Artifact Nomenclature</label>
                        <input required name="title" className="museum-input text-lg font-serif italic" value={formData.title} onChange={handleChange} placeholder="Object Name..." />
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
                        <label className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2 block">Narrative Transcription / URL</label>
                        <textarea name="story" className="museum-input h-40 italic leading-relaxed text-sm" value={formData.story} onChange={handleChange} placeholder={formData.type === 'Link' ? 'https://...' : 'Describe the significance of this artifact...'} />
                    </div>
                </div>

                <div className="space-y-8 bg-museum-dark/[0.02] p-6 border border-museum-dark/5">
                    {['Image', 'Video', 'Audio'].includes(formData.type) && (
                        <div className="border-2 border-dashed border-museum-dark/10 p-8 text-center group hover:border-museum-brown transition-all relative bg-white/50">
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFileChange} />
                            {preview ? (
                                <div className="space-y-4">
                                    <img src={preview} alt="Preview" className="max-h-40 mx-auto grayscale-0 group-hover:grayscale transition-all duration-500 shadow-md" />
                                    <p className="text-[8px] font-black uppercase tracking-widest opacity-30">Click to Replace File</p>
                                </div>
                            ) : (
                                <div className="py-4">
                                    <Camera className="mx-auto mb-4 opacity-20 group-hover:text-museum-brown group-hover:opacity-100 transition-all" size={40} />
                                    <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Identify & Upload {formData.type}</p>
                                </div>
                            )}
                        </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-6">
                        <div className="form-control">
                            <label className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2 block">Emotional Tone</label>
                            <select name="moodTag" className="museum-input text-[10px] font-bold" value={formData.moodTag} onChange={handleChange}>
                                {['Nostalgic', 'Victorious', 'Radiant', 'Joyful', 'Quiet', 'Chaotic', 'Melancholic', 'Inspirational', 'Anxious', 'Peaceful', 'Bittersweet', 'Humorous', 'Profound', 'Ordinary', 'Rebellious'].map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2 block">Accession Date</label>
                            <input type="date" name="capturedDate" className="museum-input text-[10px] font-bold" value={formData.capturedDate} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="pt-6">
                        <button type="submit" className="w-full bg-museum-dark text-white text-[10px] font-black uppercase tracking-[0.4em] py-5 hover:bg-museum-brown transition-all shadow-xl">
                            Commit to Archive
                        </button>
                        <p className="text-[8px] text-center mt-4 opacity-30 uppercase font-bold tracking-widest">Permanent Record Entry</p>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default MemoryForm;