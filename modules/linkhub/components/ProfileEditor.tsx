import React, { useState } from 'react';
import { UserProfile, Language } from '../types';
import { Sparkles, Loader2, Upload, Link } from 'lucide-react';
import { generateBio } from '../services/geminiService';
import { Translation } from '../locales';

interface ProfileEditorProps {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  language: Language;
  t: Translation;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile, setProfile, language, t }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [keywords, setKeywords] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatarUrl: reader.result as string });
        setShowUrlInput(false); // Switch back to "uploaded" view essentially
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateBio = async () => {
    if (!keywords.trim()) {
      alert(t.profile.aiError);
      return;
    }

    setIsGenerating(true);
    const newBio = await generateBio(profile.displayName, keywords, profile.bio, language);
    setProfile({ ...profile, bio: newBio });
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-xl font-semibold text-gray-800">{t.profile.title}</h2>
      
      {/* Avatar Section */}
      <div className="flex items-start gap-5 p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
        <div className="relative w-20 h-20 shrink-0 group">
            <img 
                src={profile.avatarUrl} 
                alt="Avatar" 
                className="w-full h-full rounded-full object-cover border border-gray-200 shadow-sm"
            />
        </div>
        
        <div className="flex-1 space-y-3">
             <div className="flex gap-2">
                 {/* Upload File Button */}
                 <label className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors ${!showUrlInput ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
                    <Upload size={16} />
                    <span>{t.profile.imageUpload}</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                 </label>

                 {/* URL Toggle Button */}
                 <button 
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${showUrlInput ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                 >
                    <Link size={16} />
                    <span>{t.profile.imageUrl}</span>
                 </button>
             </div>

             {/* URL Input Field */}
             {showUrlInput && (
                 <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                     <input 
                        type="text" 
                        value={profile.avatarUrl.startsWith('data:') ? '' : profile.avatarUrl}
                        onChange={(e) => setProfile({...profile, avatarUrl: e.target.value})}
                        placeholder={t.profile.urlInputPlaceholder}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                     />
                 </div>
             )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">{t.profile.displayName}</label>
             <input
                type="text"
                name="displayName"
                value={profile.displayName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                placeholder={t.profile.displayNamePlaceholder}
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.profile.bio}</label>
            <textarea
            name="bio"
            value={profile.bio}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
            placeholder={t.profile.bioPlaceholder}
            />
        </div>
      </div>

      <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
        <div className="flex items-center gap-2 mb-2 text-purple-800 font-medium">
            <Sparkles size={18} />
            <span>{t.profile.aiTitle}</span>
        </div>
        <div className="flex gap-2">
            <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder={t.profile.aiPlaceholder}
                className="flex-1 px-3 py-2 text-sm border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
            <button
                onClick={handleGenerateBio}
                disabled={isGenerating}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
                {isGenerating ? <Loader2 size={16} className="animate-spin" /> : t.profile.aiButton}
            </button>
        </div>
        <p className="text-xs text-purple-600/70 mt-2">
            {t.profile.aiDescription}
        </p>
      </div>
    </div>
  );
};

export default ProfileEditor;