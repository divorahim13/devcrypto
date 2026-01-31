import React, { useEffect, useState, useCallback, useRef } from 'react';
import { fetchCoins, fetchNews } from './services/cryptoService';
import { Coin, NewsItem } from './types';
import Dashboard from './components/Dashboard';
import ChartSection from './components/ChartSection';
import Portfolio from './components/Portfolio';
import Converter from './components/Converter';
import NewsFeed from './components/NewsFeed';
import LandingPage from './components/LandingPage';
import { LayoutDashboard, Wallet, Calculator, Newspaper, Sun, Moon, RefreshCw, BarChart2 } from 'lucide-react';

type AppTab = 'market' | 'portfolio' | 'converter' | 'news';

const App: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>('market');
  
  // Loading states
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode for cyberpunk feel
  const [showLanding, setShowLanding] = useState(true);
  
  // Refs to prevent closure staleness in intervals without resetting them
  const isRefreshingRef = useRef(isRefreshing);
  isRefreshingRef.current = isRefreshing;

  // --- Data Fetching ---

  const getMarketData = useCallback(async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const data = await fetchCoins();
      setCoins(prevCoins => {
        return data;
      });
    } catch (e) {
      console.error("Market data fetch failed:", e);
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  }, []);

  const getNewsData = useCallback(async () => {
    try {
      const data = await fetchNews();
      if (data.length > 0) setNews(data);
    } catch (e) {
      console.error("News fetch failed:", e);
    }
  }, []);

  // --- Effects ---

  // Initial Load
  useEffect(() => {
    const init = async () => {
      await Promise.all([getMarketData(true), getNewsData()]);
      setIsInitialLoading(false);
    };
    init();
  }, [getMarketData, getNewsData]);

  // Set initial selected coin once coins are loaded
  useEffect(() => {
    if (!selectedCoin && coins.length > 0) {
      setSelectedCoin(coins[0]);
    }
  }, [coins, selectedCoin]);

  // Intervals
  useEffect(() => {
    // Market Data: Every 45s (Safe for free tier)
    const marketInterval = setInterval(() => {
      if (!isRefreshingRef.current) {
        getMarketData();
      }
    }, 45000);

    // News Data: Every 5 minutes
    const newsInterval = setInterval(() => {
      getNewsData();
    }, 300000);

    return () => {
      clearInterval(marketInterval);
      clearInterval(newsInterval);
    };
  }, [getMarketData, getNewsData]);

  // Theme Toggle
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle routing from landing page
  const handleEnterApp = (targetTab: AppTab = 'market') => {
    setActiveTab(targetTab);
    setShowLanding(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-primary-700 dark:text-primary-400 font-medium animate-pulse">Initializing DEVCRYPTO...</p>
        </div>
      </div>
    );
  }

  if (showLanding) {
      return (
          <>
            <div className="absolute top-4 right-4 z-50">
                <button 
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2 rounded-full bg-white dark:bg-dark-surface shadow-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
            <LandingPage onEnter={handleEnterApp} />
          </>
      );
  }

  return (
    <div className="min-h-screen font-sans bg-gray-50 dark:bg-dark-bg transition-colors duration-200 flex flex-col">
      
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-border shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowLanding(true)}>
             <div className="bg-primary-600 text-white p-1.5 rounded-lg">
                <BarChart2 size={24} />
             </div>
             <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                DEV<span className="text-primary-600">CRYPTO</span>
             </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-1 bg-gray-100 dark:bg-dark-bg p-1 rounded-lg">
            <TabButton active={activeTab === 'market'} onClick={() => setActiveTab('market')}>Market</TabButton>
            <TabButton active={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')}>Portfolio</TabButton>
            <TabButton active={activeTab === 'converter'} onClick={() => setActiveTab('converter')}>Swap</TabButton>
            <TabButton active={activeTab === 'news'} onClick={() => setActiveTab('news')}>News</TabButton>
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 mr-2">
                <span className={`w-2 h-2 rounded-full mr-2 ${isRefreshing ? 'bg-yellow-400' : 'bg-green-500'}`}></span>
                {isRefreshing ? 'Syncing...' : 'Live'}
            </div>
            <button
                onClick={() => getMarketData()}
                disabled={isRefreshing}
                className="p-2 rounded-md text-gray-500 hover:text-primary-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-bg transition-colors disabled:opacity-50"
                title="Force Refresh"
            >
                <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
            <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-md text-gray-500 hover:text-primary-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-bg transition-colors"
                title="Toggle Theme"
            >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl flex-grow">
        
        {activeTab === 'market' && (
            <div className="space-y-6 animate-fade-in">
                {selectedCoin && <ChartSection coin={selectedCoin} />}
                <Dashboard coins={coins} onSelectCoin={(coin) => {
                    setSelectedCoin(coin);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }} />
            </div>
        )}

        {activeTab === 'portfolio' && (
            <div className="animate-fade-in">
                <Portfolio coins={coins} />
            </div>
        )}

        {activeTab === 'converter' && (
             <div className="py-8 animate-fade-in flex justify-center items-start">
                <Converter coins={coins} />
             </div>
        )}

        {activeTab === 'news' && (
            <div className="animate-fade-in">
                <div className="flex items-center gap-2 mb-6 border-b border-gray-200 dark:border-dark-border pb-4">
                    <Newspaper className="text-primary-600" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Market Intel</h2>
                </div>
                <NewsFeed news={news} />
            </div>
        )}

      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-dark-surface/90 backdrop-blur-md border-t border-gray-200 dark:border-dark-border flex justify-around p-3 z-50 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <MobileTab active={activeTab === 'market'} onClick={() => setActiveTab('market')} icon={<LayoutDashboard size={24}/>} label="Market" />
            <MobileTab active={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')} icon={<Wallet size={24}/>} label="Wallet" />
            <MobileTab active={activeTab === 'converter'} onClick={() => setActiveTab('converter')} icon={<Calculator size={24}/>} label="Swap" />
            <MobileTab active={activeTab === 'news'} onClick={() => setActiveTab('news')} icon={<Newspaper size={24}/>} label="News" />
      </div>
      
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button 
        onClick={onClick}
        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${active ? 'bg-white dark:bg-dark-surface text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-200 dark:ring-dark-border' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-bg/50'}`}
    >
        {children}
    </button>
);

const MobileTab: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center gap-1 ${active ? 'text-primary-600' : 'text-gray-400'}`}
    >
        {icon}
        <span className="text-[10px] font-medium">{label}</span>
    </button>
);

export default App;