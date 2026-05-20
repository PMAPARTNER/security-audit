import { useState, useEffect } from 'react';
import { LinkItem, UserProfile, ThemeConfig, Language, AnalyticsStats } from '../types';
import { generateHtml } from '../utils/htmlGenerator';
import { uploadToGitHub } from '../services/githubService';

interface GithubConfig {
  username: string;
  repo: string;
  token: string;
}

export function useGithubPublisher(
  profile: UserProfile,
  links: LinkItem[],
  theme: ThemeConfig,
  language: Language,
  analytics: AnalyticsStats,
  t: any
) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showPublishSuccess, setShowPublishSuccess] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);

  // GitHub Config Form - Initialize empty for security
  const [githubConfig, setGithubConfig] = useState<GithubConfig>({ 
    username: '', 
    repo: 'baglantilarim', 
    token: '' 
  });

  // Load GitHub config from local storage on mount OR auto-detect user from hardcoded token
  useEffect(() => {
    const savedConfig = localStorage.getItem('linkhub_github_config');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setGithubConfig(config);
      // Reconstruct URL if we have a config
      if (config.username && config.repo) {
        setPublishedUrl(`https://${config.username}.github.io/${config.repo}/`);
      }
    } else {
      // Auto-detect username if we have a token but no local storage
      const detectUser = async () => {
        if (githubConfig.token) {
          try {
            const res = await fetch('https://api.github.com/user', {
              headers: { Authorization: `token ${githubConfig.token}` }
            });
            if (res.ok) {
              const data = await res.json();
              setGithubConfig(prev => ({ ...prev, username: data.login }));
            }
          } catch (e) {
            console.error("Auto-detect failed", e);
          }
        }
      };
      detectUser();
    }
  }, []);

  const handleDownload = () => {
    const { htmlContent, fileName } = generateHtml(profile, links, theme, language, t, analytics);
    
    // Create blob and download link
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const initiatePublish = () => {
    // Check if we have config
    if (!githubConfig.username || !githubConfig.repo || !githubConfig.token) {
      setShowConfigModal(true);
    } else {
      performPublish(githubConfig);
    }
  };

  const performPublish = async (config: GithubConfig) => {
    setIsPublishing(true);
    setConfigError(null);
    
    try {
      // Generate HTML
      const { htmlContent } = generateHtml(profile, links, theme, language, t, analytics);
      
      // 1. Upload index.html to GitHub
      let url = await uploadToGitHub(config, htmlContent, 'index.html');
      
      // 2. Upload CNAME if custom domain is set
      if (profile.customDomain && profile.customDomain.trim() !== '') {
        await uploadToGitHub(config, profile.customDomain.trim(), 'CNAME');
        url = `https://${profile.customDomain.trim()}/`;
      }

      // Save valid config
      localStorage.setItem('linkhub_github_config', JSON.stringify(config));
      
      setPublishedUrl(url);
      setShowConfigModal(false);
      if (!configError) setShowPublishSuccess(true);
    } catch (error: any) {
      console.error(error);
      setConfigError(error.message || t.github.error);
      // Re-open config modal if it failed and wasn't open
      setShowConfigModal(true);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveConfig = () => {
    // Validate Token Format
    if (!githubConfig.token.trim().startsWith('ghp_') && !githubConfig.token.trim().startsWith('github_pat_')) {
      setConfigError(language === 'tr' 
        ? 'Geçersiz format. GitHub Jetonları genellikle "ghp_" ile başlar.' 
        : 'Invalid format. GitHub Tokens usually start with "ghp_".');
      return;
    }
    performPublish(githubConfig);
  };

  const copyPublishedUrl = () => {
    if (publishedUrl) {
      navigator.clipboard.writeText(publishedUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return {
    isPublishing,
    publishedUrl,
    setPublishedUrl,
    isCopied,
    showConfigModal,
    setShowConfigModal,
    showPublishSuccess,
    setShowPublishSuccess,
    configError,
    setConfigError,
    githubConfig,
    setGithubConfig,
    handleDownload,
    initiatePublish,
    performPublish,
    handleSaveConfig,
    copyPublishedUrl
  };
}
