export enum MarketCategory {
  CRYPTO = 'Crypto',
  POLITICS = 'Politics',
  SPORTS = 'Sports',
  TECH = 'Tech',
  POP_CULTURE = 'Pop Culture'
}

export interface PricePoint {
  timestamp: string;
  value: number;
}

export interface Market {
  id: string;
  title: string;
  description: string;
  category: MarketCategory;
  imageUrl: string;
  yesPrice: number;
  noPrice: number;
  volume: number; // In SOL
  endDate: string;
  liquidity: number; // In SOL
  chartData: PricePoint[];
  isHot?: boolean;
  status?: 'OPEN' | 'RESOLVED';
  resolutionOutcome?: 'YES' | 'NO';
}

export interface Position {
  marketId: string;
  marketTitle: string;
  outcome: 'YES' | 'NO';
  shares: number;
  avgPrice: number;
  currentPrice: number;
}

export interface Transaction {
  id: string;
  type: 'BUY' | 'SELL';
  marketTitle: string;
  outcome: 'YES' | 'NO';
  amount: number; // In SOL
  price: number;
  timestamp: string;
  status: 'confirmed' | 'pending';
}

export interface UserState {
  isConnected: boolean;
  walletAddress: string | null;
  balance: number; // SOL
  positions: Position[];
  history: Transaction[];
}