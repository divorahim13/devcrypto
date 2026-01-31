import React, { useState, useMemo } from 'react';
import { Coin } from '../types';
import { Card, Input } from './UI';
import { TrendingUp, TrendingDown, Search, ArrowUp, ArrowDown } from 'lucide-react';
import { AreaChart, Area } from 'recharts'; // Removed ResponsiveContainer for mini charts

interface DashboardProps {
  coins: Coin[];
  onSelectCoin: (coin: Coin) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ coins, onSelectCoin }) => {
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Coin; direction: 'asc' | 'desc' } | null>(null);

  const formatCurrency = (val: number) => {
    const maxDigits = val < 1 ? 6 : 2;
    return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: maxDigits 
    }).format(val);
  };

  const formatCompact = (val: number) => {
      return new Intl.NumberFormat('en-US', {
          notation: "compact",
          compactDisplay: "short",
          maximumFractionDigits: 2
      }).format(val);
  };

  const handleSort = (key: keyof Coin) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredCoins = useMemo(() => {
    let result = coins.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) || 
      c.symbol.toLowerCase().includes(search.toLowerCase())
    );

    if (sortConfig) {
      result.sort((a, b) => {
        // @ts-ignore
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        // @ts-ignore
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [coins, search, sortConfig]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Market Overview</h2>
        <div className="w-full md:w-1/3 relative">
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
            <Input 
                placeholder="Search Assets..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-4 pr-10"
            />
        </div>
      </div>

      <Card noPadding className="overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 dark:bg-dark-bg text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider border-b border-gray-200 dark:border-dark-border">
            <tr>
              <SortableHeader label="#" onClick={() => handleSort('market_cap_rank')} sortKey="market_cap_rank" currentSort={sortConfig} className="w-16 pl-6" />
              <SortableHeader label="Asset" onClick={() => handleSort('name')} sortKey="name" currentSort={sortConfig} />
              <SortableHeader label="Price" align="right" onClick={() => handleSort('current_price')} sortKey="current_price" currentSort={sortConfig} />
              <SortableHeader label="24h Change" align="right" onClick={() => handleSort('price_change_percentage_24h')} sortKey="price_change_percentage_24h" currentSort={sortConfig} />
              <th className="p-4 text-center hidden md:table-cell w-32">Last 7 Days</th>
              <SortableHeader label="Market Cap" align="right" className="hidden lg:table-cell" onClick={() => handleSort('market_cap')} sortKey="market_cap" currentSort={sortConfig} />
              <SortableHeader label="Vol (24h)" align="right" className="hidden xl:table-cell" onClick={() => handleSort('total_volume')} sortKey="total_volume" currentSort={sortConfig} />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
            {filteredCoins.map((coin) => (
              <tr 
                key={coin.id} 
                className="hover:bg-gray-50 dark:hover:bg-dark-bg/50 transition-colors cursor-pointer group"
                onClick={() => onSelectCoin(coin)}
              >
                <td className="p-4 pl-6 text-sm text-gray-500 dark:text-gray-400 font-mono w-16">{coin.market_cap_rank}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                        <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full bg-white shadow-sm" loading="lazy" />
                        {coin.market_cap_rank <= 3 && (
                             <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white dark:border-dark-surface"></div>
                        )}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-primary-600 transition-colors">{coin.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">{coin.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-right text-sm font-bold text-gray-900 dark:text-white font-mono">
                    {formatCurrency(coin.current_price)}
                </td>
                <td className="p-4 text-right">
                  <div className={`flex items-center justify-end gap-1 text-sm font-medium ${coin.price_change_percentage_24h >= 0 ? 'text-trade-up' : 'text-trade-down'}`}>
                    {coin.price_change_percentage_24h >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                  </div>
                </td>
                
                {/* Mini Sparkline Chart: Fixed width/height, removed ResponsiveContainer for stability in tables */}
                <td className="p-2 hidden md:table-cell w-32">
                    {coin.sparkline_in_7d && (
                        <div className="flex justify-center">
                             <AreaChart width={112} height={40} data={coin.sparkline_in_7d.price.map((p, i) => ({ i, p }))}>
                                <defs>
                                    <linearGradient id={`gradient-${coin.id}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={coin.price_change_percentage_24h >= 0 ? '#0ecb81' : '#f6465d'} stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor={coin.price_change_percentage_24h >= 0 ? '#0ecb81' : '#f6465d'} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <Area 
                                    type="monotone" 
                                    dataKey="p" 
                                    stroke={coin.price_change_percentage_24h >= 0 ? '#0ecb81' : '#f6465d'} 
                                    strokeWidth={1.5} 
                                    fill={`url(#gradient-${coin.id})`}
                                    isAnimationActive={false}
                                />
                            </AreaChart>
                        </div>
                    )}
                </td>

                <td className="p-4 text-right text-sm text-gray-600 dark:text-gray-300 hidden lg:table-cell font-mono">
                    ${formatCompact(coin.market_cap)}
                </td>
                <td className="p-4 text-right text-sm text-gray-600 dark:text-gray-300 hidden xl:table-cell font-mono">
                    ${formatCompact(coin.total_volume)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

const SortableHeader = ({ label, align = 'left', className = '', onClick, sortKey, currentSort }: any) => {
    const isActive = currentSort?.key === sortKey;
    return (
        <th 
            className={`p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 transition-colors select-none ${align === 'right' ? 'text-right' : 'text-left'} ${className}`} 
            onClick={onClick}
        >
            <div className={`flex items-center gap-1 ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
                {label}
                <div className="flex flex-col w-3">
                    {isActive ? (
                        currentSort.direction === 'asc' ? <ArrowUp size={12} className="text-primary-600"/> : <ArrowDown size={12} className="text-primary-600"/>
                    ) : (
                        <div className="h-3 w-3" /> 
                    )}
                </div>
            </div>
        </th>
    );
};

export default React.memo(Dashboard);