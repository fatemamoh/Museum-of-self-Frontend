import { useState, useEffect } from 'react';
import { X, Camera, Link as LinkIcon, FileText, Music, Film, AlertCircle } from 'lucide-react';

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

    const MAX_SIZE_BYTES = 10485760; // 10MB Cloudinary Limit

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
            
            // Only generate preview for images/videos
            if (selectedFile.type.startsWith('image/')) {
                setPreview(URL.createObjectURL(selectedFile));
            } else {
                setPreview(null);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Final Safety Guard
        if (['Image', 'Video', 'Audio'].includes(formData.type) && !file) {
            return alert("Artifact file required for media entries.");
        }
        if (file && file.size > MAX_SIZE_BYTES) {
            return alert("Artifact exceeds archival capacity (10MB).");
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
                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-museum-brown mb-1">New Artifact</h3>
                    <p className="text-[9px] uppercase font-bold opacity-30">Permanent Collection Accession</p>
                </div>
                <button onClick={onCancel} className="p-2 hover:bg-red-50 text-red-900/40 hover:text-red-900 transition-all">
                    <X size={20}/>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <div className="form-control">
                        <label className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2 block">Artifact Title</label>
                        <input required name="title" className="museum-input text-lg font-serif italic" value={formData.title} onChange={handleChange} placeholder="The First Summer..." />
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
                        <textarea name="story" className="museum-input h-40 italic leading-relaxed text-sm" value={formData.story} onChange={handleChange} placeholder="Describe the significance of this artifact..." />
                    </div>
                </div>

                <div className="space-y-8 bg-museum-dark/[0.02] p-6 border border-museum-dark/5">
                    {['Image', 'Video', 'Audio'].includes(formData.type) && (
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-museum-dark/10 p-8 text-center group hover:border-museum-brown transition-all relative bg-white/50">
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFileChange} accept={formData.type === 'Image' ? "image/*" : formData.type === 'Video' ? "video/*" : "audio/*"} />
                                {preview ? (
                                    <div className="space-y-4">
                                        <img src={preview} alt="Preview" className="max-h-40 mx-auto grayscale-0 group-hover:grayscale transition-all duration-500 shadow-md" />
                                        <p className="text-[8px] font-black uppercase tracking-widest opacity-30">Change Artifact File</p>
                                    </div>
                                ) : (
                                    <div className="py-4">
                                        <Camera className="mx-auto mb-4 opacity-20 group-hover:text-museum-brown group-hover:opacity-100 transition-all" size={40} />
                                        <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Select {formData.type} File</p>
                                    </div>
                                )}
                            </div>

                            {/* Artifact Weight Visualizer */}
                            {file && (
                                <div className="space-y-2 px-1">
                                    <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest">
                                        <span className="opacity-40">Artifact Weight</span>
                                        <span className={fileSizeInfo.percentage > 100 ? "text-red-600 animate-pulse" : "opacity-40"}>
                                            {fileSizeInfo.size} MB / 10 MB
                                        </span>
                                    </div>
                                    <div className="h-[1px] w-full bg-museum-dark/10 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full transition-all duration-700 ${fileSizeInfo.percentage > 100 ? 'bg-red-600' : fileSizeInfo.percentage > 80 ? 'bg-amber-500' : 'bg-museum-brown'}`}
                                            style={{ width: `${Math.min(fileSizeInfo.percentage, 100)}%` }}
                                        ></div>
                                    </div>
                                    {fileSizeInfo.percentage > 100 && (
                                        <div className="flex items-center gap-2 text-red-600">
                                            <AlertCircle size={10} />
                                            <span className="text-[7px] font-black uppercase tracking-tighter">Exceeds Archival Capacity</span>
                                        </div>
                                    )}
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
                            <label className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2 block">Moment Date</label>
                            <input type="date" name="capturedDate" className="museum-input text-[10px] font-bold" value={formData.capturedDate} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="pt-6">
                        <button 
                            type="submit" 
                            disabled={fileSizeInfo.percentage > 100}
                            className={`w-full text-white text-[10px] font-black uppercase tracking-[0.4em] py-5 transition-all shadow-xl ${fileSizeInfo.percentage > 100 ? 'bg-gray-300 cursor-not-allowed' : 'bg-museum-dark hover:bg-museum-brown'}`}
                        >
                            {fileSizeInfo.percentage > 100 ? 'File Too Large' : 'Add to Exhibition'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default MemoryForm;