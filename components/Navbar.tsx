import React from 'react';
import { Wallet, Search, Hexagon } from 'lucide-react';
import { UserState } from '../types';

interface NavbarProps {
  user: UserState;
  onConnect: () => void;
  onNavigate: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onConnect, onNavigate }) => {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/[0.06] bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo Section */}
        <div 
          className="flex items-center gap-4 cursor-pointer group" 
          onClick={() => onNavigate('/')}
        >
          <div className="relative flex h-8 w-8 items-center justify-center">
             <Hexagon className="h-8 w-8 text-white fill-white/10 stroke-[1.5px]" />
             <div className="absolute inset-0 bg-white/5 blur-lg rounded-full"></div>
          </div>
          <span className="text-xl font-bold tracking-[0.2em] text-white leading-none uppercase">
            Vantage
          </span>
        </div>

        {/* Central Nav Links & Search - Hidden on Mobile */}
        <div className="hidden md:flex flex-1 items-center justify-center max-w-xl px-12">
          <div className="relative w-full group">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="h-3.5 w-3.5 text-neutral-500 group-focus-within:text-white transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full rounded-none border-b border-white/10 bg-transparent py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-600 focus:border-white/40 focus:outline-none focus:placeholder-neutral-400 transition-all font-mono"
              placeholder="SEARCH MARKETS..."
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          {user.isConnected ? (
             <div className="flex items-center gap-6">
               <button 
                 onClick={() => onNavigate('portfolio')}
                 className="hidden sm:flex flex-col items-end group"
               >
                 <span className="text-[10px] uppercase tracking-wider text-neutral-500 group-hover:text-neutral-300 transition-colors">Portfolio</span>
                 <span className="text-sm font-medium text-white font-mono tracking-tight">{user.balance.toFixed(2)} SOL</span>
               </button>
               
               <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-mono text-neutral-400">
                    {user.walletAddress?.substring(0, 4)}...{user.walletAddress?.substring(user.walletAddress.length - 4)}
                  </span>
               </div>
             </div>
          ) : (
            <button
              onClick={onConnect}
              className="group relative flex items-center gap-2 bg-white px-5 py-2 text-xs font-bold text-black uppercase tracking-wider hover:bg-neutral-200 transition-all"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;