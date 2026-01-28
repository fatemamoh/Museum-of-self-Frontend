import { useNavigate } from 'react-router';
import { Tag, Link as LinkIcon, Image as ImageIcon, Play, Music, ArrowUpRight, Fingerprint } from 'lucide-react';

const MemoryCard = ({ memory }) => {
    const navigate = useNavigate();
    
    const sizeClasses = { 
        'Small': 'md:col-span-1 py-4', 
        'Medium': 'md:col-span-1 py-4', 
        'Large': 'md:col-span-2 py-6' 
    };

    const getIcon = () => {
        switch (memory.type) {
            case 'Link': return <LinkIcon size={10} />;
            case 'Image': return <ImageIcon size={10} />;
            case 'Video': return <Play size={10} />;
            case 'Audio': return <Music size={10} />;
            default: return null;
        }
    };

    return (
        <div 
            onClick={() => navigate(`/memories/${memory._id}`)}
            className={`group relative flex flex-col justify-between cursor-pointer transition-all duration-500 hover:-translate-y-1 ${sizeClasses[memory.size] || 'md:col-span-1'}`}
        >
            <div className="relative h-full w-full bg-[#f2e8cf] border border-[#d4c3a3] shadow-[2px_2px_0px_#8b5e3c15] group-hover:shadow-[10px_10px_30px_#8b5e3c20] group-hover:bg-[#efe1c0] transition-all px-6 py-5 overflow-hidden">
                
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>

                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-1 bg-museum-brown text-[#f2e8cf]">
                                {getIcon()}
                            </div>
                            <span className="text-[7px] font-mono font-bold opacity-30 uppercase">
                                ID-{memory._id.slice(-4)}
                            </span>
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-museum-brown/50">
                            {memory.moodTag}
                        </span>
                    </div>

                    <div className={`flex gap-4 ${memory.size === 'Large' ? 'flex-row' : 'flex-col'}`}>
                        
                        {memory.type === 'Image' && memory.contentUrl && (
                            <div className={`shrink-0 border border-museum-dark/5 bg-white/20 ${memory.size === 'Large' ? 'w-24 h-24' : 'w-full h-20 mb-2'}`}>
                                <img 
                                    src={memory.contentUrl} 
                                    className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                                    alt={memory.title} 
                                />
                            </div>
                        )}

                        <div className="flex-1">
                            <h4 className={`font-serif italic leading-tight text-museum-dark group-hover:text-museum-brown transition-colors ${memory.size === 'Large' ? 'text-2xl mb-2' : 'text-lg mb-1'}`}>
                                {memory.title}
                            </h4>
                            <p className="font-serif italic text-[11px] leading-snug text-museum-dark/50 line-clamp-2">
                                {memory.story || "No narrative."}
                            </p>
                        </div>
                    </div>

                    <div className="mt-auto pt-4 flex justify-between items-center">
                        <div className="flex items-center gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                            <Fingerprint size={12} />
                            <span className="text-[6px] font-black uppercase tracking-widest">Entry Logged</span>
                        </div>
                        <ArrowUpRight size={12} className="text-museum-brown opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemoryCard;