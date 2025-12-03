import { Transaction, Position } from '../types';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const connectWallet = async (): Promise<{ address: string; balance: number }> => {
  await delay(800); // Simulate wallet pop-up and user approval
  // Mocking a Solana public key
  const mockAddress = "7xKX...j8Pq"; 
  return {
    address: mockAddress,
    balance: 145.50 // SOL balance (approx $20k+ USD equivalent)
  };
};

export const executeTrade = async (
  marketId: string,
  marketTitle: string,
  outcome: 'YES' | 'NO',
  amount: number, // Amount in SOL
  price: number
): Promise<{ transaction: Transaction; position: Position }> => {
  await delay(1500); // Simulate transaction confirmation on Solana

  const shares = amount / price;

  const transaction: Transaction = {
    id: `tx_${Math.random().toString(36).substr(2, 9)}`,
    type: 'BUY',
    marketTitle,
    outcome,
    amount,
    price,
    timestamp: new Date().toISOString(),
    status: 'confirmed'
  };

  const position: Position = {
    marketId,
    marketTitle,
    outcome,
    shares,
    avgPrice: price,
    currentPrice: price // Simplified for mock
  };

  return { transaction, position };
};