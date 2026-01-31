import React from 'react';
import { Button } from './UI';
import { ArrowRight, BarChart3, ShieldCheck, Zap, LayoutDashboard, Globe, ChevronRight, Layers } from 'lucide-react';

interface LandingPageProps {
  onEnter: (tab?: 'market' | 'portfolio' | 'converter' | 'news') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  
  const scrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('features');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b1221] text-gray-900 dark:text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden transition-colors duration-300">
      
      {/* Navbar */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter cursor-pointer" onClick={() => onEnter('market')}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <Layers size={20} />
          </div>
          <span>DEV<span className="text-indigo-600">CRYPTO</span></span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600 dark:text-gray-400">
          <a href="#features" onClick={scrollToFeatures} className="hover:text-indigo-600 dark:hover:text-white transition-colors cursor-pointer">Features</a>
          <button onClick={() => onEnter('market')} className="hover:text-indigo-600 dark:hover:text-white transition-colors">Markets</button>
          <button onClick={() => onEnter('news')} className="hover:text-indigo-600 dark:hover:text-white transition-colors">News</button>
        </div>
        <Button size="sm" onClick={() => onEnter('market')} className="rounded-full px-6">Launch App</Button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        
        {/* Web3 Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
           {/* Grid */}
           <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.1]" style={{
               backgroundImage: 'linear-gradient(90deg, #6366f1 1px, transparent 1px), linear-gradient(180deg, #6366f1 1px, transparent 1px)',
               backgroundSize: '40px 40px'
           }}></div>
           <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-[#0b1221]"></div>
           
           {/* Orbs */}
           <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/30 rounded-full blur-[128px] mix-blend-multiply dark:mix-blend-screen animate-pulse"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[128px] mix-blend-multiply dark:mix-blend-screen animate-pulse delay-700"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-indigo-100 dark:border-white/10 backdrop-blur-md shadow-sm transition-transform hover:scale-105 cursor-default group">
             <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
             </span>
             <span className="text-sm font-medium bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                The Next Gen Crypto Interface
             </span>
             <ChevronRight size={14} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            Decentralized Data. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 animate-gradient-x">
              Unified Vision.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Access institutional-grade crypto analytics with a privacy-first architecture. No sign-ups, no tracking, just pure data.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <button 
                onClick={() => onEnter('market')}
                className="group relative px-8 py-4 bg-indigo-600 text-white font-bold text-lg rounded-full shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all hover:-translate-y-1 overflow-hidden"
            >
                <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 -skew-x-12"></div>
                <span className="relative flex items-center gap-2">
                    Enter Dashboard <ArrowRight size={20} />
                </span>
            </button>
            
            <button 
                onClick={() => onEnter('portfolio')}
                className="px-8 py-4 bg-white dark:bg-white/5 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 font-bold text-lg rounded-full hover:bg-gray-50 dark:hover:bg-white/10 transition-all backdrop-blur-sm"
            >
                Manage Portfolio
            </button>
          </div>

          {/* 3D/Glass Dashboard Preview */}
          <div className="relative mx-auto max-w-6xl perspective-1000">
             {/* Glow behind preview */}
             <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/20 to-transparent blur-3xl -z-10 transform translate-y-20"></div>
             
             <div className="relative rounded-2xl border border-gray-200 dark:border-white/10 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl shadow-2xl p-2 transform md:rotate-x-12 hover:rotate-x-0 transition-transform duration-700 ease-out cursor-pointer" onClick={() => onEnter('market')}>
                 <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#0f172a] aspect-[16/10] relative group">
                    
                    {/* Fake UI Header */}
                    <div className="h-14 border-b border-gray-200 dark:border-white/5 flex items-center px-6 justify-between bg-white/50 dark:bg-white/5">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                        </div>
                        <div className="h-2 w-32 bg-gray-200 dark:bg-white/10 rounded-full"></div>
                    </div>

                    {/* Fake UI Content */}
                    <div className="p-8 grid grid-cols-12 gap-6 h-full">
                        {/* Sidebar */}
                        <div className="hidden md:block col-span-2 space-y-4">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="h-8 w-full bg-gray-200 dark:bg-white/5 rounded-lg"></div>
                            ))}
                        </div>
                        {/* Main Chart Area */}
                        <div className="col-span-12 md:col-span-7 space-y-6">
                             <div className="h-64 w-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20 relative overflow-hidden">
                                 {/* Simple animated line */}
                                 <svg className="absolute bottom-0 left-0 right-0 h-32 w-full" preserveAspectRatio="none">
                                     <path d="M0,128 C150,100 300,150 450,80 C600,10 750,100 900,50 L900,128 L0,128 Z" fill="url(#grad1)" />
                                     <defs>
                                         <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                                             <stop offset="0%" style={{stopColor:'rgb(99, 102, 241)', stopOpacity:0.4}} />
                                             <stop offset="100%" style={{stopColor:'rgb(99, 102, 241)', stopOpacity:0}} />
                                         </linearGradient>
                                     </defs>
                                 </svg>
                             </div>
                             <div className="grid grid-cols-3 gap-4">
                                 {[1,2,3].map(i => (
                                     <div key={i} className="h-24 bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5"></div>
                                 ))}
                             </div>
                        </div>
                        {/* Right Panel */}
                        <div className="hidden md:block col-span-3 space-y-4">
                             <div className="h-full bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5"></div>
                        </div>
                    </div>

                    {/* Overlay Action */}
                    <div className="absolute inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                         <Button onClick={() => onEnter('market')} className="scale-125 shadow-2xl shadow-indigo-500/50">Connect Interface</Button>
                    </div>
                 </div>
             </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <StatItem label="Active Pairs" value="12,000+" />
                <StatItem label="Data Latency" value="< 50ms" />
                <StatItem label="API Uptime" value="99.99%" />
                <StatItem label="Verified Users" value="150K+" />
            </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16 max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">
                        Protocol Features
                    </span>
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Built on modern web standards to provide a decentralized experience without the complexity.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Web3Card 
                    icon={<BarChart3 className="text-indigo-400" size={32} />}
                    title="Real-Time Data Feeds"
                    desc="Aggregate price feeds from multiple decentralized and centralized exchanges instantly."
                />
                <Web3Card 
                    icon={<ShieldCheck className="text-cyan-400" size={32} />}
                    title="Local-First Privacy"
                    desc="Zero-knowledge architecture. Your portfolio data is encrypted and stored locally on your device."
                />
                <Web3Card 
                    icon={<Globe className="text-purple-400" size={32} />}
                    title="Global Asset Support"
                    desc="Track thousands of assets across multiple chains including Ethereum, Solana, and BSC."
                />
            </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t border-gray-200 dark:border-white/5 bg-white dark:bg-[#0b1221]">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2 font-bold text-xl cursor-pointer" onClick={() => onEnter('market')}>
                 <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white">
                    <Layers size={14} />
                 </div>
                 <span>DEV<span className="text-indigo-600">CRYPTO</span></span>
              </div>
              <div className="text-gray-500 text-sm">
                © 2024 DEVCRYPTO Protocol. Open Source.
              </div>
              <div className="flex gap-6">
                 <a href="#" className="text-gray-400 hover:text-indigo-500 transition-colors">Twitter</a>
                 <a href="#" className="text-gray-400 hover:text-indigo-500 transition-colors">Discord</a>
                 <a href="#" className="text-gray-400 hover:text-indigo-500 transition-colors">GitHub</a>
              </div>
          </div>
      </footer>
    </div>
  );
};

const StatItem = ({ label, value }: { label: string, value: string }) => (
    <div>
        <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</div>
    </div>
);

const Web3Card: React.FC<{icon: React.ReactNode, title: string, desc: string}> = ({ icon, title, desc }) => (
    <div className="p-8 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 hover:border-indigo-500/30 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 group">
        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
    </div>
);

export default LandingPage;