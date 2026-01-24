import { Link } from 'react-router';

const LifePhaseList = (props) => {
  const themeStyles = {
    gold: "border-[#916f3b] text-[#916f3b] shadow-[10px_10px_0px_0px_rgba(145,111,59,1)]",
    olive: "border-[#535346] text-[#9b8f6a] shadow-[10px_10px_0px_0px_rgba(83,83,70,1)]",
    charcoal: "border-[#2f2e29] text-[#9b8f6a] shadow-[10px_10px_0px_0px_rgba(47,46,41,1)]",
    terracotta: "border-[#8a3a3c] text-[#8a3a3c] shadow-[10px_10px_0px_0px_rgba(138,58,60,1)]",
    slate: "border-[#424036] text-[#9b8f6a] shadow-[10px_10px_0px_0px_rgba(66,64,54,1)]"
  };

  if (!props.lifePhases.length) {
    return (
      <div className="mt-20 text-center opacity-30">
        <p className="uppercase tracking-[0.5em] text-[#916f3b] font-black">Archive Empty</p>
        <p className="text-[10px] text-[#9b8f6a] mt-2 italic">Awaiting first exhibition wing initialization...</p>
      </div>
    );
  }

  return (
   <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-12 pb-20">
            {props.lifePhases.map((phase) => (
                <Link to={`/lifePhases/${phase._id}`} key={phase._id} className="group transition-transform hover:-translate-y-2">
                    <article className={`h-full bg-[#2f2e29] border-2 p-8 flex flex-col justify-between ${themeStyles[phase.theme] || themeStyles.gold}`}>
                        <div>
                            <div className="flex justify-between items-start mb-6 text-[10px] font-bold uppercase tracking-widest opacity-60">
                                <span>{new Date(phase.startDate).getFullYear()} {phase.endDate ? `— ${new Date(phase.endDate).getFullYear()}` : '— Present'}</span>
                                <div className="w-2 h-2 rounded-full bg-current opacity-40"></div>
                            </div>
                            <h3 className="text-2xl font-black uppercase leading-tight mb-4 tracking-tighter group-hover:underline">{phase.title}</h3>
                            <p className="text-sm italic font-serif opacity-80 line-clamp-3">"{phase.summary}"</p>
                        </div>
                        <div className="mt-8 pt-4 border-t border-current border-opacity-10 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                            <span>Enter Gallery</span>
                            <span>→</span>
                        </div>
                    </article>
                </Link>
            ))}
        </section>
  );
};

export default LifePhaseList;