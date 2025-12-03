import React, { useState } from 'react';
import { UserState } from '../types';
import { TrendingUp, Clock, ArrowUpRight, ArrowDownRight, ChevronDown, ChevronUp, Wallet, Activity, History } from 'lucide-react';

interface PortfolioProps {
  user: UserState;
}

const Portfolio: React.FC<PortfolioProps> = ({ user }) => {
  const [showHistory, setShowHistory] = useState(false);

  if (!user.isConnected) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in pt-32">
            <div className="bg-white/5 p-8 rounded-full mb-8 ring-1 ring-white/10 backdrop-blur-xl">
                <Wallet className="h-12 w-12 text-white/40" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Connect Wallet</h2>
            <p className="text-neutral-500 max-w-md text-lg font-light leading-relaxed">
                Connect your Solana wallet to view your active positions and transaction history.
            </p>
        </div>
    );
  }

  const totalPortfolioValue = user.balance + user.positions.reduce((acc, pos) => acc + (pos.shares * pos.currentPrice), 0);
  const totalInvested = user.positions.reduce((acc, pos) => acc + (pos.shares * pos.avgPrice), 0);
  const totalPnl = totalPortfolioValue - user.balance - totalInvested;
  const isProfitable = totalPnl >= 0;

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-32 pb-12 animate-fade-in min-h-[80vh]">
      <div className="flex items-end justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Portfolio</h1>
            <p className="text-neutral-500">Manage your positions and track performance.</p>
          </div>
          <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Net Worth</div>
              <div className="text-3xl font-mono font-bold text-white">◎{totalPortfolioValue.toFixed(2)}</div>
          </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
         {/* Card 1 */}
         <div className="group relative overflow-hidden rounded-2xl bg-[#0A0A0A] border border-white/10 p-8 transition-all hover:border-white/20">
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4 text-neutral-500">
                    <Wallet className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Cash Balance</span>
                </div>
                <div className="text-4xl font-mono font-medium text-white tracking-tight">◎{user.balance.toFixed(2)}</div>
            </div>
         </div>
         
         {/* Card 2 */}
         <div className="group relative overflow-hidden rounded-2xl bg-[#0A0A0A] border border-white/10 p-8 transition-all hover:border-white/20">
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4 text-neutral-500">
                    <Activity className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Invested</span>
                </div>
                <div className="text-4xl font-mono font-medium text-white tracking-tight">◎{totalInvested.toFixed(2)}</div>
            </div>
         </div>

         {/* Card 3 */}
         <div className="group relative overflow-hidden rounded-2xl bg-[#0A0A0A] border border-white/10 p-8 transition-all hover:border-white/20">
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4 text-neutral-500">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Total P&L</span>
                </div>
                <div className={`text-4xl font-mono font-medium tracking-tight flex items-center gap-2 ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isProfitable ? '+' : ''}◎{totalPnl.toFixed(2)}
                    <span className="text-lg opacity-50 font-sans font-normal">
                         {isProfitable ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                    </span>
                </div>
            </div>
         </div>
      </div>

      {/* Active Positions */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-widest">Active Positions</h2>
        
        {user.positions.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
                {user.positions.map((pos, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row items-center justify-between p-6 bg-[#0A0A0A] border border-white/10 rounded-xl hover:border-white/20 transition-all group">
                         <div className="flex-1 mb-4 md:mb-0 w-full">
                            <h3 className="text-lg font-medium text-white mb-1 group-hover:text-emerald-400 transition-colors">{pos.marketTitle}</h3>
                            <div className="flex items-center gap-2 text-xs text-neutral-500">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${pos.outcome === 'YES' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                    {pos.outcome}
                                </span>
                                <span>•</span>
                                <span>{pos.shares.toFixed(2)} Shares</span>
                            </div>
                         </div>
                         
                         <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                            <div className="text-right">
                                <div className="text-[10px] uppercase tracking-wider text-neutral-600 mb-1">Avg Price</div>
                                <div className="font-mono text-sm text-neutral-300">◎{pos.avgPrice.toFixed(2)}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] uppercase tracking-wider text-neutral-600 mb-1">Current Value</div>
                                <div className="font-mono text-xl text-white font-medium">◎{(pos.shares * pos.currentPrice).toFixed(2)}</div>
                            </div>
                         </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-[#0A0A0A] rounded-xl border border-white/5 border-dashed">
                <p className="text-neutral-600 font-mono text-sm">NO ACTIVE POSITIONS</p>
            </div>
        )}
      </div>

      {/* Recent Activity Toggle */}
      <div className="border-t border-white/5 pt-8">
        <button 
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-3 text-neutral-500 hover:text-white transition-colors group"
        >
            <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10">
                 {showHistory ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
            <span className="text-sm font-bold uppercase tracking-widest">
                {showHistory ? 'Hide Recent Activity' : 'Show Recent Activity'}
            </span>
        </button>

        {showHistory && (
            <div className="mt-8 animate-fade-in">
                {user.history.length > 0 ? (
                    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0A]">
                        <table className="min-w-full divide-y divide-white/5">
                             <thead className="bg-white/[0.02]">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Time</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Type</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Details</th>
                                    <th className="px-6 py-4 text-right text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {user.history.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400 font-mono">{new Date(tx.timestamp).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-white uppercase tracking-wider">
                                            <span className="bg-white/5 px-2 py-1 rounded">{tx.type}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                                            <span className={tx.outcome === 'YES' ? 'text-emerald-500' : 'text-rose-500'}>{tx.outcome}</span> on <span className="text-neutral-500">{tx.marketTitle.substring(0, 40)}...</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-mono text-right">
                                            ◎{tx.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-12 text-center text-neutral-600 font-mono text-sm">
                        NO TRANSACTION HISTORY
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;