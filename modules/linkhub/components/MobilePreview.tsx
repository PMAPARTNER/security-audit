import React from 'react';
import { UserProfile, LinkItem, ThemeConfig } from '../types';
import { ExternalLink } from 'lucide-react';
import { Translation } from '../locales';
import { ICON_OPTIONS } from '../constants';

interface MobilePreviewProps {
  profile: UserProfile;
  links: LinkItem[];
  theme: ThemeConfig;
  t: Translation;
  onLinkClick?: (id: string) => void;
}

const MobilePreview: React.FC<MobilePreviewProps> = ({ profile, links, theme, t, onLinkClick }) => {
  
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    // Notify parent for analytics tracking
    if (onLinkClick) {
        onLinkClick(id);
    }
  };

  const backgroundStyle = profile.customBackground 
    ? { backgroundImage: `url(${profile.customBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' } 
    : {};

  // Button Style Calculation
  const shapeClass = profile.buttonShape === 'square' ? 'rounded-none' : 
                     profile.buttonShape === 'pill' ? 'rounded-full' : 
                     'rounded-xl'; // Default rounded
  
  // Refined "Hard" shadow: 4px offset -> 2px offset on hover = 2px movement.
  const shadowClass = profile.buttonShadow === 'none' ? 'shadow-none' :
                      profile.buttonShadow === 'hard' ? 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' :
                      'shadow-lg hover:shadow-xl hover:-translate-y-1'; // Default soft

  // Avatar Shape Calculation
  const avatarShape = profile.avatarShape || 'circle';
  let avatarClass = 'w-24 h-24 rounded-full';
  let avatarStyle: React.CSSProperties = {};

  if (avatarShape === 'square') {
      avatarClass = 'w-24 h-24 rounded-none';
  } else if (avatarShape === 'rounded') {
      avatarClass = 'w-24 h-24 rounded-2xl';
  } else if (avatarShape === 'star') {
      avatarClass = 'w-28 h-28 rounded-none';
      avatarStyle = { clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' };
  } else if (avatarShape === 'blob') {
      avatarClass = 'w-24 h-24';
      avatarStyle = { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' };
  } else if (avatarShape === 'full') {
      avatarClass = 'w-full h-48 rounded-none';
  }

  // Layout Logic
  const layout = profile.layout || 'stack';
  let containerClass = 'flex flex-col space-y-3'; // Default Stack
  let itemClass = 'w-full py-3.5 px-4 flex items-center'; // Default Item
  let contentDirection = 'flex-row';
  
  if (layout === 'grid') {
      containerClass = 'grid grid-cols-2 gap-3';
      itemClass = 'w-full py-6 px-4 flex flex-col items-center text-center justify-center h-full';
      contentDirection = 'flex-col';
  } else if (layout === 'masonry') {
      containerClass = 'columns-2 gap-3 space-y-3';
      itemClass = 'w-full py-4 px-3 flex flex-col items-center text-center inline-flex break-inside-avoid mb-3';
      contentDirection = 'flex-col';
  }

  return (
    <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
      <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute z-10"></div>
      <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
      <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
      
      <div 
        className={`rounded-[2rem] overflow-hidden w-full h-full ${theme.background} overflow-y-auto scrollbar-hide relative transition-colors duration-500`}
        style={backgroundStyle}
      >
        {/* Overlay for readability if needed, usually managed by theme colors, but for custom BG we might want a slight tint if needed. For now keeping raw. */}
        
        {/* Content Wrapper */}
        <div className={`flex flex-col items-center min-h-full backdrop-brightness-100 ${avatarShape === 'full' ? 'px-0 pt-0' : 'px-6 py-12'}`}>
          
          {/* Avatar */}
          <div className={`mb-4 relative group ${avatarShape === 'full' ? 'w-full' : ''}`}>
            <div className={`${avatarClass} overflow-hidden ${avatarShape === 'star' || avatarShape === 'full' ? '' : 'border-2 border-white/50 shadow-lg'}`} style={avatarStyle}>
                <img 
                    src={profile.avatarUrl} 
                    alt={profile.displayName} 
                    className="w-full h-full object-cover"
                />
            </div>
          </div>

          <div className={`${avatarShape === 'full' ? 'px-6 -mt-2' : ''} flex flex-col items-center w-full`}>
            {/* Profile Info */}
            <h2 className={`text-lg font-bold text-center mb-1 ${theme.textColor} drop-shadow-md`}>
                {profile.displayName || '@kullanici'}
            </h2>
            <p className={`text-sm text-center mb-8 opacity-90 whitespace-pre-wrap ${theme.textColor} drop-shadow-sm`}>
                {profile.bio}
            </p>

            {/* Links */}
            <div className={`w-full pb-8 ${containerClass}`}>
                {links.filter(l => l.active).map((link) => {
                const IconComponent = ICON_OPTIONS[link.icon || 'globe']?.component || ICON_OPTIONS['globe'].component;
                
                return (
                <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleLinkClick(e, link.id)}
                    className={`group ${theme.buttonStyle} ${shapeClass} ${shadowClass} ${itemClass} transition-all`}
                >
                    {/* Icon Area */}
                    <div className={`${contentDirection === 'flex-col' ? 'mb-2' : 'mr-3'} ${theme.buttonTextColor} opacity-80`}>
                        <IconComponent size={contentDirection === 'flex-col' ? 24 : 20} />
                    </div>
                    
                    {/* Text Area */}
                    <span className={`text-sm font-medium truncate w-full ${contentDirection === 'flex-row' ? 'text-left flex-1' : ''} ${theme.buttonTextColor}`}>{link.title}</span>
                    
                    {/* Arrow Area - Only show in Stack mode for cleanliness */}
                    {layout === 'stack' && (
                        <ExternalLink size={14} className={`${theme.buttonTextColor} opacity-0 group-hover:opacity-60 transition-opacity ml-2`} />
                    )}
                </a>
                )})}
                
                {links.filter(l => l.active).length === 0 && (
                    <div className={`text-center text-xs opacity-60 mt-4 col-span-full ${theme.textColor}`}>
                        {t.preview.emptyLinks}
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilePreview;