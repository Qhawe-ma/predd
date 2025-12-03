import React, { useState, useMemo } from 'react';
import MarketCard from '../components/MarketCard';
import { Market, MarketCategory } from '../types';
import { TrendingUp, Zap, ChevronRight } from 'lucide-react';

interface HomeProps {
  markets: Market[];
  onNavigate: (path: string) => void;
}

const Home: React.FC<HomeProps> = ({ markets, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const categories = ['All', ...Object.values(MarketCategory)];

  const filteredMarkets = useMemo(() => {
    if (selectedCategory === 'All') return markets;
    return markets.filter(m => m.category === selectedCategory);
  }, [markets, selectedCategory]);

  const scrollToMarkets = () => {
    const section = document.getElementById('markets');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="animate-fade-in pb-32 relative overflow-hidden min-h-screen">
      
      {/* Hero Section */}
      <div className="relative pt-32 pb-24 border-b border-white/[0.04] bg-transparent">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-4xl">
                <h1 className="text-6xl md:text-8xl font-semibold tracking-tighter text-white mb-8 leading-[0.9]">
                    The Solana <br/>
                    <span className="text-neutral-500">Prediction Protocol.</span>
                </h1>
                
                <p className="text-xl text-neutral-400 max-w-2xl font-light leading-relaxed mb-10">
                    Vantage is the definitive settlement layer for global uncertainty. 
                    Institutional-grade prediction markets utilizing Solana's high-performance architecture for zero latency and deep liquidity.
                </p>

                <div className="flex flex-wrap gap-4">
                    <button onClick={scrollToMarkets} className="px-8 py-3 bg-white text-black font-semibold text-sm tracking-wide hover:bg-neutral-200 transition-colors flex items-center gap-2 uppercase">
                        PREDICT <ChevronRight className="h-4 w-4" />
                    </button>
                    <button onClick={() => {}} className="px-8 py-3 border border-white/20 text-white font-semibold text-sm tracking-wide hover:bg-white/5 transition-colors">
                        READ WHITE PAPER
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-20 z-40 bg-background/60 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-4 flex items-center justify-between overflow-x-auto">
             <div className="flex items-center gap-8">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-sm tracking-wide transition-colors whitespace-nowrap ${
                            selectedCategory === cat 
                            ? 'text-white font-medium border-b border-white pb-0.5' 
                            : 'text-neutral-500 hover:text-white'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-neutral-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                LIVE UPDATES
            </div>
        </div>
      </div>

      {/* Market Grid */}
      <div id="markets" className="mx-auto max-w-7xl px-6 lg:px-8 py-12 scroll-mt-32">
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMarkets.map((market) => (
            <MarketCard 
              key={market.id} 
              market={market} 
              onClick={(id) => onNavigate(`market/${id}`)}
            />
          ))}
        </div>
        
        {filteredMarkets.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-neutral-600">
                <Zap className="h-8 w-8 mb-4 opacity-40" />
                <p className="font-mono text-sm">NO ACTIVE MARKETS IN THIS CATEGORY</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Home;