import React, { useState, useRef } from 'react';
import { Market, MarketCategory } from '../types';
import { createMarket, deleteMarket, resolveMarket } from '../services/firebase';
import { generateMarketDescription } from '../services/aiService';
import { Trash2, CheckCircle, Plus, X, Lock, Sparkles, Upload, Loader2, Image as ImageIcon } from 'lucide-react';

interface AdminProps {
  markets: Market[];
}

const Admin: React.FC<AdminProps> = ({ markets }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<MarketCategory>(MarketCategory.CRYPTO);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newYesPrice, setNewYesPrice] = useState(0.5);
  const [newEndDate, setNewEndDate] = useState('');
  
  // UI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'panda123') {
        setIsAuthenticated(true);
    } else {
        alert('Access Denied');
    }
  };

  const handleGenerateDesc = async () => {
    if (!newTitle) return alert("Please enter a title first to generate a description.");
    setIsGenerating(true);
    try {
        const desc = await generateMarketDescription(newTitle);
        setNewDesc(desc);
    } catch (e) {
        console.error(e);
    } finally {
        setIsGenerating(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        // Basic size check (optional warning)
        if (file.size > 2 * 1024 * 1024) {
            alert("Warning: Image is larger than 2MB. It might take a while to upload.");
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewImageUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTitle || !newDesc || !newEndDate) {
        alert("Please fill in all required fields (Title, Description, End Date).");
        return;
    }

    setIsSubmitting(true);

    try {
        await createMarket({
            title: newTitle,
            description: newDesc,
            category: newCategory,
            imageUrl: newImageUrl || 'https://picsum.photos/400/300',
            yesPrice: newYesPrice,
            noPrice: 1 - newYesPrice,
            endDate: new Date(newEndDate).toISOString(),
            isHot: true,
            status: 'OPEN'
        });
        
        setShowCreateModal(false);
        // Reset form
        setNewTitle('');
        setNewDesc('');
        setNewImageUrl('');
        setNewEndDate('');
        setNewYesPrice(0.5);
        setNewCategory(MarketCategory.CRYPTO);
        alert("Market Created Successfully!");
    } catch (err: any) {
        console.error("Market creation error:", err);
        // Provide specific feedback if possible
        if (err.code === 'PERMISSION_DENIED') {
            alert('Error: Permission Denied. Check your Firebase Database Rules.');
        } else {
            alert(`Error creating market: ${err.message || 'Unknown error occurred'}`);
        }
    } finally {
        setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
        <div className="flex items-center justify-center min-h-screen pt-24 pb-12">
            <div className="w-full max-w-md p-8 bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl">
                <div className="flex justify-center mb-6">
                    <div className="bg-white/5 p-4 rounded-full">
                        <Lock className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-center text-white mb-8">Admin Access</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input 
                        type="password" 
                        placeholder="Enter Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-neutral-200 transition-colors">
                        Enter System
                    </button>
                </form>
            </div>
        </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-32 pb-12 min-h-screen">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-white mb-1">Market Administration</h1>
                <p className="text-neutral-500 text-sm">Manage settlement and market creation.</p>
            </div>
            <button 
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-emerald-500 text-black px-4 py-2 rounded-lg font-bold hover:bg-emerald-400 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
                <Plus className="h-4 w-4" /> Create Market
            </button>
        </div>

        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-white/5">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-400 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-400 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-neutral-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 bg-transparent">
                        {markets.map((market) => (
                            <tr key={market.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-white max-w-xs sm:max-w-md truncate">{market.title}</div>
                                    <div className="text-xs text-neutral-500 font-mono mt-0.5">{market.id}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                                    <span className="bg-white/5 px-2 py-1 rounded text-xs border border-white/5">
                                        {market.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${
                                        market.status === 'RESOLVED' 
                                        ? 'bg-neutral-900 text-neutral-400 border-neutral-800' 
                                        : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                    }`}>
                                        {market.status || 'OPEN'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end items-center gap-2">
                                        {market.status !== 'RESOLVED' && (
                                            <>
                                                <button 
                                                    onClick={() => resolveMarket(market.id, 'YES')}
                                                    className="text-emerald-500 hover:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded text-xs font-bold border border-emerald-500/20 transition-all"
                                                >
                                                    Win YES
                                                </button>
                                                <button 
                                                    onClick={() => resolveMarket(market.id, 'NO')}
                                                    className="text-rose-500 hover:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded text-xs font-bold border border-rose-500/20 transition-all"
                                                >
                                                    Win NO
                                                </button>
                                            </>
                                        )}
                                        <button 
                                            onClick={() => deleteMarket(market.id)}
                                            className="text-neutral-500 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-all ml-2"
                                            title="Delete Market"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Create Modal */}
        {showCreateModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl ring-1 ring-white/10 max-h-[90vh] flex flex-col">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 shrink-0">
                        <h3 className="text-xl font-bold text-white">Create New Market</h3>
                        <button onClick={() => setShowCreateModal(false)} className="text-neutral-500 hover:text-white transition-colors"><X className="h-5 w-5" /></button>
                    </div>
                    
                    <form onSubmit={handleCreate} className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
                        {/* Title */}
                        <div>
                            <label className="block text-xs font-bold text-neutral-400 mb-1.5 uppercase tracking-wider">Market Title</label>
                            <input 
                                required 
                                type="text" 
                                value={newTitle} 
                                onChange={e => setNewTitle(e.target.value)} 
                                className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all" 
                                placeholder="e.g. Will SOL hit $500 by December?" 
                            />
                        </div>

                        {/* Description with AI Button */}
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">Description</label>
                                <button 
                                    type="button"
                                    onClick={handleGenerateDesc}
                                    disabled={isGenerating || !newTitle}
                                    className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isGenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                                    {isGenerating ? 'Generating...' : 'Auto-Generate'}
                                </button>
                            </div>
                            <textarea 
                                required 
                                rows={4} 
                                value={newDesc} 
                                onChange={e => setNewDesc(e.target.value)} 
                                className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white text-sm placeholder-neutral-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none" 
                                placeholder="Resolution criteria..." 
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-xs font-bold text-neutral-400 mb-1.5 uppercase tracking-wider">Market Image</label>
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                className="hidden"
                            />
                            
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="group relative w-full h-32 rounded-lg border-2 border-dashed border-white/10 hover:border-emerald-500/50 hover:bg-white/5 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-2"
                            >
                                {newImageUrl ? (
                                    <>
                                        <img src={newImageUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                                        <div className="relative z-10 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10 text-xs text-white font-medium flex items-center gap-2">
                                            <ImageIcon className="h-3 w-3" /> Change Image
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="p-3 bg-white/5 rounded-full text-neutral-400 group-hover:text-emerald-400 transition-colors">
                                            <Upload className="h-5 w-5" />
                                        </div>
                                        <p className="text-xs text-neutral-500 font-medium">Click to upload cover image</p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Category & Date */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-neutral-400 mb-1.5 uppercase tracking-wider">Category</label>
                                <select value={newCategory} onChange={e => setNewCategory(e.target.value as MarketCategory)} className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white text-sm focus:border-emerald-500 focus:outline-none transition-all appearance-none cursor-pointer">
                                    {Object.values(MarketCategory).map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-neutral-400 mb-1.5 uppercase tracking-wider">End Date</label>
                                <input required type="date" value={newEndDate} onChange={e => setNewEndDate(e.target.value)} className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white text-sm focus:border-emerald-500 focus:outline-none transition-all [color-scheme:dark]" />
                            </div>
                        </div>

                        {/* Initial Odds */}
                        <div>
                             <label className="block text-xs font-bold text-neutral-400 mb-1.5 uppercase tracking-wider flex justify-between">
                                Initial Probability (YES)
                                <span className="text-emerald-400 font-mono">{(newYesPrice * 100).toFixed(0)}%</span>
                             </label>
                             <input 
                                type="range" 
                                min="0.01" 
                                max="0.99" 
                                step="0.01" 
                                value={newYesPrice} 
                                onChange={e => setNewYesPrice(parseFloat(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                             />
                        </div>

                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full bg-emerald-500 text-black font-bold py-3.5 rounded-lg hover:bg-emerald-400 mt-2 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" /> Launching...
                                </>
                            ) : (
                                "Launch Market"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

export default Admin;