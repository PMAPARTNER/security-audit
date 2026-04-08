export type Language = 'tr' | 'en';

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  active: boolean;
  icon?: string;
}

export interface UserProfile {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  avatarShape?: 'circle' | 'square' | 'rounded' | 'star' | 'blob' | 'full'; // New shape options
  favicon?: string; // Base64 Data URL for custom favicon
  customDomain?: string;
  customBackground?: string;
  buttonShape?: 'square' | 'rounded' | 'pill';
  buttonShadow?: 'none' | 'soft' | 'hard';
  layout?: 'stack' | 'grid' | 'masonry';
}

export type ThemeId = 'classic' | 'dark' | 'ocean' | 'sunset' | 'forest' | 'candy' | 'midnight' | 'coffee' | 'cyberpunk' | 'retro';

export interface ThemeConfig {
  id: ThemeId;
  name: string; // Fallback name
  background: string;
  buttonStyle: string;
  textColor: string;
  buttonTextColor: string;
}

export interface AnalyticsStats {
  pageViews: number;
  totalClicks: number;
  linkClicks: Record<string, number>;
  gaMeasurementId: string; // Google Analytics Measurement ID (G-XXXXXXXXXX)
}