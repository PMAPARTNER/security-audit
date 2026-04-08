import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { X, Copy, Check, Download, QrCode } from 'lucide-react';
import { Translation } from '../locales';
import { UserProfile } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  profile: UserProfile;
  t: Translation;
  published: boolean;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, url, profile, t, published }) => {
  const [copied, setCopied] = useState(false);
  const [qrStyle, setQrStyle] = useState<'classic' | 'brand' | 'soft' | 'dark'>('classic');
  const qrRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${profile.displayName || 'linkhub'}_qr.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  // QR Style Configurations - Optimized for Scannability
  // Dark modules on Light background is the ISO standard. 
  // "Inverted" QR codes (Light on Dark) often fail on standard scanners.
  // Updated colors ensure high contrast ratios (>4:1).
  const styles = {
    classic: { fg: '#000000', bg: '#ffffff', logo: false },
    brand: { fg: '#5b21b6', bg: '#ffffff', logo: true }, // Violet-800 on White
    soft: { fg: '#312e81', bg: '#e0e7ff', logo: false }, // Indigo-900 on Indigo-100
    dark: { fg: '#0f172a', bg: '#f8fafc', logo: false }, // Slate-900 on Slate-50 (Standard polarity, dark aesthetic)
  };

  const currentStyle = styles[qrStyle];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <QrCode className="text-purple-600" size={24} />
            {t.share.title}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* URL Copy Section */}
          <div className="space-y-2">
            {!published && (
               <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-100 mb-2">
                  {t.share.warning}
               </div>
            )}
            <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl">
              <span className="flex-1 text-sm font-medium text-gray-700 truncate">{url}</span>
              <button 
                onClick={handleCopy}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${copied ? 'bg-green-100 text-green-700' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'}`}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Kopyalandı' : 'Kopyala'}
              </button>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* QR Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold text-gray-700">{t.share.qrTitle}</span>
                <div className="flex gap-2">
                    <button onClick={() => setQrStyle('classic')} className={`w-8 h-8 rounded-full border-2 bg-white flex items-center justify-center ${qrStyle === 'classic' ? 'border-purple-600' : 'border-gray-200'}`} title={t.share.styles.classic}>
                        <div className="w-4 h-4 bg-black rounded-full"></div>
                    </button>
                    <button onClick={() => setQrStyle('brand')} className={`w-8 h-8 rounded-full border-2 bg-white flex items-center justify-center ${qrStyle === 'brand' ? 'border-purple-600' : 'border-gray-200'}`} title={t.share.styles.brand}>
                        <div className="w-4 h-4 bg-violet-800 rounded-full"></div>
                    </button>
                    <button onClick={() => setQrStyle('soft')} className={`w-8 h-8 rounded-full border-2 bg-indigo-50 flex items-center justify-center ${qrStyle === 'soft' ? 'border-purple-600' : 'border-gray-200'}`} title={t.share.styles.soft}>
                        <div className="w-4 h-4 bg-indigo-900 rounded-full"></div>
                    </button>
                    <button onClick={() => setQrStyle('dark')} className={`w-8 h-8 rounded-full border-2 bg-slate-100 flex items-center justify-center ${qrStyle === 'dark' ? 'border-purple-600' : 'border-gray-200'}`} title={t.share.styles.dark}>
                        <div className="w-4 h-4 bg-slate-900 rounded-full"></div>
                    </button>
                </div>
            </div>

            <div className="flex flex-col items-center">
                <div 
                    ref={qrRef}
                    className="p-4 rounded-xl shadow-inner border border-gray-200 inline-block mb-4 transition-colors duration-300"
                    style={{ backgroundColor: currentStyle.bg }}
                >
                    <QRCodeCanvas
                        value={url}
                        size={200}
                        bgColor={currentStyle.bg}
                        fgColor={currentStyle.fg}
                        level={"H"}
                        includeMargin={true}
                        imageSettings={currentStyle.logo && profile.avatarUrl ? {
                            src: profile.avatarUrl,
                            x: undefined,
                            y: undefined,
                            height: 40,
                            width: 40,
                            excavate: true,
                        } : undefined}
                    />
                </div>

                <button 
                    onClick={handleDownloadQR}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-all shadow-lg hover:-translate-y-0.5"
                >
                    <Download size={18} />
                    {t.share.downloadQr}
                </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ShareModal;