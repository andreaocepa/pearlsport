'use client';

import { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ShareBarProps {
  title: string;
  url: string;
}

export default function ShareBar({ title, url }: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Check this out on Pearlsport: ${title} ${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="flex items-center gap-4 py-6 my-8 border-y border-pearl-soft">
      <span className="font-bold text-dark-text flex items-center gap-2">
        <Share2 size={18} className="text-pearl-red" />
        Share Article
      </span>
      
      <button 
        onClick={handleWhatsApp}
        className="btn-outline border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 flex items-center gap-2"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
        WhatsApp
      </button>

      <button 
        onClick={handleCopy}
        className="btn-outline flex items-center gap-2"
      >
        {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
        {copied ? 'Copied!' : 'Copy Link'}
      </button>
    </div>
  );
}
