import React from 'react';
import { Translation } from '../locales';
import { ArrowRight, Sparkles, Palette, BarChart3, Share2, Globe, CheckCircle2, Zap } from 'lucide-react';
import MobilePreview from './MobilePreview';
import { DEFAULT_LINKS, DEFAULT_PROFILE, THEMES } from '../constants';

interface LandingPageProps {
  onStart: () => void;
  t: Translation;
  toggleLanguage: () => void;
  language: string;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, t, toggleLanguage, language }) => {
  
  // Demo data for preview
  const demoProfile = { ...DEFAULT_PROFILE, displayName: 'LinkHub Demo', bio: 'The best link in bio tool for creators.\nCreate yours in seconds. ✨' };
  const demoTheme = THEMES.find(th => th.id === 'midnight') || THEMES[2];
  
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-purple-200">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/20">L</div>
            <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">LinkHub</span>
          </div>
          <div className="flex items-center gap-4">
             <button 
                onClick={toggleLanguage}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 uppercase tracking-wider"
             >
                {language}
             </button>
             <button 
                onClick={onStart}
                className="hidden sm:block text-gray-600 font-medium hover:text-gray-900 transition-colors"
             >
                {t.landing.hero.login}
             </button>
             <button 
                onClick={onStart}
                className="bg-gray-900 text-white px-5 py-2.5 rounded-full font-medium hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 shadow-lg"
             >
                {t.landing.hero.cta}
             </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
         {/* Background Decoration */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-gradient-to-b from-purple-50 via-white to-white -z-10"></div>
         <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-purple-300/20 rounded-full blur-3xl -z-10"></div>
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-3xl -z-10"></div>

         <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Text Content */}
            <div className="space-y-8 animate-in slide-in-from-bottom-10 fade-in duration-700">
                <div className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-full px-4 py-1.5">
                    <Sparkles size={16} className="text-amber-500 fill-amber-500" />
                    <span className="text-sm font-medium text-gray-700">{t.landing.hero.badge}</span>
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-gray-900">
                    {t.landing.hero.title.split('\n')[0]} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                        {t.landing.hero.title.split('\n')[1]}
                    </span>
                </h1>
                
                <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                    {t.landing.hero.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                        onClick={onStart}
                        className="h-14 px-8 rounded-full bg-purple-600 text-white font-semibold text-lg hover:bg-purple-700 transition-all shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 group"
                    >
                        {t.landing.hero.cta}
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
                
                <div className="flex items-center gap-6 pt-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-500" />
                        <span>Ücretsiz</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-500" />
                        <span>Kredi Kartı Gerekmez</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-500" />
                        <span>Hızlı Kurulum</span>
                    </div>
                </div>
            </div>

            {/* Preview Content */}
            <div className="relative flex justify-center lg:justify-end animate-in fade-in zoom-in-95 duration-1000 delay-200">
                <div className="relative z-10 scale-[0.85] sm:scale-100 transform hover:-translate-y-2 transition-transform duration-500 ease-in-out">
                     <div className="absolute -inset-4 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-[3rem] blur-xl opacity-20"></div>
                     <MobilePreview 
                        profile={demoProfile}
                        links={DEFAULT_LINKS}
                        theme={demoTheme}
                        t={t}
                     />
                     
                     {/* Floating Cards */}
                     <div className="absolute top-20 -left-12 bg-white p-4 rounded-xl shadow-xl border border-gray-100 animate-bounce delay-700 hidden sm:block">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                                <BarChart3 size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Total Clicks</p>
                                <p className="font-bold text-gray-800">1,248</p>
                            </div>
                        </div>
                     </div>

                     <div className="absolute bottom-32 -right-8 bg-white p-4 rounded-xl shadow-xl border border-gray-100 animate-bounce delay-100 hidden sm:block">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                                <Palette size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Themes</p>
                                <p className="font-bold text-gray-800">10+ Styles</p>
                            </div>
                        </div>
                     </div>
                </div>
            </div>

         </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.landing.features.title}</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <FeatureCard 
                     icon={<Palette size={24} className="text-pink-500" />}
                     title={t.landing.features.customization}
                     desc={t.landing.features.customizationDesc}
                     color="bg-pink-50"
                  />
                   <FeatureCard 
                     icon={<BarChart3 size={24} className="text-blue-500" />}
                     title={t.landing.features.analytics}
                     desc={t.landing.features.analyticsDesc}
                     color="bg-blue-50"
                  />
                   <FeatureCard 
                     icon={<Zap size={24} className="text-amber-500" />}
                     title={t.landing.features.ai}
                     desc={t.landing.features.aiDesc}
                     color="bg-amber-50"
                  />
                   <FeatureCard 
                     icon={<Globe size={24} className="text-emerald-500" />}
                     title={t.landing.features.responsive}
                     desc={t.landing.features.responsiveDesc}
                     color="bg-emerald-50"
                  />
              </div>
          </div>
      </div>

      {/* Simple Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                 <div className="w-6 h-6 bg-gray-800 rounded-md flex items-center justify-center text-white font-bold text-xs">L</div>
                 <span className="font-bold text-gray-800">LinkHub</span>
              </div>
              <p className="text-gray-500 text-sm">{t.landing.footer.rights}</p>
          </div>
      </footer>

    </div>
  );
};

const FeatureCard = ({ icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) => (
    <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-lg transition-all duration-300">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4`}>
            {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 leading-relaxed text-sm">{desc}</p>
    </div>
);

export default LandingPage;