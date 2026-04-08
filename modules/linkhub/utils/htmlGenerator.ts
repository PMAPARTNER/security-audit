import { UserProfile, LinkItem, ThemeConfig, Language, AnalyticsStats } from '../types';
import { Translation } from '../locales';

// SVG paths for supported icons
const ICON_SVGS: Record<string, string> = {
  instagram: `<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>`,
  twitter: `<path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>`,
  linkedin: `<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>`,
  github: `<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>`,
  youtube: `<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>`,
  facebook: `<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>`,
  twitch: `<path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"/>`,
  mail: `<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>`,
  globe: `<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>`
};

export const generateHtml = (
    profile: UserProfile, 
    links: LinkItem[], 
    theme: ThemeConfig, 
    language: Language, 
    t: Translation,
    analytics?: AnalyticsStats
) => {
  const activeLinks = links.filter(l => l.active);
  const safeTitle = profile.displayName.replace(/[^a-z0-9]/gi, '_').toLowerCase();

  // Button Style Classes
  const shapeClass = profile.buttonShape === 'square' ? 'rounded-none' : 
                     profile.buttonShape === 'pill' ? 'rounded-full' : 
                     'rounded-xl'; // Default rounded
  
  const shadowClass = profile.buttonShadow === 'none' ? 'shadow-none' :
                      profile.buttonShadow === 'hard' ? 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' :
                      'shadow-lg hover:shadow-xl hover:-translate-y-1'; // Default soft

  // Avatar Shape Logic
  const avatarShape = profile.avatarShape || 'circle';
  let avatarClass = 'w-32 h-32 rounded-full border-4 border-white/20 shadow-2xl ring-4 ring-black/5';
  let avatarStyle = '';
  let containerPadding = 'px-6 py-16';

  if (avatarShape === 'square') {
      avatarClass = 'w-32 h-32 rounded-none border-4 border-white/20 shadow-2xl ring-4 ring-black/5';
  } else if (avatarShape === 'rounded') {
      avatarClass = 'w-32 h-32 rounded-2xl border-4 border-white/20 shadow-2xl ring-4 ring-black/5';
  } else if (avatarShape === 'star') {
      avatarClass = 'w-36 h-36 rounded-none';
      avatarStyle = 'clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);';
  } else if (avatarShape === 'blob') {
      avatarClass = 'w-32 h-32 border-4 border-white/20 shadow-2xl ring-4 ring-black/5';
      avatarStyle = 'border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;';
  } else if (avatarShape === 'full') {
      avatarClass = 'w-full h-64 object-cover rounded-none';
      containerPadding = 'px-0 pt-0 pb-16'; // Remove top padding for full width
  }

  // Layout Logic
  const layout = profile.layout || 'stack';
  let linksContainerClass = 'space-y-4';
  let itemClass = 'w-full py-4 px-6 flex items-center';
  let contentDirection = 'flex-row';

  if (layout === 'grid') {
      linksContainerClass = 'grid grid-cols-2 gap-4 space-y-0';
      itemClass = 'w-full py-6 px-4 flex flex-col items-center text-center justify-center h-full';
      contentDirection = 'flex-col';
  } else if (layout === 'masonry') {
      linksContainerClass = 'columns-2 gap-4 space-y-4';
      itemClass = 'w-full py-4 px-4 flex flex-col items-center text-center inline-flex break-inside-avoid mb-4';
      contentDirection = 'flex-col';
  }

  // Google Analytics Injection
  const gaScript = analytics?.gaMeasurementId 
    ? `
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${analytics.gaMeasurementId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${analytics.gaMeasurementId}');
    </script>` 
    : '';

  // Canonical Tag for Custom Domain
  const canonicalTag = profile.customDomain 
    ? `<link rel="canonical" href="https://${profile.customDomain}" />`
    : '';
  
  // Custom Background Style
  const customBgStyle = profile.customBackground
    ? `background-image: url('${profile.customBackground}'); background-size: cover; background-position: center; background-attachment: fixed;`
    : '';

  // Default Favicon fallback (same as in index.html)
  const defaultFavicon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='20' fill='%239333ea'/%3E%3Ctext x='50' y='70' font-family='sans-serif' font-size='70' fill='white' text-anchor='middle' font-weight='bold'%3EL%3C/text%3E%3C/svg%3E";
  const faviconUrl = profile.favicon || defaultFavicon;

  const htmlContent = `<!DOCTYPE html>
<html lang="${language}">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${profile.displayName} | LinkHub</title>
    <meta name="description" content="${profile.bio.replace(/"/g, '&quot;')}" />
    <link rel="icon" href="${faviconUrl}">
    ${canonicalTag}
    ${gaScript}
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
      body { font-family: 'Inter', sans-serif; }
      /* Yumuşak geçişler ve animasyonlar */
      .link-card { transition: all 0.2s ease; }
      .link-card:active { transform: scale(0.98); }
      .glass-effect { backdrop-filter: blur(10px); }
    </style>
</head>
<body class="${theme.background} min-h-screen flex flex-col items-center justify-center text-gray-900 transition-colors duration-500" style="${customBgStyle}">
    <div class="w-full max-w-lg ${containerPadding} flex flex-col items-center min-h-screen ${avatarShape === 'full' ? 'justify-start' : 'justify-center'}">
        
        <!-- Avatar -->
        <div class="mb-6 relative animate-[fadeIn_0.5s_ease-out] ${avatarShape === 'full' ? 'w-full' : ''}">
            <div class="${avatarClass} overflow-hidden mx-auto" style="${avatarStyle}">
                <img src="${profile.avatarUrl}" alt="${profile.displayName}" class="w-full h-full object-cover" />
            </div>
        </div>

        <div class="w-full px-6 flex flex-col items-center">
            <!-- Profile Info -->
            <h1 class="text-2xl font-bold text-center mb-3 ${theme.textColor} drop-shadow-sm">
                ${profile.displayName}
            </h1>
            <p class="text-base text-center mb-10 opacity-90 whitespace-pre-wrap max-w-sm leading-relaxed ${theme.textColor}">
                ${profile.bio}
            </p>

            <!-- Links -->
            <div class="w-full mb-12 ${linksContainerClass}">
                ${activeLinks.map(link => {
                const iconKey = link.icon || 'globe';
                const svgContent = ICON_SVGS[iconKey] || ICON_SVGS['globe'];
                const clickEvent = analytics?.gaMeasurementId 
                    ? `onclick="gtag('event', 'click', { 'event_category': 'Link', 'event_label': '${link.title.replace(/'/g, "\\'")}', 'transport_type': 'beacon' })"` 
                    : '';
                
                return `
                <a href="${link.url}" target="_blank" rel="noopener noreferrer" ${clickEvent}
                class="block group link-card ${itemClass} ${shapeClass} ${shadowClass} ${theme.buttonStyle}">
                    
                    <!-- Icon -->
                    <div class="${contentDirection === 'flex-col' ? 'mb-3' : 'mr-4'} ${theme.buttonTextColor} opacity-80">
                        <svg xmlns="http://www.w3.org/2000/svg" width="${contentDirection === 'flex-col' ? '28' : '24'}" height="${contentDirection === 'flex-col' ? '28' : '24'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            ${svgContent}
                        </svg>
                    </div>

                    <span class="text-base font-semibold truncate ${contentDirection === 'flex-row' ? 'flex-1 text-left' : 'w-full'} ${theme.buttonTextColor}">${link.title}</span>
                    
                    <!-- External Link Arrow -->
                    ${layout === 'stack' ? `
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${theme.buttonTextColor} opacity-0 group-hover:opacity-70 transition-opacity ml-2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>` : ''}
                </a>
                `}).join('')}
                
                ${activeLinks.length === 0 ? `<div class="text-center opacity-60 text-sm ${theme.textColor} col-span-full">${t.preview.emptyLinks}</div>` : ''}
            </div>
        </div>
    </div>
</body>
</html>`;

  return { htmlContent, fileName: `${safeTitle || 'linkhub'}.html` };
};