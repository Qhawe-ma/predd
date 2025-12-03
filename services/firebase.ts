import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, onValue, remove, update, get } from "firebase/database";
import { Market, MarketCategory } from "../types";
import { MOCK_MARKETS } from "../constants";

const firebaseConfig = {
  apiKey: "AIzaSyBPVw9oq44x4bfZ59IOBl990LpPYK6Uhro",
  authDomain: "predict-d5e7c.firebaseapp.com",
  databaseURL: "https://predict-d5e7c-default-rtdb.firebaseio.com",
  projectId: "predict-d5e7c",
  storageBucket: "predict-d5e7c.firebasestorage.app",
  messagingSenderId: "163893578547",
  appId: "1:163893578547:web:9df50f1abe53157b5f4c46",
  measurementId: "G-6L8GYDRNMB"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- Market Functions ---

export const subscribeToMarkets = (callback: (markets: Market[]) => void) => {
  const marketsRef = ref(db, 'markets');
  return onValue(marketsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      // Convert object to array
      const marketList = Object.keys(data).map(key => ({
        ...data[key],
        id: key
      }));
      callback(marketList);
    } else {
      callback([]);
    }
  });
};

export const seedDatabaseIfEmpty = async () => {
  const marketsRef = ref(db, 'markets');
  const snapshot = await get(marketsRef);
  if (!snapshot.exists()) {
    console.log("Seeding database...");
    MOCK_MARKETS.forEach(async (market) => {
        // We remove the ID because Firebase generates its own or we use a specific key
        // keeping it simple, we'll push new entries
        const newRef = push(marketsRef);
        await set(newRef, { ...market, id: newRef.key });
    });
  }
};

export const createMarket = async (marketData: Omit<Market, 'id' | 'chartData' | 'volume' | 'liquidity'>) => {
    console.log("Creating market with data:", marketData);
    const marketsRef = ref(db, 'markets');
    const newRef = push(marketsRef);
    
    // Generate simple mock chart data for the new market
    const generateChartData = (startPrice: number) => {
        let currentPrice = startPrice;
        const data = [];
        const now = new Date();
        for (let i = 24; i >= 0; i--) {
            const time = new Date(now.getTime() - i * 3600 * 1000);
            const change = (Math.random() - 0.5) * 0.05;
            currentPrice += change;
            currentPrice = Math.max(0.01, Math.min(0.99, currentPrice));
            data.push({ timestamp: time.toISOString(), value: Number(currentPrice.toFixed(2)) });
        }
        return data;
    };

    const newMarket: Market = {
        id: newRef.key as string,
        ...marketData,
        volume: 0,
        liquidity: 1000, // Initial liquidity seed
        chartData: generateChartData(marketData.yesPrice),
        isHot: true,
        status: 'OPEN'
    };

    await set(newRef, newMarket);
    console.log("Market created successfully:", newMarket.id);
    return newMarket;
};

export const deleteMarket = async (id: string) => {
    const marketRef = ref(db, `markets/${id}`);
    await remove(marketRef);
};

export const resolveMarket = async (id: string, outcome: 'YES' | 'NO') => {
    const marketRef = ref(db, `markets/${id}`);
    await update(marketRef, {
        status: 'RESOLVED',
        resolutionOutcome: outcome,
        yesPrice: outcome === 'YES' ? 1 : 0,
        noPrice: outcome === 'NO' ? 1 : 0
    });
};