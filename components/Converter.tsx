import React, { useState, useEffect } from 'react';
import { Coin } from '../types';
import { Card, Input } from './UI';
import { ArrowDownUp, Settings, Wallet } from 'lucide-react';

interface ConverterProps {
  coins: Coin[];
}

const Converter: React.FC<ConverterProps> = ({ coins }) => {
  const [fromCoinId, setFromCoinId] = useState<string>(coins[0]?.id || '');
  const [toCoinId, setToCoinId] = useState<string>('usd'); // 'usd' represents fiat
  const [amount, setAmount] = useState<number>(1);
  const [isSwapping, setIsSwapping] = useState(false);

  // Quick helper to get price
  const getPrice = (id: string) => {
      if (id === 'usd') return 1;
      return coins.find(c => c.id === id)?.current_price || 0;
  };

  const fromCoin = coins.find(c => c.id === fromCoinId);
  const toCoin = coins.find(c => c.id === toCoinId); // Undefined if USD

  const result = (amount * getPrice(fromCoinId)) / getPrice(toCoinId);

  const handleSwapPositions = () => {
    setIsSwapping(true);
    const temp = fromCoinId;
    // Don't swap if one is USD and we are strictly crypto-to-crypto (optional logic, but allowed here)
    setFromCoinId(toCoinId === 'usd' ? coins[1]?.id || '' : toCoinId);
    setToCoinId(temp);
    setTimeout(() => setIsSwapping(false), 300);
  };

  const QuickSelect = ({ id, label }: { id: string, label: string }) => (
      <button 
        onClick={() => setFromCoinId(id)}
        className={`px-3 py-1 text-xs rounded-full border transition-all ${fromCoinId === id ? 'bg-primary-600 text-white border-primary-600' : 'bg-transparent text-gray-500 border-gray-200 dark:border-dark-border hover:border-primary-400'}`}
      >
          {label}
      </button>
  );

  return (
    <div className="max-w-xl mx-auto w-full">
        <Card className="shadow-xl border-0 dark:border dark:border-dark-border relative overflow-hidden">
             
             {/* Header */}
             <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white">Swap Assets</h3>
                 <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                     <Settings size={20} />
                 </button>
             </div>

             {/* Quick Select */}
             <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-none">
                <QuickSelect id="bitcoin" label="BTC" />
                <QuickSelect id="ethereum" label="ETH" />
                <QuickSelect id="solana" label="SOL" />
                <QuickSelect id="binancecoin" label="BNB" />
             </div>

             {/* From Input */}
             <div className="bg-gray-50 dark:bg-dark-bg/50 p-4 rounded-2xl border border-gray-100 dark:border-dark-border hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                <div className="flex justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Pay</span>
                    <span className="text-xs font-semibold text-primary-600 cursor-pointer">Max: --</span>
                </div>
                <div className="flex items-center gap-4">
                    <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                        className="bg-transparent text-3xl font-bold text-gray-900 dark:text-white focus:outline-none w-full placeholder-gray-300"
                        placeholder="0"
                    />
                    <div className="shrink-0 relative">
                        <select 
                            value={fromCoinId}
                            onChange={(e) => setFromCoinId(e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        >
                            {coins.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                             <option value="usd">USD</option>
                        </select>
                        <div className="flex items-center gap-2 bg-white dark:bg-dark-surface py-2 px-3 rounded-xl shadow-sm border border-gray-200 dark:border-dark-border min-w-[120px]">
                            {fromCoin ? <img src={fromCoin.image} className="w-6 h-6 rounded-full"/> : <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">$</div>}
                            <span className="font-bold text-sm text-gray-900 dark:text-white uppercase truncate">{fromCoin ? fromCoin.symbol : 'USD'}</span>
                        </div>
                    </div>
                </div>
                <div className="text-right text-xs text-gray-400 mt-2">
                    ≈ ${ (amount * getPrice(fromCoinId)).toLocaleString() }
                </div>
             </div>

             {/* Swap Switcher */}
             <div className="flex justify-center -my-3 relative z-10">
                 <button 
                    onClick={handleSwapPositions}
                    className={`p-2 rounded-xl bg-white dark:bg-dark-surface border-4 border-white dark:border-dark-bg text-primary-600 shadow-md transition-transform duration-300 ${isSwapping ? 'rotate-180' : ''}`}
                 >
                     <ArrowDownUp size={20} />
                 </button>
             </div>

             {/* To Input (Read Onlyish) */}
             <div className="bg-gray-50 dark:bg-dark-bg/50 p-4 rounded-2xl border border-gray-100 dark:border-dark-border hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                <div className="flex justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Receive</span>
                </div>
                <div className="flex items-center gap-4">
                    <input 
                        type="text" 
                        value={result.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                        readOnly
                        className="bg-transparent text-3xl font-bold text-gray-900 dark:text-white focus:outline-none w-full placeholder-gray-300"
                    />
                    <div className="shrink-0 relative">
                        <select 
                            value={toCoinId}
                            onChange={(e) => setToCoinId(e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        >
                            <option value="usd">USD</option>
                            {coins.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <div className="flex items-center gap-2 bg-white dark:bg-dark-surface py-2 px-3 rounded-xl shadow-sm border border-gray-200 dark:border-dark-border min-w-[120px]">
                            {toCoin ? <img src={toCoin.image} className="w-6 h-6 rounded-full"/> : <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">$</div>}
                            <span className="font-bold text-sm text-gray-900 dark:text-white uppercase truncate">{toCoin ? toCoin.symbol : 'USD'}</span>
                        </div>
                    </div>
                </div>
                <div className="text-right text-xs text-gray-400 mt-2">
                    1 {fromCoin ? fromCoin.symbol.toUpperCase() : 'USD'} = {(getPrice(fromCoinId)/getPrice(toCoinId)).toLocaleString()} {toCoin ? toCoin.symbol.toUpperCase() : 'USD'}
                </div>
             </div>

             {/* Action Button */}
             <button className="w-full mt-6 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-primary-600/20 transition-all hover:-translate-y-1">
                 {fromCoinId === 'usd' ? 'Buy Crypto' : toCoinId === 'usd' ? 'Sell to Fiat' : 'Swap Assets'}
             </button>

        </Card>
    </div>
  );
};

export default Converter;