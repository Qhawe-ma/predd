import React, { useState } from 'react';
import { Market, UserState } from '../types';
import PriceChart from '../components/PriceChart';
import { ArrowLeft, Info, AlertCircle, CheckCircle, Loader2, DollarSign, BarChart2, Calendar, ShieldCheck, Coins } from 'lucide-react';
import { executeTrade } from '../services/walletService';

interface MarketDetailProps {
  market: Market;
  user: UserState;
  onBack: () => void;
  onTradeComplete: (tx: any, pos: any) => void;
  onConnect: () => void;
}

const MarketDetail: React.FC<MarketDetailProps> = ({ market, user, onBack, onTradeComplete, onConnect }) => {
  const [selectedOutcome, setSelectedOutcome] = useState<'YES' | 'NO'>('YES');
  const [amount, setAmount] = useState<string>('');
  const [isTrading, setIsTrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isResolved = market.status === 'RESOLVED';
  
  const price = selectedOutcome === 'YES' ? market.yesPrice : market.noPrice;
  const potentialReturn = amount ? (parseFloat(amount) / price).toFixed(2) : '0.00';
  const potentialProfit = amount ? ((parseFloat(amount) / price) - parseFloat(amount)).toFixed(2) : '0.00';
  const roi = amount ? (((parseFloat(amount) / price) - parseFloat(amount)) / parseFloat(amount) * 100).toFixed(0) : '0';

  const handleTrade = async () => {
    if (!user.isConnected) {
        onConnect();
        return;
    }
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
        setError('Please enter a valid amount');
        return;
    }
    if (numAmount > user.balance) {
        setError('Insufficient balance');
        return;
    }

    setError(null);
    setIsTrading(true);
    try {
        const { transaction, position } = await executeTrade(
            market.id, 
            market.title, 
            selectedOutcome, 
            numAmount, 
            price
        );
        onTradeComplete(transaction, position);
        setAmount('');
    } catch (err) {
        setError('Trade failed. Please try again.');
    } finally {
        setIsTrading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-20 animate-fade-in">
      <nav className="flex items-center gap-4 mb-8 text-sm">
         <button 
           onClick={onBack}
           className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
         >
           <ArrowLeft className="h-4 w-4" />
           Markets
         </button>
         <span className="text-slate-600">/</span>
         <span className="text-slate-400">{market.category}</span>
         <span className="text-slate-600">/</span>
         <span className="text-white truncate max-w-[200px]">{market.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Chart and Info (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex flex-col gap-4">
             <div className="flex items-start gap-5">
                <img src={market.imageUrl} alt="icon" className="w-20 h-20 rounded-2xl object-cover border border-white/10 shadow-2xl" />
                <div>
                    <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-2">{market.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Ends {new Date(market.endDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                            <BarChart2 className="h-3 w-3" />
                            ◎{market.volume.toLocaleString()} Volume
                        </span>
                    </div>
                </div>
             </div>
          </div>

          {/* Chart Container */}
          <div className="bg-surface rounded-2xl border border-white/5 p-1 overflow-hidden shadow-xl">
             <div className="h-[450px] w-full bg-[#0B0F19]">
               <PriceChart data={market.chartData} color={market.yesPrice > 0.5 ? '#14F195' : '#9945FF'} />
             </div>
          </div>

          {/* Resolution Rules */}
          <div className="bg-surface rounded-2xl border border-white/5 p-8">
             <div className="flex items-center gap-2 mb-4 text-white font-semibold text-lg">
                <Info className="h-5 w-5 text-solana-purple" />
                About this market
             </div>
             <div className="prose prose-invert prose-sm max-w-none text-slate-400 leading-relaxed">
                 <p>{market.description}</p>
                 <p className="mt-4 p-4 bg-white/5 rounded-lg border border-white/5 text-slate-300">
                    <span className="font-semibold text-white block mb-1">Resolution Source</span>
                    This market will resolve based on official data from independent reporting agencies and on-chain verification oracles.
                 </p>
             </div>
          </div>
        </div>

        {/* Right Column: Trading Interface (4 cols) */}
        <div className="lg:col-span-4">
          <div className="sticky top-24">
            <div className="rounded-3xl bg-surface border border-white/10 overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/5">
                {/* Header Gradient */}
                <div className={`h-2 w-full bg-gradient-to-r ${selectedOutcome === 'YES' ? 'from-solana-green to-emerald-500' : 'from-red-500 to-rose-600'}`}></div>
                
                {isResolved ? (
                   <div className="p-12 flex flex-col items-center justify-center text-center">
                      <CheckCircle className={`h-16 w-16 mb-6 ${market.resolutionOutcome === 'YES' ? 'text-solana-green' : 'text-red-500'}`} />
                      <h2 className="text-2xl font-bold text-white mb-2">Market Resolved</h2>
                      <p className="text-slate-400">
                        Winning Outcome: <span className={`font-bold ${market.resolutionOutcome === 'YES' ? 'text-solana-green' : 'text-red-500'}`}>{market.resolutionOutcome}</span>
                      </p>
                   </div>
                ) : (
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">Trade</h2>
                        <div className="flex items-center gap-1 text-xs text-slate-400 bg-white/5 px-2 py-1 rounded-md">
                            <ShieldCheck className="h-3 w-3 text-solana-green" />
                            Secure
                        </div>
                    </div>

                    {/* Outcome Toggle */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button
                            onClick={() => setSelectedOutcome('YES')}
                            className={`relative flex flex-col items-center justify-center py-4 rounded-xl border transition-all duration-200 ${
                                selectedOutcome === 'YES' 
                                ? 'bg-solana-green/10 border-solana-green text-white shadow-[0_0_15px_rgba(20,241,149,0.2)]' 
                                : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/20'
                            }`}
                        >
                            <span className={`text-xs font-bold uppercase tracking-wider mb-1 ${selectedOutcome === 'YES' ? 'text-solana-green' : 'text-slate-500'}`}>Yes</span>
                            <span className="text-xl font-mono font-bold">◎{market.yesPrice.toFixed(2)}</span>
                            {selectedOutcome === 'YES' && <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-solana-green"></div>}
                        </button>
                        <button
                            onClick={() => setSelectedOutcome('NO')}
                            className={`relative flex flex-col items-center justify-center py-4 rounded-xl border transition-all duration-200 ${
                                selectedOutcome === 'NO' 
                                ? 'bg-red-500/10 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                                : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/20'
                            }`}
                        >
                            <span className={`text-xs font-bold uppercase tracking-wider mb-1 ${selectedOutcome === 'NO' ? 'text-red-500' : 'text-slate-500'}`}>No</span>
                            <span className="text-xl font-mono font-bold">◎{market.noPrice.toFixed(2)}</span>
                            {selectedOutcome === 'NO' && <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></div>}
                        </button>
                    </div>

                    {/* Input Section */}
                    <div className="space-y-4 mb-6">
                        <div className="bg-background rounded-xl p-4 border border-white/5 focus-within:border-white/20 transition-colors">
                            <div className="flex justify-between text-xs mb-2">
                                <span className="text-slate-500 font-medium">Amount to Buy</span>
                                <span className="text-slate-500">
                                     Bal: <span className="text-white font-mono cursor-pointer hover:underline" onClick={() => setAmount(user.balance.toString())}>◎{user.balance.toFixed(2)}</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Coins className="h-5 w-5 text-slate-500" />
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => {
                                        setAmount(e.target.value);
                                        setError(null);
                                    }}
                                    className="w-full bg-transparent text-2xl font-bold text-white placeholder-slate-700 focus:outline-none font-mono"
                                    placeholder="0.00"
                                />
                                <button className="text-xs font-bold text-solana-purple bg-solana-purple/10 px-2 py-1 rounded hover:bg-solana-purple/20 transition-colors">MAX</button>
                            </div>
                        </div>
                    </div>

                    {/* Transaction details */}
                    <div className="space-y-3 p-4 bg-white/5 rounded-xl border border-white/5 text-sm mb-6">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400">Est. Shares</span>
                            <span className="text-white font-mono">{potentialReturn}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400">Potential Return</span>
                            <span className={`font-mono font-bold ${parseFloat(potentialProfit) > 0 ? 'text-solana-green' : 'text-slate-300'}`}>
                                +◎{potentialProfit} <span className="text-xs opacity-70">({roi}%)</span>
                            </span>
                        </div>
                         <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500">Fees (0.1%)</span>
                            <span className="text-slate-500">◎0.00</span>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-lg mb-4 animate-fade-in">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleTrade}
                        disabled={isTrading}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none ${
                            selectedOutcome === 'YES' 
                            ? 'bg-gradient-to-r from-solana-green to-emerald-500 text-black' 
                            : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
                        }`}
                    >
                        {isTrading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Confirming...
                            </span>
                        ) : user.isConnected ? (
                            `Buy ${selectedOutcome}`
                        ) : (
                            "Connect Wallet"
                        )}
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketDetail;