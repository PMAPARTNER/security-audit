import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Translation } from '../locales';
import { Globe, Server, Info, Image, Upload, X, Copy, Check, ExternalLink } from 'lucide-react';

interface SettingsEditorProps {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  t: Translation;
  githubUsername?: string;
}

const SettingsEditor: React.FC<SettingsEditorProps> = ({ profile, setProfile, t, githubUsername }) => {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [dnsTab, setDnsTab] = useState<'subdomain' | 'apex'>('subdomain');
  const targetDomain = githubUsername ? `${githubUsername}.github.io` : 'username.github.io';

  const GITHUB_IPS = [
    '185.199.108.153',
    '185.199.109.153',
    '185.199.110.153',
    '185.199.111.153'
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedValue(text);
    setTimeout(() => setCopiedValue(null), 2000);
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, favicon: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFavicon = () => {
    setProfile({ ...profile, favicon: undefined });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">{t.settings.title}</h2>
        <p className="text-sm text-gray-500">{t.settings.description}</p>
      </div>

      {/* Domain Input */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Globe size={16} />
                  {t.settings.customDomain}
              </label>
              <div className="relative">
                  <input
                      type="text"
                      value={profile.customDomain || ''}
                      onChange={(e) => setProfile({ ...profile, customDomain: e.target.value.toLowerCase().trim() })}
                      placeholder={t.settings.customDomainPlaceholder}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all font-mono text-sm pr-12"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300">
                      <Globe size={18} />
                  </div>
              </div>
          </div>
          <div className="flex items-start gap-3 text-xs text-amber-600 bg-amber-50 p-4 rounded-xl border border-amber-100">
             <Info size={18} className="shrink-0 mt-0.5 text-amber-500" />
             <p className="leading-relaxed">{t.settings.saveNote}</p>
          </div>
      </div>

      {/* DNS Instructions */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-gray-800 font-semibold">
                  <Server size={18} className="text-purple-600" />
                  <span>{t.settings.dnsInstructions}</span>
              </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-6">
              {t.settings.dnsText}
          </p>

          {/* Instructions Tabs */}
          <div className="flex border-b border-gray-100 mb-4">
              <button 
                onClick={() => setDnsTab('subdomain')}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${dnsTab === 'subdomain' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                {t.settings.dnsSubdomain}
              </button>
              <button 
                onClick={() => setDnsTab('apex')}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${dnsTab === 'apex' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                {t.settings.dnsApex}
              </button>
          </div>

          <div className="overflow-hidden border border-gray-200 rounded-lg bg-gray-50/50">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                      <tr>
                          <th className="px-4 py-3 text-left font-bold text-gray-500 uppercase tracking-wider text-[10px]">{t.settings.type}</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-500 uppercase tracking-wider text-[10px]">{t.settings.name}</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-500 uppercase tracking-wider text-[10px]">{t.settings.value}</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                      {dnsTab === 'subdomain' ? (
                          <tr>
                              <td className="px-4 py-3 font-mono text-gray-900 font-semibold">CNAME</td>
                              <td className="px-4 py-3 text-gray-600">www <span className="text-gray-400 text-[10px] block">veya alt alan adınız</span></td>
                              <td className="px-4 py-3">
                                  <div className="flex items-center justify-between group">
                                      <code className="text-purple-600 font-mono font-medium">{targetDomain}</code>
                                      <button 
                                        onClick={() => copyToClipboard(targetDomain)}
                                        className="p-1 text-gray-300 hover:text-purple-600 transition-colors"
                                      >
                                          {copiedValue === targetDomain ? <Check size={14} /> : <Copy size={14} />}
                                      </button>
                                  </div>
                              </td>
                          </tr>
                      ) : (
                          GITHUB_IPS.map((ip, idx) => (
                              <tr key={idx}>
                                  <td className="px-4 py-3 font-mono text-gray-900 font-semibold">A</td>
                                  <td className="px-4 py-3 text-gray-600">@ <span className="text-gray-400 text-[10px] block">veya boş bırakın</span></td>
                                  <td className="px-4 py-3">
                                      <div className="flex items-center justify-between group">
                                          <code className="text-purple-600 font-mono font-medium">{ip}</code>
                                          <button 
                                            onClick={() => copyToClipboard(ip)}
                                            className="p-1 text-gray-300 hover:text-purple-600 transition-colors"
                                          >
                                              {copiedValue === ip ? <Check size={14} /> : <Copy size={14} />}
                                          </button>
                                      </div>
                                  </td>
                              </tr>
                          ))
                      )}
                  </tbody>
              </table>
          </div>
          
          <div className="mt-4 flex items-center gap-2 text-[10px] text-gray-400 italic">
              <ExternalLink size={10} />
              <a href="https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site" target="_blank" rel="noreferrer" className="hover:underline">
                  GitHub Pages alan adı dokümantasyonunu görüntüle
              </a>
          </div>
      </div>

      {/* Favicon Input */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-gray-800 font-semibold">
             <Image size={18} className="text-purple-600" />
             <span>{t.settings.favicon}</span>
          </div>
          <p className="text-sm text-gray-500 mb-6">{t.settings.faviconDesc}</p>
          
          <div className="flex items-center gap-6">
             <div className="w-20 h-20 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                 {profile.favicon ? (
                     <img src={profile.favicon} alt="Favicon" className="w-12 h-12 object-contain" />
                 ) : (
                     <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">L</div>
                 )}
             </div>
             
             <div className="flex flex-col sm:flex-row gap-3">
                 <label className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center gap-2 transition-all shadow-sm">
                     <Upload size={16} />
                     {t.settings.uploadFavicon}
                     <input type="file" accept="image/png, image/jpeg, image/x-icon, image/svg+xml" className="hidden" onChange={handleFaviconUpload} />
                 </label>
                 
                 {profile.favicon && (
                     <button 
                         onClick={removeFavicon}
                         className="px-5 py-2.5 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 flex items-center gap-2 transition-all border border-transparent shadow-sm"
                     >
                         <X size={16} />
                         {t.settings.removeFavicon}
                     </button>
                 )}
             </div>
          </div>
      </div>

    </div>
  );
};

export default SettingsEditor;