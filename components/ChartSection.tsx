import React, { useState, useMemo } from 'react';
import { Coin, TimeFrame } from '../types';
import { Card, Badge } from './UI';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';

interface ChartSectionProps {
  coin: Coin;
}

const ChartSection: React.FC<ChartSectionProps> = ({ coin }) => {
  const [timeframe, setTimeframe] = useState<TimeFrame>('24H');

  // Optimization: Memoize data generation based on timeframe
  const { data, minPrice, maxPrice } = useMemo(() => {
    // Robust fallback: if sparkline is missing, create a single point to prevent crash
    const rawPrices = coin.sparkline_in_7d?.price || [coin.current_price]; 
    const currentPrice = coin.current_price;
    const now = Date.now();
    
    let generatedData: { time: number; price: number }[] = [];

    // Helper for generating synthetic data that connects to current price
    const generateSynthetic = (points: number, durationMs: number, volatility: number) => {
        const arr = [];
        let price = currentPrice;
        const interval = durationMs / points;

        // Add current point
        arr.push({ time: now, price: price });

        for (let i = 1; i < points; i++) {
            // Random walk backwards
            const change = 1 + (Math.random() * volatility * 2 - volatility);
            price = price / change; 
            arr.unshift({
                time: now - (i * interval),
                price: price
            });
        }
        return arr;
    };

    if (timeframe === '1H') {
        generatedData = generateSynthetic(60, 3600 * 1000, 0.0008);
    } 
    else if (timeframe === '24H') {
        if (rawPrices.length >= 24) {
            const sliced = rawPrices.slice(-24);
            generatedData = sliced.map((p, i) => ({
                time: now - (sliced.length - 1 - i) * 3600 * 1000,
                price: p
            }));
        } else {
            generatedData = generateSynthetic(24, 24 * 3600 * 1000, 0.003);
        }
    } 
    else if (timeframe === '7D') {
        if (rawPrices.length > 0) {
            generatedData = rawPrices.map((p, i) => ({
                time: now - (rawPrices.length - 1 - i) * 3600 * 1000,
                price: p
            }));
        } else {
            generatedData = generateSynthetic(168, 7 * 24 * 3600 * 1000, 0.005);
        }
    } 
    else if (timeframe === '30D') {
        generatedData = generateSynthetic(30, 30 * 24 * 3600 * 1000, 0.015);
    } 
    else if (timeframe === '1Y') {
        generatedData = generateSynthetic(52, 365 * 24 * 3600 * 1000, 0.04);
    }

    // Safety check: ensure we have at least 2 points for a line
    if (generatedData.length < 2) {
        generatedData = [
            { time: now - 3600000, price: currentPrice },
            { time: now, price: currentPrice }
        ];
    }

    const prices = generatedData.map(d => d.price);
    return {
        data: generatedData,
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices)
    };
  }, [coin.id, coin.sparkline_in_7d, coin.current_price, timeframe]);

  const isPositive = coin.price_change_percentage_24h >= 0;
  const chartIsPositive = data.length > 0 ? data[data.length - 1].price >= data[0].price : isPositive;
  const chartColor = chartIsPositive ? '#0ecb81' : '#f6465d';

  const formatXAxis = (tick: number) => {
    const date = new Date(tick);
    if (timeframe === '1H' || timeframe === '24H') return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    if (timeframe === '7D') return date.toLocaleDateString([], {weekday: 'short'});
    if (timeframe === '30D') return date.toLocaleDateString([], {month: 'short', day: 'numeric'});
    if (timeframe === '1Y') return date.toLocaleDateString([], {month: 'short', year: '2-digit'});
    return date.toLocaleDateString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border p-3 shadow-lg rounded-lg backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 z-50">
          <p className="text-gray-500 dark:text-gray-400 text-xs mb-1 font-mono">{new Date(label).toLocaleString()}</p>
          <div className="flex items-center gap-2">
             <div className={`w-2 h-2 rounded-full ${chartIsPositive ? 'bg-trade-up' : 'bg-trade-down'}`}></div>
             <p className="text-gray-900 dark:text-white font-bold text-lg font-mono">
                ${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
             </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="flex flex-col relative overflow-hidden transition-all duration-300 min-h-[500px]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 relative z-10">
        <div className="flex items-center gap-4">
            <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 shadow-inner">
                <img src={coin.image} alt={coin.name} className="w-10 h-10" loading="lazy" />
            </div>
            <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-baseline gap-2">
                    {coin.name} 
                    <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">{coin.symbol}</span>
                </h3>
                <div className="flex items-center gap-3 mt-1">
                    <span className="font-mono text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                        ${coin.current_price.toLocaleString()}
                    </span>
                    <Badge type={isPositive ? 'success' : 'danger'}>
                        {coin.price_change_percentage_24h.toFixed(2)}% (24h)
                    </Badge>
                </div>
            </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
             <div className="flex gap-1 bg-gray-100 dark:bg-dark-bg p-1 rounded-lg border border-gray-200 dark:border-dark-border">
                {(['1H', '24H', '7D', '30D', '1Y'] as TimeFrame[]).map((tf) => (
                    <button
                        key={tf}
                        onClick={() => setTimeframe(tf)}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all duration-200 ${
                            timeframe === tf 
                            ? 'bg-white dark:bg-dark-surface text-primary-600 dark:text-white shadow-sm ring-1 ring-gray-200 dark:ring-gray-700' 
                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-white/5'
                        }`}
                    >
                    {tf}
                    </button>
                ))}
            </div>
            <div className="flex gap-4 text-xs font-mono text-gray-500 dark:text-gray-400">
                <span>H: <span className="text-gray-900 dark:text-white font-bold">${maxPrice.toLocaleString()}</span></span>
                <span>L: <span className="text-gray-900 dark:text-white font-bold">${minPrice.toLocaleString()}</span></span>
            </div>
        </div>
      </div>

      {/* FIXED HEIGHT CONTAINER for Recharts stability */}
      <div className="w-full h-[360px] relative mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.25}/>
                <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.1} />
            <XAxis 
                dataKey="time" 
                tickFormatter={formatXAxis}
                stroke="#94a3b8"
                tick={{fontSize: 11, fill: '#94a3b8'}}
                tickLine={false}
                axisLine={false}
                minTickGap={40}
                dy={10}
            />
            <YAxis 
                domain={['auto', 'auto']}
                orientation="right"
                stroke="#94a3b8"
                tickFormatter={(val) => `$${val.toLocaleString()}`}
                tick={{fontSize: 11, fill: '#94a3b8'}}
                tickLine={false}
                axisLine={false}
                width={65}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <ReferenceLine y={maxPrice} stroke="#94a3b8" strokeDasharray="3 3" opacity={0.2} />
            <ReferenceLine y={minPrice} stroke="#94a3b8" strokeDasharray="3 3" opacity={0.2} />

            <Area 
                type="monotone" 
                dataKey="price" 
                stroke={chartColor}
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#colorPrice)" 
                animationDuration={1000}
                animationEasing="ease-in-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default React.memo(ChartSection);
