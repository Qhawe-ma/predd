import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PricePoint } from '../types';
import { twMerge } from 'tailwind-merge';

interface PriceChartProps {
  data: PricePoint[];
  color?: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, color = "#14F195" }) => {
  const [timeframe, setTimeframe] = useState<'1H' | '1D' | '1W' | 'ALL'>('1D');

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.getHours() + ':00';
  };

  return (
    <div className="w-full h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
            <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Price History</h3>
            <div className="text-2xl font-mono font-bold text-white">
                ${data[data.length -1]?.value.toFixed(2)} 
                <span className="text-sm text-slate-500 ml-2 font-sans font-normal">Today</span>
            </div>
        </div>
        <div className="flex bg-white/5 rounded-lg p-1 space-x-1">
          {['1H', '1D', '1W', 'ALL'].map((tf) => (
             <button
               key={tf}
               onClick={() => setTimeframe(tf as any)}
               className={twMerge(
                 "px-4 py-1.5 text-xs font-medium rounded-md transition-all",
                 timeframe === tf 
                   ? "bg-white/10 text-white shadow-sm" 
                   : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
               )}
             >
               {tf}
             </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.4} />
            <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatDate}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#475569', fontFamily: 'JetBrains Mono' }}
                minTickGap={40}
                dy={10}
            />
            <YAxis 
                domain={[0, 1]} 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#475569', fontFamily: 'JetBrains Mono' }}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
                orientation="right"
            />
            <Tooltip 
                contentStyle={{ 
                    backgroundColor: 'rgba(3, 5, 12, 0.9)', 
                    borderColor: 'rgba(255,255,255,0.1)', 
                    borderRadius: '8px',
                    color: '#f1f5f9',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
                itemStyle={{ color: color, fontFamily: 'JetBrains Mono' }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                labelFormatter={(label) => new Date(label).toLocaleString()}
                cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                fillOpacity={1} 
                fill="url(#colorPrice)" 
                strokeWidth={2}
                animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;