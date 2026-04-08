import React from 'react';
import { ThemeConfig, UserProfile } from '../types';
import { THEMES } from '../constants';
import { Check, Upload, Image as ImageIcon, X, Square, MousePointerClick, Box, Zap, LayoutList, Grid, LayoutDashboard, Circle, Star, RectangleHorizontal, Hexagon } from 'lucide-react';
import { Translation } from '../locales';

interface AppearanceEditorProps {
  currentTheme: ThemeConfig;
  setTheme: (t: ThemeConfig) => void;
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  t: Translation;
}

const AppearanceEditor: React.FC<AppearanceEditorProps> = ({ currentTheme, setTheme, profile, setProfile, t }) => {
  
  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, customBackground: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCustomBg = () => {
    setProfile({ ...profile, customBackground: undefined });
  };

  const currentShape = profile.buttonShape || 'rounded';
  const currentShadow = profile.buttonShadow || 'soft';
  const currentLayout = profile.layout || 'stack';
  const currentAvatarShape = profile.avatarShape || 'circle';

  // Helper to get shadow class for mini-previews
  const getPreviewShadow = (shadowType: string) => {
    if (shadowType === 'none') return 'shadow-none';
    if (shadowType === 'hard') return 'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]';
    return 'shadow-md';
  };

  const previewShadowClass = getPreviewShadow(currentShadow);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">{t.appearance.title}</h2>
        <p className="text-sm text-gray-500">{t.appearance.description}</p>
      </div>

      {/* Avatar Shape Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
         <div className="flex items-center gap-2 mb-4 text-gray-800 font-medium">
             <Circle size={18} />
             <span>{t.appearance.avatarShape}</span>
         </div>
         <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
             <button 
                 onClick={() => setProfile({...profile, avatarShape: 'circle'})}
                 className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-all ${currentAvatarShape === 'circle' ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-gray-200 hover:bg-gray-50'}`}
             >
                 <div className="w-6 h-6 rounded-full bg-current"></div>
                 <span className="text-[10px] font-medium text-center">{t.appearance.shapes.circle}</span>
             </button>
             <button 
                 onClick={() => setProfile({...profile, avatarShape: 'rounded'})}
                 className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-all ${currentAvatarShape === 'rounded' ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-gray-200 hover:bg-gray-50'}`}
             >
                 <div className="w-6 h-6 rounded-lg bg-current"></div>
                 <span className="text-[10px] font-medium text-center">{t.appearance.shapes.rounded}</span>
             </button>
             <button 
                 onClick={() => setProfile({...profile, avatarShape: 'square'})}
                 className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-all ${currentAvatarShape === 'square' ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-gray-200 hover:bg-gray-50'}`}
             >
                 <div className="w-6 h-6 rounded-none bg-current"></div>
                 <span className="text-[10px] font-medium text-center">{t.appearance.shapes.square}</span>
             </button>
             <button 
                 onClick={() => setProfile({...profile, avatarShape: 'star'})}
                 className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-all ${currentAvatarShape === 'star' ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-gray-200 hover:bg-gray-50'}`}
             >
                 <Star size={24} className="fill-current" />
                 <span className="text-[10px] font-medium text-center">{t.appearance.shapes.star}</span>
             </button>
             <button 
                 onClick={() => setProfile({...profile, avatarShape: 'blob'})}
                 className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-all ${currentAvatarShape === 'blob' ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-gray-200 hover:bg-gray-50'}`}
             >
                 <div className="w-6 h-6 bg-current" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}></div>
                 <span className="text-[10px] font-medium text-center">{t.appearance.shapes.blob}</span>
             </button>
             <button 
                 onClick={() => setProfile({...profile, avatarShape: 'full'})}
                 className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-all ${currentAvatarShape === 'full' ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-gray-200 hover:bg-gray-50'}`}
             >
                 <RectangleHorizontal size={24} />
                 <span className="text-[10px] font-medium text-center leading-tight">{t.appearance.shapes.full}</span>
             </button>
         </div>
      </div>

      {/* Button Styles Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6">
        <div>
           <div className="flex items-center gap-2 mb-3 text-gray-800 font-medium">
                <MousePointerClick size={18} />
                <span>{t.appearance.buttonStyle}</span>
           </div>
           
           {/* Shape Selector */}
           <div className="mb-6">
               <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">{t.appearance.shapes.title}</label>
               <div className="grid grid-cols-3 gap-3">
                   <button 
                       onClick={() => setProfile({...profile, buttonShape: 'square'})}
                       className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-all ${currentShape === 'square' ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-gray-200 hover:bg-gray-50'}`}
                   >
                       <Square size={20} />
                       <span className="text-xs font-medium">{t.appearance.shapes.square}</span>
                   </button>
                   <button 
                       onClick={() => setProfile({...profile, buttonShape: 'rounded'})}
                       className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-all ${currentShape === 'rounded' ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-gray-200 hover:bg-gray-50'}`}
                   >
                       <div className="w-5 h-5 border-2 border-current rounded-md"></div>
                       <span className="text-xs font-medium">{t.appearance.shapes.rounded}</span>
                   </button>
                   <button 
                       onClick={() => setProfile({...profile, buttonShape: 'pill'})}
                       className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-all ${currentShape === 'pill' ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-gray-200 hover:bg-gray-50'}`}
                   >
                       <div className="w-5 h-5 border-2 border-current rounded-full"></div>
                       <span className="text-xs font-medium">{t.appearance.shapes.pill}</span>
                   </button>
               </div>
           </div>

           {/* Shadow Selector */}
           <div>
               <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">{t.appearance.shadows.title}</label>
               <div className="grid grid-cols-3 gap-3">
                   <button 
                       onClick={() => setProfile({...profile, buttonShadow: 'none'})}
                       className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-all ${currentShadow === 'none' ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-gray-200 hover:bg-gray-50'}`}
                   >
                       <Box size={20} />
                       <span className="text-xs font-medium">{t.appearance.shadows.none}</span>
                   </button>
                   <button 
                       onClick={() => setProfile({...profile, buttonShadow: 'soft'})}
                       className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-all ${currentShadow === 'soft' ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-gray-200 hover:bg-gray-50'}`}
                   >
                       <div className="w-5 h-5 bg-gray-200 rounded shadow-md"></div>
                       <span className="text-xs font-medium">{t.appearance.shadows.soft}</span>
                   </button>
                   <button 
                       onClick={() => setProfile({...profile, buttonShadow: 'hard'})}
                       className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-all ${currentShadow === 'hard' ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-gray-200 hover:bg-gray-50'}`}
                   >
                       <Zap size={20} />
                       <span className="text-xs font-medium">{t.appearance.shadows.hard}</span>
                   </button>
               </div>
           </div>
        </div>
      </div>

      {/* Layout Style Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-gray-800 font-medium">
             <LayoutDashboard size={18} />
             <span>{t.appearance.layoutStyle}</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
            <button 
                onClick={() => setProfile({...profile, layout: 'stack'})}
                className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-all ${currentLayout === 'stack' ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-gray-200 hover:bg-gray-50'}`}
            >
                <LayoutList size={20} />
                <span className="text-xs font-medium">{t.appearance.layouts.stack}</span>
            </button>
            <button 
                onClick={() => setProfile({...profile, layout: 'grid'})}
                className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-all ${currentLayout === 'grid' ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-gray-200 hover:bg-gray-50'}`}
            >
                <Grid size={20} />
                <span className="text-xs font-medium">{t.appearance.layouts.grid}</span>
            </button>
            <button 
                onClick={() => setProfile({...profile, layout: 'masonry'})}
                className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-all ${currentLayout === 'masonry' ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-gray-200 hover:bg-gray-50'}`}
            >
                <div className="flex gap-1 items-start">
                   <div className="w-2 h-4 border border-current rounded-[1px]"></div>
                   <div className="w-2 h-3 border border-current rounded-[1px] mt-1"></div>
                </div>
                <span className="text-xs font-medium">{t.appearance.layouts.masonry}</span>
            </button>
        </div>
      </div>

      {/* Themes Grid */}
      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wider">{t.appearance.themes}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {THEMES.map((theme) => (
            <button
                key={theme.id}
                onClick={() => setTheme(theme)}
                className={`relative group rounded-xl overflow-hidden aspect-[3/4] border-2 transition-all hover:scale-[1.02] text-left flex flex-col ${
                currentTheme.id === theme.id ? 'border-purple-600 ring-2 ring-purple-200' : 'border-transparent hover:border-gray-300'
                }`}
            >
                {/* Mini Preview inside card */}
                <div className={`flex-1 w-full ${theme.background} p-3 flex flex-col items-center justify-center gap-2 relative`}>
                    {/* If current theme and has custom bg, show it in preview too */}
                    {profile.customBackground && currentTheme.id === theme.id && (
                        <div 
                          className="absolute inset-0 bg-cover bg-center z-0"
                          style={{ backgroundImage: `url(${profile.customBackground})` }}
                        ></div>
                    )}
                    
                    {/* We also apply the shadow class here for better preview */}
                    <div className={`w-8 h-8 opacity-80 ${theme.buttonStyle} border-none z-10 ${currentShape === 'pill' ? 'rounded-full' : currentShape === 'square' ? 'rounded-none' : 'rounded-md'} ${previewShadowClass}`}></div>
                    <div className={`w-12 h-2 opacity-50 ${theme.buttonStyle} border-none z-10 ${currentShape === 'pill' ? 'rounded-full' : currentShape === 'square' ? 'rounded-none' : 'rounded-md'} ${previewShadowClass}`}></div>
                    <div className={`w-16 h-2 opacity-30 ${theme.buttonStyle} border-none z-10 ${currentShape === 'pill' ? 'rounded-full' : currentShape === 'square' ? 'rounded-none' : 'rounded-md'} ${previewShadowClass}`}></div>
                </div>
                
                <div className="p-3 bg-white w-full border-t border-gray-100 z-10">
                    <span className="text-sm font-medium text-gray-700 block truncate">{t.themes[theme.id]}</span>
                </div>

                {currentTheme.id === theme.id && (
                    <div className="absolute top-2 right-2 bg-purple-600 text-white p-1 rounded-full shadow-md z-20">
                        <Check size={12} strokeWidth={3} />
                    </div>
                )}
            </button>
            ))}
        </div>
      </div>

      {/* Custom Background Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-gray-800 font-medium">
            <ImageIcon size={18} />
            <span>{t.appearance.customBg}</span>
        </div>
        <p className="text-sm text-gray-500 mb-4">{t.appearance.customBgDesc}</p>

        {profile.customBackground ? (
          <div className="relative w-full h-32 rounded-lg overflow-hidden group">
            <img src={profile.customBackground} alt="Custom Background" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={removeCustomBg}
                className="bg-white text-red-600 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-red-50"
              >
                <X size={16} /> {t.appearance.remove}
              </button>
            </div>
          </div>
        ) : (
          <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-purple-300 transition-colors">
            <Upload size={24} className="text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-600">{t.appearance.upload}</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleBgUpload} />
          </label>
        )}
      </div>
    </div>
  );
};

export default AppearanceEditor;