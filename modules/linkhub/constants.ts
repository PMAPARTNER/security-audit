import { ThemeConfig, UserProfile, LinkItem } from './types';
import { Instagram, X, Linkedin, Github, Youtube, Facebook, Mail, Globe, Twitch } from 'lucide-react';

export const THEMES: ThemeConfig[] = [
  {
    id: 'classic',
    name: 'Klasik Beyaz',
    background: 'bg-white',
    buttonStyle: 'bg-gray-100 hover:bg-gray-200 border border-gray-200 shadow-sm',
    textColor: 'text-gray-900',
    buttonTextColor: 'text-gray-900',
  },
  {
    id: 'dark',
    name: 'Modern Siyah',
    background: 'bg-gray-900',
    buttonStyle: 'bg-gray-800 hover:bg-gray-700 border border-gray-700',
    textColor: 'text-white',
    buttonTextColor: 'text-white',
  },
  {
    id: 'midnight',
    name: 'Gece Yarısı',
    background: 'bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900',
    buttonStyle: 'bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10',
    textColor: 'text-white',
    buttonTextColor: 'text-white',
  },
  {
    id: 'ocean',
    name: 'Okyanus Esintisi',
    background: 'bg-gradient-to-b from-blue-100 to-blue-300',
    buttonStyle: 'bg-white/80 hover:bg-white backdrop-blur-sm shadow-md',
    textColor: 'text-blue-900',
    buttonTextColor: 'text-blue-800',
  },
  {
    id: 'sunset',
    name: 'Gün Batımı',
    background: 'bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600',
    buttonStyle: 'bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white',
    textColor: 'text-white',
    buttonTextColor: 'text-white',
  },
  {
    id: 'forest',
    name: 'Derin Orman',
    background: 'bg-gradient-to-b from-green-800 to-slate-900',
    buttonStyle: 'bg-green-900/50 hover:bg-green-900/70 border border-green-700/50',
    textColor: 'text-green-50',
    buttonTextColor: 'text-green-100',
  },
  {
    id: 'coffee',
    name: 'Sıcak Kahve',
    background: 'bg-[#F5E6D3]',
    buttonStyle: 'bg-[#4A3B2C] hover:bg-[#63513D] text-[#F5E6D3] shadow-md',
    textColor: 'text-[#4A3B2C]',
    buttonTextColor: 'text-[#F5E6D3]',
  },
  {
    id: 'candy',
    name: 'Şeker Pembesi',
    background: 'bg-gradient-to-tr from-pink-300 via-purple-300 to-indigo-400',
    buttonStyle: 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] transition-all',
    textColor: 'text-slate-800',
    buttonTextColor: 'text-slate-900 font-bold',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    background: 'bg-black',
    buttonStyle: 'bg-black border border-[#00ff00] hover:bg-[#00ff00] hover:text-black text-[#00ff00] shadow-[0_0_10px_#00ff00] transition-colors',
    textColor: 'text-[#00ff00]',
    buttonTextColor: 'font-mono',
  },
  {
    id: 'retro',
    name: '90lar Retro',
    background: 'bg-[#ff00ff]',
    buttonStyle: 'bg-[#ffff00] border-4 border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
    textColor: 'text-white font-bold drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]',
    buttonTextColor: 'text-black font-bold',
  }
];

export const DEFAULT_PROFILE: UserProfile = {
  username: 'kullanici',
  displayName: 'Yeni Kullanıcı',
  bio: 'Harika bağlantılarınız burada yer alacak.',
  avatarUrl: 'https://picsum.photos/200/200',
};

export const DEFAULT_LINKS: LinkItem[] = [
  { id: '1', title: 'Instagram', url: 'https://instagram.com', active: true, icon: 'instagram' },
  { id: '2', title: 'Web Sitem', url: 'https://example.com', active: true, icon: 'globe' },
  { id: '3', title: 'YouTube Kanalım', url: 'https://youtube.com', active: true, icon: 'youtube' },
];

export const ICON_OPTIONS: Record<string, { component: any, label: string }> = {
  instagram: { component: Instagram, label: 'Instagram' },
  twitter: { component: X, label: 'X (Twitter)' },
  linkedin: { component: Linkedin, label: 'LinkedIn' },
  github: { component: Github, label: 'GitHub' },
  youtube: { component: Youtube, label: 'YouTube' },
  facebook: { component: Facebook, label: 'Facebook' },
  twitch: { component: Twitch, label: 'Twitch' },
  mail: { component: Mail, label: 'Email' },
  globe: { component: Globe, label: 'Website' },
};