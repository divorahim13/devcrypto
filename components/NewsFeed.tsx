import React from 'react';
import { NewsItem } from '../types';
import { Card } from './UI';
import { ExternalLink, Clock } from 'lucide-react';

interface NewsFeedProps {
  news: NewsItem[];
}

const NewsFeed: React.FC<NewsFeedProps> = ({ news }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {news.map((item) => (
        <Card key={item.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold tracking-wider text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded-full uppercase">
                {item.category}
            </span>
            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                <Clock size={10} /> {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
          </div>
          <h4 className="text-base font-bold text-gray-900 dark:text-white leading-snug mb-3 flex-grow line-clamp-2">
            {item.title}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed">
            {item.summary}
          </p>
          <div className="mt-auto flex justify-between items-center pt-3 border-t border-gray-100 dark:border-dark-border">
            <span className="text-xs font-semibold text-gray-400">{item.source}</span>
            <a href={item.url} className="text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1 text-xs font-medium">
                Read More <ExternalLink size={12} />
            </a>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default NewsFeed;