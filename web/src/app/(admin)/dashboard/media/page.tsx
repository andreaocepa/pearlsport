'use client';

import { useState } from 'react';
import { Upload, Trash2, Copy } from 'lucide-react';
import Image from 'next/image';

// Mock Data
const mockMedia = Array.from({ length: 12 }).map((_, i) => ({
  id: `m${i}`,
  url: `https://images.unsplash.com/photo-${1500000000000 + i}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
  filename: `upload_${i}.webp`,
  createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
}));

export default function AdminMediaPage() {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark-text tracking-tight">Media Library</h1>
          <p className="text-muted-text">Manage images for your articles.</p>
        </div>
        
        <button className="btn-primary" disabled={isUploading}>
          <Upload size={18} />
          {isUploading ? 'Uploading...' : 'Upload Image'}
        </button>
      </div>

      <div className="card p-6 min-h-[500px]">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockMedia.map((media) => (
            <div key={media.id} className="group relative border border-pearl-soft rounded-md overflow-hidden bg-warm-white aspect-[4/3]">
              <Image 
                src={media.url} 
                alt={media.filename} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-300" 
              />
              
              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="flex justify-end">
                  <button className="p-1.5 bg-white text-red-600 rounded hover:bg-red-50 transition-colors" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div>
                  <p className="text-white text-xs truncate mb-2">{media.filename}</p>
                  <button className="w-full py-1.5 bg-pearl-red text-white text-xs font-bold rounded flex items-center justify-center gap-2 hover:bg-pearl-deep transition-colors">
                    <Copy size={14} /> Copy URL
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
