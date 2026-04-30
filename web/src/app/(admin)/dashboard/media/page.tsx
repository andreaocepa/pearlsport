'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, Trash2, Copy, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import toast, { Toaster } from 'react-hot-toast';

// Array of actual working Unsplash sports image IDs
const sportsImages = [
  '1579952363873-27f3bade9f55', // Football field
  '1518609878373-06d740f60d8b', // Athletics running
  '1504450758481-7338eba7524a', // Basketball
  '1534158914592-062992fbe900', // Rugby
  '1589487391730-58f20eb2c308', // Boxing
  '1517649763962-0c623066013b', // Stadium replace broken one
  '1526232761682-d26e03ac148e', // Soccer
  '1551269901-5c5e14c25df7',    // Track
];

// Mock Data
const initialMockMedia = Array.from({ length: 8 }).map((_, i) => ({
  id: `m${i}`,
  url: `https://images.unsplash.com/photo-${sportsImages[i]}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
  filename: `upload_${i}.webp`,
  createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
}));

export default function AdminMediaPage() {
  const [mediaItems, setMediaItems] = useState(initialMockMedia);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    noClick: true // We use our own button for clicking
  });

  const handleFiles = (files: File[]) => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      const newItems = files.map((file, i) => ({
        id: `m-new-${Date.now()}-${i}`,
        url: URL.createObjectURL(file), // create local preview
        filename: file.name,
        createdAt: new Date().toISOString(),
      }));
      
      setMediaItems((prev) => [...newItems, ...prev]);
      setIsUploading(false);
      toast.success(`${files.length} file(s) uploaded successfully`);
    }, 1500);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
      e.target.value = ''; // Reset input
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard!');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      setMediaItems((prev) => prev.filter((m) => m.id !== id));
      toast.success('Image deleted');
    }
  };

  return (
    <div {...getRootProps()} className="min-h-[80vh] outline-none">
      <Toaster position="bottom-right" />
      <input {...getInputProps()} />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark-text tracking-tight">Media Library</h1>
          <p className="text-muted-text">Manage images for your articles.</p>
        </div>
        
        <div className="flex gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileInput} 
            className="hidden" 
            multiple 
            accept="image/*"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="btn-primary flex-shrink-0" 
            disabled={isUploading}
          >
            <Upload size={18} />
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      </div>

      <div className={`card p-6 min-h-[500px] transition-colors ${isDragActive ? 'border-pearl-red bg-pearl-light/30 border-dashed border-2' : ''}`}>
        
        {isDragActive && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 rounded-xl backdrop-blur-sm">
            <div className="w-20 h-20 bg-pearl-light text-pearl-red rounded-full flex items-center justify-center mb-4">
              <Upload size={40} />
            </div>
            <h3 className="text-2xl font-bold text-dark-text">Drop images here</h3>
          </div>
        )}

        {mediaItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-muted-text">
            <ImageIcon size={64} className="mb-4 opacity-20" />
            <p>No media files found.</p>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 text-pearl-red hover:underline font-bold"
            >
              Upload your first image
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mediaItems.map((media) => (
              <div key={media.id} className="group relative border border-pearl-soft rounded-md overflow-hidden bg-warm-white aspect-[4/3] shadow-sm hover:shadow-md transition-shadow">
                <Image 
                  src={media.url} 
                  alt={media.filename} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-300" 
                  unoptimized={media.url.startsWith('blob:')} // Prevent Next.js from trying to optimize local blob URLs
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
                
                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <div className="flex justify-end">
                    <button onClick={() => handleDelete(media.id)} className="p-1.5 bg-white text-red-600 rounded hover:bg-red-50 transition-colors shadow-sm" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div>
                    <p className="text-white text-xs truncate mb-2 drop-shadow-md font-medium">{media.filename}</p>
                    <button onClick={() => copyToClipboard(media.url)} className="w-full py-1.5 bg-pearl-red text-white text-xs font-bold rounded flex items-center justify-center gap-2 hover:bg-pearl-deep transition-colors shadow-sm">
                      <Copy size={14} /> Copy URL
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
