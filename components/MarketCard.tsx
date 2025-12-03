import React from 'react';
import { Market } from '../types';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { BarChart2, Clock, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface MarketCardProps {
  market: Market;
  onClick: (id: string) => void;
}

const MarketCard: React.FC<MarketCardProps> = ({ market, onClick }) => {
  const isWinning = market.yesPrice > 0.5;
  const isResolved = market.status === 'RESOLVED';

  return (
    <div 
      onClick={() => onClick(market.id)}
      className="group relative flex flex-col overflow-hidden bg-[#0A0A0A] rounded-xl border border-white/10 transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_40px_-20px_rgba(255,255,255,0.1)] cursor-pointer"
    >
      {/* Header Image Area */}
      <div className="relative h-48 w-full overflow-hidden border-b border-white/5">
        <img 
          src={market.imageUrl} 
          alt={market.title} 
          className="h-full w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent opacity-60"></div>
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
           <span className="inline-flex items-center backdrop-blur-md bg-black/40 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-widest ring-1 ring-white/10 rounded-sm">
              {market.category}
          </span>
        </div>

        {/* Hot / Resolved Badge */}
        <div className="absolute top-4 right-4">
            {isResolved ? (
                <span className="inline-flex items-center gap-1 backdrop-blur-md bg-solana-green/20 px-3 py-1 text-[10px] font-bold text-solana-green uppercase tracking-widest ring-1 ring-solana-green/40 rounded-sm">
                    <CheckCircle2 className="h-3 w-3" /> Resolved
                </span>
            ) : market.isHot && (
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
            )}
        </div>

        {/* Chart Overlay (Always visible but subtle) */}
        <div className="absolute bottom-0 left-0 right-0 h-16 opacity-30 group-hover:opacity-50 transition-opacity">
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={market.chartData}>
               <defs>
                 <linearGradient id={`grad-${market.id}`} x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor={isWinning ? "#10B981" : "#A855F7"} stopOpacity={0.4}/>
                   <stop offset="100%" stopColor={isWinning ? "#10B981" : "#A855F7"} stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <Area 
                 type="monotone" 
                 dataKey="value" 
                 stroke={isWinning ? "#10B981" : "#A855F7"} 
                 strokeWidth={1.5}
                 fill={`url(#grad-${market.id})`}
               />
             </AreaChart>
           </ResponsiveContainer>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 min-h-[3.5rem]">
            <h3 className="text-lg font-medium leading-snug text-white group-hover:text-neutral-200 transition-colors line-clamp-2">
            {market.title}
            </h3>
        </div>

        {/* Data Grid */}
        <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4 mt-auto">
            {/* Probability Block */}
            <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1 font-semibold">Yes Chance</span>
                <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-mono font-bold ${isResolved ? 'text-white' : (isWinning ? 'text-emerald-400' : 'text-neutral-300')}`}>
                        {(market.yesPrice * 100).toFixed(0)}%
                    </span>
                    {!isResolved && <ArrowUpRight className={`h-3 w-3 ${isWinning ? 'text-emerald-400' : 'text-neutral-600'}`} />}
                </div>
            </div>

            {/* Volume Block */}
            <div className="flex flex-col items-end">
                 <span className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1 font-semibold">Volume</span>
                 <div className="flex items-center gap-1 text-white font-mono text-sm">
                    ◎{(market.volume).toLocaleString()}
                 </div>
            </div>
        </div>

        {/* Visual Progress Bar (Split) */}
        <div className="mt-4 flex h-1 w-full overflow-hidden rounded-full bg-white/5">
            <div 
                className="h-full bg-emerald-500 transition-all duration-1000" 
                style={{ width: `${market.yesPrice * 100}%` }}
            ></div>
            <div 
                className="h-full bg-rose-500/50 transition-all duration-1000" 
                style={{ width: `${market.noPrice * 100}%` }}
            ></div>
        </div>
        
        <div className="flex justify-between mt-2 text-[10px] font-mono text-neutral-600">
             <span>YES ◎{(market.yesPrice).toFixed(2)}</span>
             <span>NO ◎{(market.noPrice).toFixed(2)}</span>
        </div>

      </div>
    </div>
  );
};

export default MarketCard;