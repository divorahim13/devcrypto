import React, { useState, useEffect, useMemo } from 'react';
import { Coin, PortfolioItem } from '../types';
import { Card, Button, Input, Badge } from './UI';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Wallet, Trash2, PlusCircle, TrendingUp, TrendingDown, DollarSign, X } from 'lucide-react';

interface PortfolioProps {
  coins: Coin[];
}

const Portfolio: React.FC<PortfolioProps> = ({ coins }) => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [selectedCoinId, setSelectedCoinId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  
  // Initialize selection when coins load
  useEffect(() => {
    if (coins.length > 0 && !selectedCoinId) {
        setSelectedCoinId(coins[0].id);
    }
  }, [coins, selectedCoinId]);

  useEffect(() => {
    const saved = localStorage.getItem('devcrypto_portfolio');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse portfolio", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('devcrypto_portfolio', JSON.stringify(items));
  }, [items]);

  const handleAdd = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    const coin = coins.find(c => c.id === selectedCoinId);
    if (!coin) return;

    // Check if we already have this coin, if so, average the buy price
    const existingItemIndex = items.findIndex(i => i.coinId === coin.id);
    
    if (existingItemIndex >= 0) {
        const existing = items[existingItemIndex];
        const newAmount = parseFloat(amount);
        const totalCost = (existing.amount * existing.buyPrice) + (newAmount * coin.current_price);
        const totalAmount = existing.amount + newAmount;
        const avgPrice = totalCost / totalAmount;

        const updatedItems = [...items];
        updatedItems[existingItemIndex] = {
            ...existing,
            amount: totalAmount,
            buyPrice: avgPrice
        };
        setItems(updatedItems);
    } else {
        const newItem: PortfolioItem = {
            id: Date.now().toString(),
            coinId: coin.id,
            symbol: coin.symbol,
            amount: parseFloat(amount),
            buyPrice: coin.current_price
        };
        setItems([...items, newItem]);
    }
    setAmount('');
  };

  const handleRemove = (id: string) => {
    if (window.confirm('Are you sure you want to remove this asset?')) {
        setItems(items.filter(i => i.id !== id));
    }
  };

  // Optimization: Memoize complex calculations
  const { totalValue, totalCost, profit, profitPercent, pieData } = useMemo(() => {
    let tVal = 0;
    let tCost = 0;

    const pData = items.reduce((acc: any[], item) => {
        const coin = coins.find(c => c.id === item.coinId);
        const currentPrice = coin?.current_price || item.buyPrice; // Fallback to buy price if API fails
        
        const val = item.amount * currentPrice;
        const cost = item.amount * item.buyPrice;
        
        tVal += val;
        tCost += cost;

        // Group for Pie Chart
        const existing = acc.find((x: any) => x.name === item.symbol.toUpperCase());
        if (existing) {
          existing.value += val;
        } else {
          acc.push({ name: item.symbol.toUpperCase(), value: val });
        }
        return acc;
    }, []);

    const prof = tVal - tCost;
    const profPct = tCost > 0 ? (prof / tCost) * 100 : 0;

    return { totalValue: tVal, totalCost: tCost, profit: prof, profitPercent: profPct, pieData: pData };
  }, [items, coins]);

  const COLORS = ['#3b82f6', '#0ecb81', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="flex flex-col p-5 border-l-4 border-primary-500 relative overflow-hidden group">
                <div className="absolute right-[-20px] top-[-20px] opacity-5 group-hover:opacity-10 transition-opacity">
                    <Wallet size={100} />
                </div>
                <span className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Net Worth</span>
                <span className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
            </Card>
            <Card className="flex flex-col p-5 border-l-4 border-gray-300 dark:border-gray-600">
                 <span className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Unrealized PnL</span>
                 <div className="flex items-center gap-2 mt-2">
                    <span className={`text-3xl font-bold ${profit >= 0 ? 'text-trade-up' : 'text-trade-down'}`}>
                        {profit >= 0 ? '+' : ''}{profit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                 </div>
            </Card>
            <Card className="flex flex-col p-5 border-l-4 border-gray-300 dark:border-gray-600">
                 <span className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Performance</span>
                 <div className="flex items-center gap-2 mt-2">
                     <span className={`text-3xl font-bold ${profitPercent >= 0 ? 'text-trade-up' : 'text-trade-down'}`}>
                        {profitPercent.toFixed(2)}%
                     </span>
                     {profitPercent >= 0 ? <TrendingUp size={24} className="text-trade-up"/> : <TrendingDown size={24} className="text-trade-down"/>}
                 </div>
            </Card>
        </div>

        {/* Action & List */}
        <Card>
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Wallet className="text-primary-600" size={20} /> Holdings
                </h3>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 items-end bg-gray-50 dark:bg-dark-bg/50 p-4 rounded-xl border border-gray-100 dark:border-dark-border shadow-inner">
                <div className="w-full">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 block uppercase">Asset</label>
                    <div className="relative">
                        <select 
                            value={selectedCoinId}
                            onChange={(e) => setSelectedCoinId(e.target.value)}
                            className="w-full bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border text-gray-900 dark:text-white text-sm rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            {coins.map(c => (
                                <option key={c.id} value={c.id}>{c.name} ({c.symbol.toUpperCase()})</option>
                            ))}
                        </select>
                    </div>
                </div>
                <Input 
                    label="Amount Added" 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                    placeholder="0.00"
                    className="rounded-lg"
                />
                <Button onClick={handleAdd} className="w-full md:w-auto rounded-lg h-[42px]">
                    <PlusCircle className="inline mr-2 w-4 h-4" /> Add
                </Button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-dark-border">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 dark:bg-dark-bg text-gray-500 dark:text-gray-400 text-xs font-bold uppercase border-b border-gray-200 dark:border-dark-border">
                    <tr>
                        <th className="p-4 pl-4">Asset</th>
                        <th className="p-4 text-right">Balance</th>
                        <th className="p-4 text-right">Avg Buy</th>
                        <th className="p-4 text-right">Value</th>
                        <th className="p-4 text-right">PnL</th>
                        <th className="p-4 text-right pr-4"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-dark-border text-sm">
                    {items.map(item => {
                        const coin = coins.find(c => c.id === item.coinId);
                        const currentPrice = coin?.current_price || 0;
                        const value = item.amount * currentPrice;
                        const itemCost = item.amount * item.buyPrice;
                        const itemPnL = value - itemCost;
                        const itemPnLPct = itemCost > 0 ? (itemPnL / itemCost) * 100 : 0;

                        return (
                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-dark-bg/50 transition-colors">
                                <td className="p-4 pl-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
                                            {coin ? <img src={coin.image} alt="" className="w-full h-full" /> : item.symbol[0]}
                                        </div>
                                        <span className="font-bold text-gray-900 dark:text-white">{item.symbol.toUpperCase()}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-right text-gray-600 dark:text-gray-300 font-mono">
                                    {item.amount.toLocaleString()}
                                </td>
                                <td className="p-4 text-right text-gray-500 dark:text-gray-400 font-mono text-xs">
                                    ${item.buyPrice.toLocaleString(undefined, {maximumFractionDigits: 2})}
                                </td>
                                <td className="p-4 text-right font-bold text-gray-900 dark:text-white font-mono">
                                    ${value.toLocaleString(undefined, {maximumFractionDigits: 2})}
                                </td>
                                <td className="p-4 text-right">
                                    <div className={`flex flex-col items-end ${itemPnL >= 0 ? 'text-trade-up' : 'text-trade-down'}`}>
                                        <span className="font-bold text-xs">
                                            {itemPnL >= 0 ? '+' : ''}{itemPnL.toLocaleString(undefined, {maximumFractionDigits: 2})}
                                        </span>
                                        <span className="text-[10px] bg-gray-100 dark:bg-gray-800 px-1.5 rounded mt-0.5">
                                            {itemPnLPct.toFixed(2)}%
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4 text-right pr-4">
                                    <button onClick={() => handleRemove(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    {items.length === 0 && (
                        <tr>
                            <td colSpan={6} className="p-12 text-center text-gray-400 text-sm flex flex-col items-center justify-center">
                                <Wallet size={48} className="mb-4 opacity-20" />
                                <p>Your portfolio is currently empty.</p>
                                <p className="text-xs mt-1">Add assets above to start tracking.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="h-full min-h-[400px] flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Asset Allocation</h3>
            <div className="flex-1 flex items-center justify-center min-h-[300px]">
                {items.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {pieData.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <RechartsTooltip 
                                formatter={(value: number) => `$${value.toLocaleString(undefined, {maximumFractionDigits: 0})}`}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="text-center text-gray-400">
                        <div className="w-40 h-40 rounded-full border-4 border-gray-100 dark:border-white/5 mx-auto mb-4 border-dashed"></div>
                        <span className="text-sm">No allocation data</span>
                    </div>
                )}
            </div>
            
            {/* Top Performer Logic */}
            {items.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-dark-border">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Portfolio Insights</p>
                    <div className="bg-primary-50 dark:bg-primary-900/10 p-3 rounded-lg flex items-start gap-3">
                         <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-full text-primary-600">
                            <DollarSign size={16} />
                         </div>
                         <div>
                            <p className="text-xs text-primary-700 dark:text-primary-300 font-medium leading-relaxed">
                                Diversification helps reduce risk. You currently hold {items.length} assets.
                            </p>
                         </div>
                    </div>
                </div>
            )}
        </Card>
      </div>
    </div>
  );
};

export default React.memo(Portfolio);