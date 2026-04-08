import { ThemeId } from "./types";

export const translations = {
  tr: {
    header: {
      download: 'HTML İndir',
      publish: 'Yayınla',
      share: 'Paylaş',
      alert: 'Bağlantı panoya kopyalandı!'
    },
    share: {
      title: 'Profilini Paylaş',
      desc: 'Bağlantını kopyala veya QR kodunu indirerek paylaş.',
      copyLink: 'Bağlantıyı Kopyala',
      qrTitle: 'QR Kod Tasarımı',
      downloadQr: 'QR İndir (PNG)',
      styles: {
        classic: 'Klasik',
        brand: 'Marka',
        soft: 'Yumuşak',
        dark: 'Gece'
      },
      warning: 'Henüz yayınlamadınız. Bu QR kodu geçici bir URL kullanabilir.'
    },
    tabs: {
      links: 'Bağlantılar',
      profile: 'Profil',
      appearance: 'Görünüm',
      analytics: 'Analiz',
      settings: 'Ayarlar'
    },
    landing: {
      hero: {
        badge: '✨ Sosyal Medya İçin En İyi Araç',
        title: 'Tek Bağlantı,\nSınırsız Olasılık',
        description: 'Tüm sosyal medya hesaplarınızı, içeriklerinizi ve ürünlerinizi tek bir güzel sayfada toplayın. Kodlama gerekmez, saniyeler içinde oluşturun.',
        cta: 'Ücretsiz Oluştur',
        login: 'Giriş Yap'
      },
      features: {
        title: 'Neden LinkHub?',
        customization: 'Sınırsız Özelleştirme',
        customizationDesc: 'Markanıza uygun renkler, fontlar ve düzenler seçin.',
        analytics: 'Güçlü Analitik',
        analyticsDesc: 'Ziyaretçilerinizi anlayın, tıklamaları ve performansı takip edin.',
        ai: 'Yapay Zeka Desteği',
        aiDesc: 'Gemini AI ile saniyeler içinde etkileyici biyografiler oluşturun.',
        responsive: 'Her Cihazda Harika',
        responsiveDesc: 'Mobil, tablet ve masaüstünde kusursuz görünüm.'
      },
      footer: {
        rights: 'Tüm hakları saklıdır.'
      }
    },
    profile: {
      title: 'Profil Bilgileri',
      displayName: 'Görünen İsim',
      displayNamePlaceholder: '@kullanici',
      bio: 'Biyografi',
      bioPlaceholder: 'Kendinizden bahsedin...',
      aiTitle: 'AI Biyografi Oluşturucu',
      aiPlaceholder: 'Örn: dijital sanat, kahve, seyahat...',
      aiButton: 'Oluştur',
      aiGenerating: 'Oluşturuluyor...',
      aiDescription: 'Gemini AI kullanarak profiliniz için saniyeler içinde etkileyici bir biyografi yazın.',
      aiError: 'Lütfen yapay zeka için ilgi alanları veya anahtar kelimeler girin.',
      imageUpload: 'Yükle',
      imageUrl: 'Bağlantı',
      urlInputPlaceholder: 'https://ornek.com/resim.png'
    },
    links: {
      title: 'Bağlantılar',
      count: 'bağlantı',
      addPlaceholder: 'URL ekle (örn: instagram.com/profilim)',
      addButton: 'Ekle',
      emptyState: 'Listeniz boş. Yukarıdan yeni bir bağlantı ekleyin.',
      titlePlaceholder: 'Başlık',
      urlPlaceholder: 'URL',
      toggleLabel: 'Aktif'
    },
    appearance: {
      title: 'Görünüm ve Tema',
      description: 'Profilinizin ziyaretçilere nasıl görüneceğini seçin.',
      customBg: 'Özel Arkaplan',
      customBgDesc: 'Temanın üzerine kendi görselinizi yükleyin.',
      upload: 'Görsel Yükle',
      remove: 'Kaldır',
      themes: 'Temalar',
      buttonStyle: 'Buton Stili',
      layoutStyle: 'Yerleşim Düzeni',
      avatarShape: 'Profil Resmi Şekli',
      shapes: {
        title: 'Şekil',
        square: 'Kare',
        rounded: 'Oval',
        pill: 'Kapsül',
        circle: 'Yuvarlak',
        star: 'Yıldız',
        blob: 'Akışkan',
        full: 'Tam Genişlik'
      },
      shadows: {
        title: 'Gölge & Efekt',
        none: 'Düz',
        soft: 'Yumuşak',
        hard: 'Sert'
      },
      layouts: {
        stack: 'Liste',
        grid: 'Izgara',
        masonry: 'Duvar'
      }
    },
    analytics: {
      title: 'Performans Analizi',
      description: 'Bağlantılarınızın ne kadar etkileşim aldığını takip edin.',
      views: 'Görüntülenme',
      clicks: 'Toplam Tıklama',
      ctr: 'Tıklama Oranı (CTR)',
      topLinks: 'En Çok Tıklanan Bağlantılar',
      noData: 'Henüz veri yok.',
      settingsTitle: 'Google Analytics Entegrasyonu',
      settingsDesc: 'Gerçek zamanlı ziyaretçi takibi için Google Analytics Measurement ID (G-XXXXX) girin.',
      gaPlaceholder: 'G-XXXXXXXXXX',
      demoNote: 'Not: Yukarıdaki grafikler önizleme modundaki test tıklamalarınızı gösterir. Gerçek site verileri için Google Analytics panelinizi kullanmalısınız.',
      refresh: 'Verileri Yenile',
      last7Days: 'Son 7 Günlük Aktivite',
      devices: 'Cihaz Dağılımı',
      desktop: 'Masaüstü',
      mobile: 'Mobil',
      connect: 'Bağla',
      connected: 'Bağlandı',
      connecting: 'Veri Çekiliyor...',
      invalidID: 'Geçersiz ID Formatı (G-XXXXX olmalı)'
    },
    settings: {
      title: 'Site Ayarları',
      description: 'Manage domain and browser appearance settings.',
      customDomain: 'Özel Alan Adı (Custom Domain)',
      customDomainPlaceholder: 'örn: link.websitem.com',
      favicon: 'Favicon',
      faviconDesc: 'Tarayıcı sekmelerinde görünen küçük ikon.',
      uploadFavicon: 'İkon Yükle',
      removeFavicon: 'İkonu Kaldır',
      dnsInstructions: 'DNS Yapılandırması',
      dnsText: 'Kendi alan adınızı kullanmak için alan adı sağlayıcınızda aşağıdaki kayıtları eklemeniz gerekir:',
      dnsSubdomain: 'Alt Alan Adı (Subdomain)',
      dnsApex: 'Ana Alan Adı (Apex Domain)',
      type: 'Tür',
      name: 'Ad (Host)',
      value: 'Değer (Hedef)',
      saveNote: 'Alan adını girdikten sonra yukarıdaki "Yayınla" butonuna basarak CNAME dosyasını GitHub\'a gönderin.'
    },
    preview: {
      emptyLinks: 'Henüz bağlantı eklenmedi.',
      branding: 'LinkHub',
      return: 'Düzenlemeye Dön'
    },
    html: {
        footer: 'ile oluşturuldu'
    },
    publishModal: {
        title: 'Yayında! 🎉',
        description: 'LinkHub sayfanız başarıyla güncellendi.',
        copy: 'Kopyala',
        copied: 'Kopyalandı!',
        close: 'Kapat',
        note: 'Not: Değişikliklerin yansıması GitHub Pages önbelleği nedeniyle 1-2 dakika sürebilir.'
    },
    github: {
        title: 'GitHub Bağlantısı',
        description: 'Sayfanızı ücretsiz yayınlamak için GitHub bilgilerinizi girin. Bu bilgiler sadece tarayıcınızda saklanır.',
        username: 'Kullanıcı Adı (Username)',
        repo: 'Depo Adı (Repository)',
        token: 'Erişim Jetonu (Personal Access Token)',
        save: 'Kaydet ve Yayınla',
        error: 'Bağlantı hatası. Lütfen bilgilerinizi kontrol edin.',
        guide: 'Token nasıl alınır? Settings > Developer Settings > Tokens (Classic) > Select Repo scope.'
    },
    themes: {
        classic: 'Klasik Beyaz',
        dark: 'Modern Siyah',
        midnight: 'Midnight',
        ocean: 'Ocean Breeze',
        sunset: 'Sunset',
        forest: 'Deep Forest',
        coffee: 'Warm Coffee',
        candy: 'Candy Pink',
        cyberpunk: 'Cyberpunk',
        retro: '90s Retro'
    } as Record<ThemeId, string>
  },
  en: {
    header: {
      download: 'Download HTML',
      publish: 'Publish',
      share: 'Share',
      alert: 'Link copied to clipboard!'
    },
    share: {
      title: 'Share Profile',
      desc: 'Copy your link or download a custom QR code.',
      copyLink: 'Copy Link',
      qrTitle: 'QR Code Design',
      downloadQr: 'Download QR (PNG)',
      styles: {
        classic: 'Classic',
        brand: 'Brand',
        soft: 'Soft',
        dark: 'Dark'
      },
      warning: 'You haven\'t published yet. This QR uses a temporary URL.'
    },
    tabs: {
      links: 'Links',
      profile: 'Profile',
      appearance: 'Appearance',
      analytics: 'Analytics',
      settings: 'Settings'
    },
    landing: {
      hero: {
        badge: '✨ The Best Tool for Social Media',
        title: 'One Link,\nInfinite Possibilities',
        description: 'Collect all your social media accounts, content, and products in one beautiful page. No coding required, build in seconds.',
        cta: 'Create for Free',
        login: 'Login'
      },
      features: {
        title: 'Why LinkHub?',
        customization: 'Limitless Customization',
        customizationDesc: 'Choose colors, fonts, and layouts that match your brand.',
        analytics: 'Powerful Analytics',
        analyticsDesc: 'Understand your visitors, track clicks and performance.',
        ai: 'AI Powered',
        aiDesc: 'Generate impressive bios in seconds with Gemini AI.',
        responsive: 'Great on Any Device',
        responsiveDesc: 'Flawless look on mobile, tablet, and desktop.'
      },
      footer: {
        rights: 'All rights reserved.'
      }
    },
    profile: {
      title: 'Profile Information',
      displayName: 'Display Name',
      displayNamePlaceholder: '@username',
      bio: 'Bio',
      bioPlaceholder: 'Tell us about yourself...',
      aiTitle: 'AI Bio Generator',
      aiPlaceholder: 'Ex: digital art, coffee, travel...',
      aiButton: 'Generate',
      aiGenerating: 'Generating...',
      aiDescription: 'Write an impressive bio for your profile in seconds using Gemini AI.',
      aiError: 'Please enter interests or keywords for the AI.',
      imageUpload: 'Upload',
      imageUrl: 'URL',
      urlInputPlaceholder: 'https://example.com/image.png'
    },
    links: {
      title: 'Links',
      count: 'links',
      addPlaceholder: 'Add URL (ex: instagram.com/myprofile)',
      addButton: 'Add',
      emptyState: 'Your list is empty. Add a new link above.',
      titlePlaceholder: 'Title',
      urlPlaceholder: 'URL',
      toggleLabel: 'Active'
    },
    appearance: {
      title: 'Appearance & Theme',
      description: 'Choose how your profile looks to visitors.',
      customBg: 'Custom Background',
      customBgDesc: 'Upload your own image to override the theme background.',
      upload: 'Upload Image',
      remove: 'Remove',
      themes: 'Themes',
      buttonStyle: 'Button Style',
      layoutStyle: 'Layout Style',
      avatarShape: 'Avatar Shape',
      shapes: {
        title: 'Shape',
        square: 'Square',
        rounded: 'Rounded',
        pill: 'Pill',
        circle: 'Circle',
        star: 'Star',
        blob: 'Blob',
        full: 'Full Width'
      },
      shadows: {
        title: 'Shadow & Effect',
        none: 'Flat',
        soft: 'Soft',
        hard: 'Hard'
      },
      layouts: {
        stack: 'Stack',
        grid: 'Grid',
        masonry: 'Masonry'
      }
    },
    analytics: {
      title: 'Performance Analytics',
      description: 'Track how your links are performing.',
      views: 'Total Views',
      clicks: 'Total Clicks',
      ctr: 'Click Through Rate',
      topLinks: 'Top Performing Links',
      noData: 'No data yet.',
      settingsTitle: 'Google Analytics Integration',
      settingsDesc: 'Enter your Google Analytics Measurement ID (G-XXXXX) for real-time visitor tracking.',
      gaPlaceholder: 'G-XXXXXXXXXX',
      demoNote: 'Note: The charts above show test clicks from preview mode. For live site data, please check your Google Analytics dashboard.',
      refresh: 'Refresh Data',
      last7Days: 'Last 7 Days Activity',
      devices: 'Device Distribution',
      desktop: 'Desktop',
      mobile: 'Mobile',
      connect: 'Connect',
      connected: 'Connected',
      connecting: 'Fetching Data...',
      invalidID: 'Invalid ID Format (must be G-XXXXX)'
    },
    settings: {
      title: 'Site Settings',
      description: 'Manage domain and browser appearance settings.',
      customDomain: 'Custom Domain',
      customDomainPlaceholder: 'e.g. links.mywebsite.com',
      favicon: 'Favicon',
      faviconDesc: 'Small icon shown in browser tabs.',
      uploadFavicon: 'Upload Icon',
      removeFavicon: 'Remove Icon',
      dnsInstructions: 'DNS Configuration',
      dnsText: 'You must add the following DNS record at your domain provider to use your own domain:',
      dnsSubdomain: 'Subdomain',
      dnsApex: 'Apex Domain',
      type: 'Record Type',
      name: 'Name',
      value: 'Value (Target)',
      saveNote: 'After entering the domain, click the "Publish" button above to push the CNAME file to GitHub.'
    },
    preview: {
      emptyLinks: 'No links added yet.',
      branding: 'LinkHub',
      return: 'Back to Editor'
    },
    html: {
        footer: 'created with'
    },
    publishModal: {
        title: 'It\'s Live! 🎉',
        description: 'Your LinkHub page has been successfully updated.',
        copy: 'Copy',
        copied: 'Copied!',
        close: 'Close',
        note: 'Note: Changes may take 1-2 minutes to reflect due to GitHub Pages caching.'
    },
    github: {
        title: 'GitHub Connection',
        description: 'Enter your GitHub details to publish for free. These are stored only in your browser.',
        username: 'Username',
        repo: 'Repository Name',
        token: 'Personal Access Token',
        save: 'Save & Publish',
        error: 'Connection error. Please check your details.',
        guide: 'How to get Token? Settings > Developer Settings > Tokens (Classic) > Select Repo scope.'
    },
    themes: {
        classic: 'Classic White',
        dark: 'Modern Black',
        midnight: 'Midnight',
        ocean: 'Ocean Breeze',
        sunset: 'Sunset',
        forest: 'Deep Forest',
        coffee: 'Warm Coffee',
        candy: 'Candy Pink',
        cyberpunk: 'Cyberpunk',
        retro: '90s Retro'
    } as Record<ThemeId, string>
  }
};

export type Translation = typeof translations.tr;