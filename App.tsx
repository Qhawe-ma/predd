import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MarketDetail from './pages/MarketDetail';
import Portfolio from './pages/Portfolio';
import Admin from './pages/Admin';
import { Market, UserState } from './types';
import { MOCK_USER_INITIAL } from './constants';
import { connectWallet } from './services/walletService';
import { subscribeToMarkets, seedDatabaseIfEmpty } from './services/firebase';
import { Hexagon, Twitter, Github, Disc, Globe } from 'lucide-react';

// Simple router states
type Route = 'home' | 'market_detail' | 'portfolio' | 'admin';

const App: React.FC = () => {
  const [route, setRoute] = useState<Route>('home');
  const [currentMarketId, setCurrentMarketId] = useState<string | null>(null);
  const [user, setUser] = useState<UserState>(MOCK_USER_INITIAL);
  const [markets, setMarkets] = useState<Market[]>([]);

  // Initialize Firebase Subscription
  useEffect(() => {
    // 1. Seed data if empty
    seedDatabaseIfEmpty();
    
    // 2. Subscribe to real-time updates
    const unsubscribe = subscribeToMarkets((updatedMarkets) => {
        setMarkets(updatedMarkets);
    });

    return () => unsubscribe();
  }, []);

  // Handle hash based routing for simple SPA behavior
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash.startsWith('/market/')) {
        const id = hash.split('/')[2];
        setCurrentMarketId(id);
        setRoute('market_detail');
      } else if (hash === '/portfolio') {
        setRoute('portfolio');
      } else if (hash === '/admin') {
        setRoute('admin');
      } else {
        setRoute('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial check
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    if (path.startsWith('market/')) {
        window.location.hash = `/${path}`;
    } else if (path === 'portfolio') {
        window.location.hash = '/portfolio';
    } else if (path === 'admin') {
        window.location.hash = '/admin';
    } else {
        window.location.hash = '/';
    }
  };

  const handleConnect = async () => {
    try {
        const { address, balance } = await connectWallet();
        setUser(prev => ({
            ...prev,
            isConnected: true,
            walletAddress: address,
            balance: balance
        }));
    } catch (e) {
        console.error("Connection failed", e);
    }
  };

  const handleTradeComplete = (transaction: any, position: any) => {
     setUser(prev => ({
         ...prev,
         balance: prev.balance - transaction.amount,
         history: [transaction, ...prev.history],
         positions: [...prev.positions, position]
     }));
     alert("Order Placed Successfully!");
  };

  // Resolve current market for detail view
  const currentMarket = markets.find(m => m.id === currentMarketId);

  return (
    <div className="min-h-screen bg-transparent text-white font-sans selection:bg-emerald-500/30 selection:text-emerald-200 flex flex-col">
      <Navbar 
        user={user} 
        onConnect={handleConnect} 
        onNavigate={navigate}
      />

      <main className="flex-grow">
        {route === 'home' && (
          <Home markets={markets} onNavigate={navigate} />
        )}

        {route === 'market_detail' && currentMarket && (
          <MarketDetail 
            market={currentMarket} 
            user={user}
            onBack={() => navigate('/')} 
            onConnect={handleConnect}
            onTradeComplete={handleTradeComplete}
          />
        )}

        {route === 'portfolio' && (
          <Portfolio user={user} />
        )}

        {route === 'admin' && (
            <Admin markets={markets} />
        )}
      </main>

      {/* Corporate Footer */}
      <footer className="border-t border-white/10 bg-[#050505]/80 backdrop-blur-md pt-20 pb-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                
                {/* Brand Column */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                         <div className="relative flex h-6 w-6 items-center justify-center">
                            <Hexagon className="h-6 w-6 text-white fill-white/10 stroke-[1.5px]" />
                         </div>
                         <span className="text-lg font-bold tracking-[0.2em] text-white uppercase">Vantage</span>
                    </div>
                    <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">
                        The institutional-grade prediction layer for the global information economy. 
                        Powered by Solana.
                    </p>
                    <div className="flex gap-4">
                        <button className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-neutral-400 hover:bg-white hover:text-black transition-all">
                            <Twitter className="h-4 w-4" />
                        </button>
                        <button className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-neutral-400 hover:bg-white hover:text-black transition-all">
                            <Github className="h-4 w-4" />
                        </button>
                        <button className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-neutral-400 hover:bg-white hover:text-black transition-all">
                            <Disc className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Links Column 1 */}
                <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Platform</h4>
                    <ul className="space-y-4 text-sm text-neutral-500">
                        <li><button onClick={() => navigate('/')} className="hover:text-white transition-colors">Markets</button></li>
                        <li><button onClick={() => navigate('portfolio')} className="hover:text-white transition-colors">Portfolio</button></li>
                        <li><a href="#" className="hover:text-white transition-colors">Leaderboard</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Institutional Access</a></li>
                    </ul>
                </div>

                {/* Links Column 2 */}
                <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Resources</h4>
                    <ul className="space-y-4 text-sm text-neutral-500">
                        <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Whitepaper</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                    </ul>
                </div>

                 {/* Links Column 3 */}
                 <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Legal</h4>
                    <ul className="space-y-4 text-sm text-neutral-500">
                        <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                        <li><button onClick={() => navigate('admin')} className="hover:text-white transition-colors">Admin Access</button></li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-xs text-neutral-600 font-mono">
                    © 2024 VANTAGE LABS LTD. ALL RIGHTS RESERVED.
                </p>
                
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/20">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wide">Systems Normal</span>
                    </div>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;