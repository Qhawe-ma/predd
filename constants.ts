import { Market, MarketCategory, PricePoint } from './types';

// Helper to generate mock chart data
const generateChartData = (startPrice: number, volatility: number, points: number): PricePoint[] => {
  let currentPrice = startPrice;
  const data: PricePoint[] = [];
  const now = new Date();
  
  for (let i = points; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600 * 1000); // Hourly points
    const change = (Math.random() - 0.5) * volatility;
    currentPrice += change;
    currentPrice = Math.max(0.01, Math.min(0.99, currentPrice));
    
    data.push({
      timestamp: time.toISOString(),
      value: Number(currentPrice.toFixed(2))
    });
  }
  return data;
};

export const MOCK_MARKETS: Market[] = [
  {
    id: 'm1',
    title: 'Will Bitcoin hit $100k by 2026?',
    description: 'This market resolves to "Yes" if the price of Bitcoin (BTC) reaches $100,000.00 or greater on CoinGecko before January 1, 2026. If it does not reach this price by the deadline, the market resolves to "No".',
    category: MarketCategory.CRYPTO,
    imageUrl: 'https://picsum.photos/400/300?grayscale',
    yesPrice: 0.64,
    noPrice: 0.36,
    volume: 12500000,
    liquidity: 450000,
    endDate: '2026-01-01T00:00:00Z',
    isHot: true,
    chartData: generateChartData(0.55, 0.05, 48)
  },
  {
    id: 'm2',
    title: 'Will Solana Flip Ethereum Market Cap in 2025?',
    description: 'Resolves to Yes if Solana market capitalization exceeds Ethereum market capitalization at any point during the calendar year 2025.',
    category: MarketCategory.CRYPTO,
    imageUrl: 'https://picsum.photos/401/300?grayscale',
    yesPrice: 0.12,
    noPrice: 0.88,
    volume: 3400000,
    liquidity: 120000,
    endDate: '2025-12-31T23:59:59Z',
    chartData: generateChartData(0.08, 0.02, 48)
  },
  {
    id: 'm3',
    title: 'Will the US Fed cut rates in Q4 2025?',
    description: 'Market resolves based on the Federal Reserve interest rate decision meeting in Q4 2025.',
    category: MarketCategory.POLITICS,
    imageUrl: 'https://picsum.photos/402/300?grayscale',
    yesPrice: 0.75,
    noPrice: 0.25,
    volume: 8900000,
    liquidity: 2000000,
    endDate: '2025-12-31T00:00:00Z',
    isHot: true,
    chartData: generateChartData(0.60, 0.03, 48)
  },
  {
    id: 'm4',
    title: 'Will GTA VI be released before Holiday 2025?',
    description: 'Resolves Yes if Rockstar Games releases Grand Theft Auto VI for public purchase on any platform before Dec 25, 2025.',
    category: MarketCategory.TECH,
    imageUrl: 'https://picsum.photos/403/300?grayscale',
    yesPrice: 0.45,
    noPrice: 0.55,
    volume: 1200000,
    liquidity: 80000,
    endDate: '2025-12-25T00:00:00Z',
    chartData: generateChartData(0.50, 0.04, 48)
  },
  {
    id: 'm5',
    title: 'Will France win the 2026 World Cup?',
    description: 'Resolves Yes if the French National Team wins the 2026 FIFA World Cup final.',
    category: MarketCategory.SPORTS,
    imageUrl: 'https://picsum.photos/404/300?grayscale',
    yesPrice: 0.15,
    noPrice: 0.85,
    volume: 500000,
    liquidity: 45000,
    endDate: '2026-07-19T00:00:00Z',
    chartData: generateChartData(0.14, 0.01, 48)
  }
];

export const MOCK_USER_INITIAL: any = {
  isConnected: false,
  walletAddress: null,
  balance: 0,
  positions: [],
  history: []
};