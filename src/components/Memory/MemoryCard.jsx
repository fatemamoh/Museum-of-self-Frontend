import { useNavigate } from 'react-router';
import { Lock, Tag, Link as LinkIcon, Image as ImageIcon, Play, Music } from 'lucide-react';

const MemoryCard = ({ memory }) => {
    const navigate = useNavigate();
    const sizeClasses = { 'Small': 'md:col-span-1', 'Medium': 'md:col-span-2', 'Large': 'md:col-span-3' };

    const getIcon = () => {
        switch (memory.type) {
            case 'Link': return <LinkIcon size={12} />;
            case 'Image': return <ImageIcon size={12} />;
            case 'Video': return <Play size={12} />;
            case 'Audio': return <Music size={12} />;
            default: return null;
        }
    };

    return (
        <div 
            onClick={() => navigate(`/memories/${memory._id}`)}
            className={`museum-card p-6 flex flex-col justify-between group cursor-pointer border border-museum-dark/10 transition-all duration-500 hover:shadow-2xl ${sizeClasses[memory.size] || ''}`}
        >
            <div>
                <div className="flex justify-between items-start mb-4">
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-40 flex items-center gap-2">
                        {getIcon()} {memory.type} // {memory.origin}
                    </span>
                    {memory.isVaulted && <Lock size={12} className="text-crimson animate-pulse" />}
                </div>
                
                <h4 className="text-2xl font-serif italic mb-4 leading-tight">{memory.title}</h4>
                
                {memory.type === 'Image' && memory.contentUrl ? (
                    <div className="dusty-glass mb-4 overflow-hidden border border-museum-dark/5 aspect-video bg-museum-dark/5">
                        <img 
                            src={memory.contentUrl} 
                            className={`w-full h-full object-cover transition-all duration-700 ${memory.isVaulted ? 'blur-lg grayscale' : 'group-hover:scale-110'}`} 
                            alt={memory.title} 
                        />
                    </div>
                ) : (
                    <p className={`text-sm font-serif italic leading-relaxed opacity-70 mb-4 line-clamp-3 ${memory.isVaulted ? 'blur-sm select-none' : ''}`}>
                        {memory.type === 'Link' ? memory.story : (memory.story || "No narrative content.")}
                    </p>
                )}
            </div>

            <div className="pt-4 border-t border-museum-dark/5 flex justify-between items-center mt-6">
                <div className="flex items-center gap-1.5">
                    <Tag size={10} className="text-museum-brown" />
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-museum-brown">{memory.moodTag}</span>
                </div>
                <span className="text-[9px] font-black uppercase tracking-tighter opacity-20 group-hover:opacity-100 transition-opacity">
                    Inspect Artifact
                </span>
            </div>
        </div>
    );
};

export default MemoryCard;