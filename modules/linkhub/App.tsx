import React, { useState, useEffect } from 'react';
import { User, Link as LinkIcon, Palette, Share2, Eye, Download, Globe, UploadCloud, X, Copy, Check, Loader2, Github, Key, FolderGit2, BarChart3, Settings } from 'lucide-react';
import MobilePreview from './components/MobilePreview';
import ProfileEditor from './components/ProfileEditor';
import LinkEditor from './components/LinkEditor';
import AppearanceEditor from './components/AppearanceEditor';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import SettingsEditor from './components/SettingsEditor';
import LandingPage from './components/LandingPage';
import ShareModal from './components/ShareModal';
import { DEFAULT_LINKS, DEFAULT_PROFILE, THEMES } from './constants';
import { LinkItem, UserProfile, ThemeConfig, Language, AnalyticsStats } from './types';
import { translations } from './locales';
import { useGithubPublisher } from './hooks/useGithubPublisher';

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState<'links' | 'profile' | 'appearance' | 'analytics' | 'settings'>('links');
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [links, setLinks] = useState<LinkItem[]>(DEFAULT_LINKS);
  const [theme, setTheme] = useState<ThemeConfig>(THEMES[0]);
  const [showMobilePreview, setShowMobilePreview] = useState(false); // Mobile only state
  const [language, setLanguage] = useState<Language>('tr');

  // Analytics State
  const [analytics, setAnalytics] = useState<AnalyticsStats>({
    pageViews: 124, // Demo initial data
    totalClicks: 42,
    linkClicks: {},
    gaMeasurementId: ''
  });

  const t = translations[language];

  // Hook usage for GitHub publishing and file generation
  const {
    isPublishing,
    publishedUrl,
    isCopied,
    showConfigModal,
    setShowConfigModal,
    showPublishSuccess,
    setShowPublishSuccess,
    configError,
    setGithubConfig,
    githubConfig,
    handleDownload,
    initiatePublish,
    handleSaveConfig,
    copyPublishedUrl
  } = useGithubPublisher(profile, links, theme, language, analytics, t);

  const [showShareModal, setShowShareModal] = useState(false);

  // Default Favicon (LinkHub Purple L)
  const DEFAULT_FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='20' fill='%239333ea'/%3E%3Ctext x='50' y='70' font-family='sans-serif' font-size='70' fill='white' text-anchor='middle' font-weight='bold'%3EL%3C/text%3E%3C/svg%3E";

  // Update Favicon dynamically
  useEffect(() => {
    const link = (document.querySelector("link[rel*='icon']") as HTMLLinkElement) || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    // If the uploaded favicon is SVG or other image, data URL works fine
    link.href = profile.favicon || DEFAULT_FAVICON;
    document.getElementsByTagName('head')[0].appendChild(link);
  }, [profile.favicon]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'tr' ? 'en' : 'tr');
  };

  const handleTrackClick = (linkId: string) => {
    setAnalytics(prev => ({
        ...prev,
        totalClicks: prev.totalClicks + 1,
        linkClicks: {
            ...prev.linkClicks,
            [linkId]: (prev.linkClicks[linkId] || 0) + 1
        }
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileEditor profile={profile} setProfile={setProfile} language={language} t={t} />;
      case 'links':
        return <LinkEditor links={links} setLinks={setLinks} t={t} />;
      case 'appearance':
        return <AppearanceEditor currentTheme={theme} setTheme={setTheme} profile={profile} setProfile={setProfile} t={t} />;
      case 'analytics':
        return <AnalyticsDashboard stats={analytics} setStats={setAnalytics} links={links} t={t} />;
      case 'settings':
        return <SettingsEditor profile={profile} setProfile={setProfile} t={t} githubUsername={githubConfig.username} />;
      default:
        return null;
    }
  };

  // GitHub integration functions are handled by useGithubPublisher hook.

  if (showLanding) {
    return <LandingPage onStart={() => setShowLanding(false)} t={t} toggleLanguage={toggleLanguage} language={language.toUpperCase()} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowLanding(true)}>
             <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">L</div>
             <span className="font-bold text-xl tracking-tight text-gray-900">LinkHub</span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
             <button
                onClick={toggleLanguage}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-1 font-medium text-sm mr-2"
             >
                <Globe size={18} />
                <span>{language.toUpperCase()}</span>
             </button>

             <button 
                onClick={() => setShowMobilePreview(!showMobilePreview)}
                className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
             >
                <Eye size={20} />
             </button>

             {/* Download HTML Button */}
             <button 
                onClick={handleDownload}
                className="hidden md:flex items-center gap-2 px-3 sm:px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-full text-sm font-medium transition-colors"
                title={t.header.download}
             >
                <Download size={16} />
                <span className="hidden lg:inline">{t.header.download}</span>
             </button>

             <button 
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-full text-sm font-medium transition-colors"
             >
                <Share2 size={16} />
                <span className="hidden sm:inline">{t.header.share}</span>
             </button>

             <button 
                onClick={initiatePublish}
                disabled={isPublishing}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white border border-transparent rounded-full text-sm font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
             >
                {isPublishing ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                <span className="hidden sm:inline">{t.header.publish}</span>
             </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8 flex gap-8">
        
        {/* Editor Column */}
        <div className={`flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col ${showMobilePreview ? 'hidden lg:flex' : 'flex'}`}>
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('links')}
              className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
                activeTab === 'links' 
                ? 'border-purple-600 text-purple-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <LinkIcon size={18} />
              <span className="hidden sm:inline">{t.tabs.links}</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
                activeTab === 'profile' 
                ? 'border-purple-600 text-purple-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <User size={18} />
              <span className="hidden sm:inline">{t.tabs.profile}</span>
            </button>
            <button
              onClick={() => setActiveTab('appearance')}
              className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
                activeTab === 'appearance' 
                ? 'border-purple-600 text-purple-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Palette size={18} />
              <span className="hidden sm:inline">{t.tabs.appearance}</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
                activeTab === 'analytics' 
                ? 'border-purple-600 text-purple-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BarChart3 size={18} />
              <span className="hidden sm:inline">{t.tabs.analytics}</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
                activeTab === 'settings' 
                ? 'border-purple-600 text-purple-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Settings size={18} />
              <span className="hidden sm:inline">{t.tabs.settings}</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(100vh-250px)]">
             {renderContent()}
          </div>
        </div>

        {/* Preview Column */}
        <div className={`lg:w-[400px] flex-shrink-0 flex items-center justify-center ${showMobilePreview ? 'flex w-full absolute inset-0 bg-gray-50 z-20 top-16' : 'hidden lg:flex'}`}>
            <div className="sticky top-24">
                <MobilePreview 
                  profile={profile} 
                  links={links} 
                  theme={theme} 
                  t={t} 
                  onLinkClick={handleTrackClick}
                />
                {showMobilePreview && (
                    <button 
                        onClick={() => setShowMobilePreview(false)}
                        className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-white text-gray-800 px-6 py-2 rounded-full shadow-lg font-medium border border-gray-200"
                    >
                        {t.preview.return}
                    </button>
                )}
            </div>
        </div>
      </main>

      {/* Share/QR Modal */}
      <ShareModal 
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        url={publishedUrl || `https://linkhub.app/${profile.username}`}
        profile={profile}
        t={t}
        published={!!publishedUrl}
      />

      {/* GitHub Configuration Modal */}
      {showConfigModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                 <div className="p-6">
                     <div className="flex justify-between items-start mb-4">
                         <div className="p-3 bg-gray-900 rounded-full text-white">
                             <Github size={24} />
                         </div>
                         <button onClick={() => setShowConfigModal(false)} className="text-gray-400 hover:text-gray-600">
                             <X size={20} />
                         </button>
                     </div>
                     
                     <h3 className="text-xl font-bold text-gray-900 mb-2">{t.github.title}</h3>
                     <p className="text-gray-600 mb-6 text-sm">{t.github.description}</p>
                     
                     <div className="space-y-4">
                         <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                 <User size={14} /> {t.github.username}
                             </label>
                             <input 
                                 type="text" 
                                 value={githubConfig.username}
                                 onChange={(e) => setGithubConfig({...githubConfig, username: e.target.value})}
                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                 placeholder="e.g. johndoe"
                             />
                         </div>
                         <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                 <FolderGit2 size={14} /> {t.github.repo}
                             </label>
                             <input 
                                 type="text" 
                                 value={githubConfig.repo}
                                 onChange={(e) => setGithubConfig({...githubConfig, repo: e.target.value})}
                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                 placeholder="e.g. linkhub"
                             />
                         </div>
                         <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                 <Key size={14} /> {t.github.token}
                             </label>
                             <input 
                                 type="password" 
                                 value={githubConfig.token}
                                 onChange={(e) => setGithubConfig({...githubConfig, token: e.target.value})}
                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                 placeholder="ghp_..."
                             />
                             <p className="text-xs text-gray-500 mt-1">{t.github.guide}</p>
                         </div>
                     </div>

                     {configError && (
                         <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                             {configError}
                         </div>
                     )}
                 </div>
                 
                 <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end gap-2">
                     <button 
                         onClick={() => setShowConfigModal(false)}
                         className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                     >
                         {t.publishModal.close}
                     </button>
                     <button 
                         onClick={handleSaveConfig}
                         disabled={isPublishing}
                         className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2 disabled:opacity-70"
                     >
                         {isPublishing && <Loader2 size={16} className="animate-spin" />}
                         {t.github.save}
                     </button>
                 </div>
             </div>
         </div>
      )}

      {/* Publish Success Modal - Only show immediately after publishing if successful */}
      {publishedUrl && showPublishSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-green-100 rounded-full text-green-600">
                              <UploadCloud size={24} />
                          </div>
                          <button onClick={() => setShowPublishSuccess(false)} className="text-gray-400 hover:text-gray-600">
                              <X size={20} />
                          </button>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{t.publishModal.title}</h3>
                      <p className="text-gray-600 mb-6">{t.publishModal.description}</p>
                      
                      <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg mb-4">
                          <Globe size={18} className="text-gray-400" />
                          <span className="flex-1 text-sm font-medium text-gray-800 truncate select-all">{publishedUrl}</span>
                          <button 
                              onClick={copyPublishedUrl}
                              className={`p-2 rounded-md transition-colors ${isCopied ? 'bg-green-100 text-green-600' : 'hover:bg-gray-200 text-gray-600'}`}
                              title={t.publishModal.copy}
                          >
                              {isCopied ? <Check size={18} /> : <Copy size={18} />}
                          </button>
                      </div>

                      {/* Add QR shortcut in Success Modal */}
                      <button 
                        onClick={() => { setShowPublishSuccess(false); setShowShareModal(true); }}
                        className="w-full mb-4 py-2.5 border border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg font-medium transition-colors flex justify-center items-center gap-2"
                      >
                         <Share2 size={16} /> {t.header.share} / QR
                      </button>
                      
                      <div className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
                         {t.publishModal.note}
                      </div>
                  </div>
                  <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end gap-2">
                      <a 
                        href={publishedUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2"
                      >
                         <ExternalLinkIcon size={16} /> Görüntüle
                      </a>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

// Helper Icon for Modal
const ExternalLinkIcon = ({ size }: { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
);

export default App;