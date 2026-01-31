import { Coin, NewsItem } from '../types';

// --- CACHING SYSTEM ---
interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const CACHE_DURATION = 60 * 1000; // 1 minute cache for markets
const NEWS_CACHE_DURATION = 5 * 60 * 1000; // 5 minute cache for news

const cache = {
  coins: null as CacheItem<Coin[]> | null,
  news: null as CacheItem<NewsItem[]> | null,
};

// --- MOCK DATA FALLBACK ---
// We initialize this with some static data, but it will "move" in simulation mode
let mockCoinsState: any[] = [
    { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', price: 64230.50, change: 2.4 },
    { id: 'ethereum', symbol: 'eth', name: 'Ethereum', price: 3450.20, change: -1.2 },
    { id: 'solana', symbol: 'sol', name: 'Solana', price: 145.80, change: 5.6 },
    { id: 'binancecoin', symbol: 'bnb', name: 'BNB', price: 590.10, change: 0.5 },
    { id: 'ripple', symbol: 'xrp', name: 'XRP', price: 0.62, change: -0.8 },
    { id: 'cardano', symbol: 'ada', name: 'Cardano', price: 0.45, change: 1.1 },
    { id: 'avalanche-2', symbol: 'avax', name: 'Avalanche', price: 35.40, change: 4.2 },
    { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin', price: 0.16, change: -2.5 },
    { id: 'polkadot', symbol: 'dot', name: 'Polkadot', price: 7.20, change: 0.9 },
    { id: 'chainlink', symbol: 'link', name: 'Chainlink', price: 14.50, change: 3.1 },
    { id: 'polygon', symbol: 'matic', name: 'Polygon', price: 0.72, change: -1.5 },
    { id: 'shiba-inu', symbol: 'shib', name: 'Shiba Inu', price: 0.000024, change: -3.0 },
    { id: 'near', symbol: 'near', name: 'NEAR Protocol', price: 6.80, change: 6.7 },
    { id: 'uniswap', symbol: 'uni', name: 'Uniswap', price: 7.90, change: 1.2 },
    { id: 'litecoin', symbol: 'ltc', name: 'Litecoin', price: 82.40, change: 0.4 },
    { id: 'pepe', symbol: 'pepe', name: 'Pepe', price: 0.000007, change: 12.5 },
    { id: 'aptos', symbol: 'apt', name: 'Aptos', price: 9.20, change: -2.1 },
    { id: 'arbitrum', symbol: 'arb', name: 'Arbitrum', price: 1.12, change: 0.8 },
    { id: 'render-token', symbol: 'rndr', name: 'Render', price: 10.50, change: 8.4 },
    { id: 'fetch-ai', symbol: 'fet', name: 'Fetch.ai', price: 2.30, change: 5.5 },
];

const simulateMarketMovement = () => {
    mockCoinsState = mockCoinsState.map(coin => {
        const volatility = 0.005; // 0.5% volatility per tick
        const changeFactor = 1 + (Math.random() * volatility * 2 - volatility);
        const newPrice = coin.price * changeFactor;
        
        // Randomly adjust the 24h change slightly to make it look live
        const changeDiff = (changeFactor - 1) * 100 + (Math.random() * 0.1 - 0.05);
        
        return { ...coin, price: newPrice, change: coin.change + changeDiff };
    });
};

const generateMockCoins = (): Coin[] => {
  return mockCoinsState.map((c, index) => ({
    id: c.id,
    symbol: c.symbol,
    name: c.name,
    image: `https://picsum.photos/seed/${c.id}/64/64`, // Deterministic random image
    current_price: c.price,
    market_cap: c.price * 1000000 * (19000000 - index * 500000),
    market_cap_rank: index + 1,
    fully_diluted_valuation: null,
    total_volume: c.price * 50000 * (0.8 + Math.random() * 0.4),
    high_24h: c.price * 1.05,
    low_24h: c.price * 0.95,
    price_change_24h: c.price * (c.change / 100),
    price_change_percentage_24h: c.change,
    market_cap_change_24h: 0,
    market_cap_change_percentage_24h: 0,
    circulating_supply: 19000000,
    total_supply: 21000000,
    max_supply: 21000000,
    ath: c.price * 1.5,
    ath_change_percentage: -30,
    ath_date: '2021-11-10T00:00:00.000Z',
    atl: c.price * 0.1,
    atl_change_percentage: 900,
    atl_date: '2015-10-20T00:00:00.000Z',
    roi: null,
    last_updated: new Date().toISOString(),
    sparkline_in_7d: {
      price: Array.from({ length: 50 }, (_, i) => 
        c.price * (1 + Math.sin(i / 5 + index) * 0.05 + (Math.random() * 0.02 - 0.01))
      )
    }
  }));
};

const getMockNews = (): NewsItem[] => [
    {
      id: '1',
      title: 'Simulation: Bitcoin Breaks Key Resistance Level',
      summary: 'Data fetch failed or rate limited. Running in simulation mode. BTC has surged past the $64k mark as institutional interest grows.',
      source: 'System',
      url: '#',
      timestamp: new Date().toISOString(),
      category: 'Market'
    },
    {
      id: '2',
      title: 'Simulation: Ethereum Upgrade Scheduled',
      summary: 'Developers have confirmed the next major network upgrade. Gas fees expected to stabilize.',
      source: 'DevTeam',
      url: '#',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      category: 'Tech'
    },
    {
      id: '3',
      title: 'Simulation: Regulatory Framework Discussed',
      summary: 'Global leaders convene to discuss the future of digital asset taxation and classification.',
      source: 'PolicyWatch',
      url: '#',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      category: 'Regulation'
    },
    {
        id: '4',
        title: 'Simulation: New Layer 2 Solution Launches',
        summary: 'A new scaling solution for Ethereum has gone live mainnet, promising 100x lower fees.',
        source: 'CryptoWire',
        url: '#',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        category: 'Tech'
    }
];

// --- REAL API IMPLEMENTATION ---

export const fetchCoins = async (forceRefresh = false): Promise<Coin[]> => {
  try {
    const now = Date.now();

    // Return cached data if valid and not forced
    if (!forceRefresh && cache.coins && (now - cache.coins.timestamp < CACHE_DURATION)) {
      return cache.coins.data;
    }

    // CoinGecko API
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=24h',
      { 
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      }
    );

    if (!response.ok) {
        if (response.status === 429) {
            console.warn("CoinGecko Rate Limit exceeded. Switching to simulation.");
            // If we have stale cache, use it instead of random simulation for better UX
            if (cache.coins) return cache.coins.data;
        }
        throw new Error(`API Error: ${response.status}`);
    }

    const rawData = await response.json();

    // SANITIZATION: Ensure sparkline data exists even if API returns null for it
    const data = rawData.map((coin: any, index: number) => {
        if (!coin.sparkline_in_7d || !coin.sparkline_in_7d.price || coin.sparkline_in_7d.price.length === 0) {
            // Generate synthetic chart data based on current price if missing
            return {
                ...coin,
                sparkline_in_7d: {
                    price: Array.from({ length: 48 }, (_, i) => 
                        coin.current_price * (1 + Math.sin(i / 4) * 0.02 + (Math.random() * 0.04 - 0.02))
                    )
                }
            };
        }
        return coin;
    });
    
    // Update Cache
    cache.coins = {
      data: data,
      timestamp: now
    };

    return data;

  } catch (error) {
    console.warn("Failed to fetch real data, using fallback:", error);
    simulateMarketMovement(); // Update mock prices
    return generateMockCoins();
  }
};

export const fetchNews = async (): Promise<NewsItem[]> => {
  try {
    const now = Date.now();
    if (cache.news && (now - cache.news.timestamp < NEWS_CACHE_DURATION)) {
      return cache.news.data;
    }

    // Using CryptoCompare News API (Stable/Free)
    const response = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN');
    
    if (!response.ok) throw new Error('News API failed');
    
    const json = await response.json();
    
    const data = json.Data.slice(0, 12).map((item: any) => ({
      id: item.id,
      title: item.title,
      summary: item.body,
      source: item.source_info.name,
      url: item.url,
      timestamp: new Date(item.published_on * 1000).toISOString(),
      category: mapCategory(item.categories)
    }));

    cache.news = { data, timestamp: now };
    return data;

  } catch (error) {
    console.warn("Failed to fetch news, using fallback:", error);
    return getMockNews();
  }
};

function mapCategory(categories: string): 'Market' | 'Tech' | 'Regulation' {
    const cat = categories.toLowerCase();
    if (cat.includes('regulation') || cat.includes('legal') || cat.includes('ban') || cat.includes('tax')) return 'Regulation';
    if (cat.includes('tech') || cat.includes('blockchain') || cat.includes('mining') || cat.includes('software')) return 'Tech';
    return 'Market';
}