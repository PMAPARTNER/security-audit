import React, { useState } from 'react';
import { AnalyticsStats, LinkItem } from '../types';
import { Translation } from '../locales';
import { BarChart3, MousePointer2, Eye, TrendingUp, Settings, RefreshCcw, Smartphone, Monitor, Activity, Check } from 'lucide-react';

interface AnalyticsDashboardProps {
  stats: AnalyticsStats;
  setStats: (stats: AnalyticsStats) => void;
  links: LinkItem[];
  t: Translation;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ stats, setStats, links, t }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(!!stats.gaMeasurementId);

  // Simple chart data generator (mock)
  const chartPoints = [20, 45, 28, 80, 55, 90, stats.pageViews > 100 ? 120 : 60];
  const maxPoint = Math.max(...chartPoints);
  const pointsString = chartPoints.map((p, i) => `${i * 100},${100 - (p / maxPoint) * 100}`).join(' ');

  const calculateCTR = () => {
    if (stats.pageViews === 0) return '0%';
    return Math.round((stats.totalClicks / stats.pageViews) * 100) + '%';
  };

  const getSortedLinks = () => {
    return links
      .filter(l => l.active)
      .map(link => ({
        ...link,
        clicks: stats.linkClicks[link.id] || 0
      }))
      .sort((a, b) => b.clicks - a.clicks);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API Fetch
    setTimeout(() => {
        const randomViews = Math.floor(Math.random() * 50) + 10;
        const randomClicks = Math.floor(randomViews * 0.4);
        
        setStats({
            ...stats,
            pageViews: stats.pageViews + randomViews,
            totalClicks: stats.totalClicks + randomClicks
        });
        setIsRefreshing(false);
    }, 1500);
  };

  const handleConnectGA = () => {
      if (!stats.gaMeasurementId.startsWith('G-')) {
          alert(t.analytics.invalidID);
          return;
      }
      setIsConnecting(true);
      // Simulate Connection verification
      setTimeout(() => {
          setIsConnecting(false);
          setIsConnected(true);
          handleRefresh(); // Fetch "initial" data
      }, 2000);
  };

  const maxClicks = Math.max(...(Object.values(stats.linkClicks) as number[]), 1);
  const sortedLinks = getSortedLinks();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h2 className="text-xl font-semibold text-gray-800">{t.analytics.title}</h2>
            <p className="text-sm text-gray-500">{t.analytics.description}</p>
        </div>
        <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors shadow-sm self-start sm:self-auto"
        >
            <RefreshCcw size={16} className={isRefreshing ? "animate-spin" : ""} />
            {t.analytics.refresh}
        </button>
      </div>

      {/* GA Connection Card */}
      <div className={`border rounded-xl p-5 transition-all duration-300 ${isConnected ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
          <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2 text-gray-800 font-medium">
                  {isConnected ? <Check size={18} className="text-green-600" /> : <Settings size={18} />}
                  <span>{t.analytics.settingsTitle}</span>
              </div>
              {isConnected && <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full uppercase tracking-wide">{t.analytics.connected}</span>}
          </div>
          
          <div className="flex gap-2">
              <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">ID</span>
                  <input
                      type="text"
                      value={stats.gaMeasurementId}
                      onChange={(e) => {
                          setStats({...stats, gaMeasurementId: e.target.value});
                          setIsConnected(false);
                      }}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none uppercase bg-white"
                      placeholder={t.analytics.gaPlaceholder}
                  />
              </div>
              {!isConnected && (
                  <button 
                    onClick={handleConnectGA}
                    disabled={!stats.gaMeasurementId || isConnecting}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                      {isConnecting ? t.analytics.connecting : t.analytics.connect}
                  </button>
              )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
              {t.analytics.settingsDesc}
          </p>
      </div>

      {/* Overview Chart (Simulated) */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-800 mb-6 flex items-center gap-2">
             <Activity size={16} className="text-purple-500" />
             {t.analytics.last7Days}
          </h3>
          
          <div className="h-32 w-full flex items-end justify-between gap-1">
             <svg className="w-full h-full overflow-visible" viewBox="0 0 600 100" preserveAspectRatio="none">
                 {/* Grid lines */}
                 <line x1="0" y1="0" x2="600" y2="0" stroke="#f3f4f6" strokeWidth="1" />
                 <line x1="0" y1="50" x2="600" y2="50" stroke="#f3f4f6" strokeWidth="1" />
                 <line x1="0" y1="100" x2="600" y2="100" stroke="#f3f4f6" strokeWidth="1" />
                 
                 {/* Chart Line */}
                 <polyline 
                    fill="none" 
                    stroke="#8b5cf6" 
                    strokeWidth="3" 
                    points={pointsString} 
                    className="drop-shadow-sm"
                 />
                 
                 {/* Dots */}
                 {chartPoints.map((p, i) => (
                    <circle 
                        key={i} 
                        cx={i * 100} 
                        cy={100 - (p / maxPoint) * 100} 
                        r="4" 
                        className="fill-white stroke-purple-600 stroke-2" 
                    />
                 ))}
             </svg>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium">
             <span>Mon</span>
             <span>Tue</span>
             <span>Wed</span>
             <span>Thu</span>
             <span>Fri</span>
             <span>Sat</span>
             <span>Sun</span>
          </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1 text-blue-700">
                <Eye size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">{t.analytics.views}</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.pageViews}</span>
        </div>
        <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1 text-purple-700">
                <MousePointer2 size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">{t.analytics.clicks}</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.totalClicks}</span>
        </div>
        <div className="bg-green-50/50 p-4 rounded-xl border border-green-100 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1 text-green-700">
                <TrendingUp size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">CTR</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">{calculateCTR()}</span>
        </div>
        <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 flex flex-col justify-center">
             <div className="flex items-center gap-2 mb-1 text-orange-700">
                <Smartphone size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">{t.analytics.mobile}</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">~65%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Links Chart */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BarChart3 size={16} className="text-gray-500" />
                  {t.analytics.topLinks}
              </h3>
              
              <div className="space-y-4">
                  {sortedLinks.length > 0 ? sortedLinks.map((link) => (
                      <div key={link.id} className="relative group">
                          <div className="flex justify-between text-sm mb-1 z-10 relative">
                              <span className="font-medium text-gray-700 truncate max-w-[70%] group-hover:text-purple-700 transition-colors">{link.title}</span>
                              <span className="text-gray-500 font-mono text-xs bg-gray-100 px-2 py-0.5 rounded-full">{link.clicks}</span>
                          </div>
                          <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-purple-500 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${(link.clicks / maxClicks) * 100}%` }}
                              ></div>
                          </div>
                      </div>
                  )) : (
                      <p className="text-sm text-gray-400 italic text-center py-4">{t.analytics.noData}</p>
                  )}
              </div>
          </div>

          {/* Device Distribution (Simulated) */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col">
              <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Monitor size={16} className="text-gray-500" />
                  {t.analytics.devices}
              </h3>
              
              <div className="flex-1 flex flex-col justify-center items-center gap-6">
                 <div className="relative w-32 h-32 rounded-full border-[12px] border-purple-100 border-t-purple-500 border-r-purple-500 -rotate-45">
                     <div className="absolute inset-0 flex items-center justify-center flex-col">
                         <span className="text-xl font-bold text-gray-800">65%</span>
                         <span className="text-[10px] text-gray-400 uppercase tracking-wide">Mobile</span>
                     </div>
                 </div>

                 <div className="w-full space-y-2">
                     <div className="flex items-center justify-between text-sm">
                         <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                            <span className="text-gray-600">{t.analytics.mobile}</span>
                         </div>
                         <span className="font-medium text-gray-900">65%</span>
                     </div>
                     <div className="flex items-center justify-between text-sm">
                         <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-100"></div>
                            <span className="text-gray-600">{t.analytics.desktop}</span>
                         </div>
                         <span className="font-medium text-gray-900">35%</span>
                     </div>
                 </div>
              </div>
          </div>
      </div>

      <div className="text-center text-xs text-gray-400 pt-4">
          {t.analytics.demoNote}
      </div>

    </div>
  );
};

export default AnalyticsDashboard;