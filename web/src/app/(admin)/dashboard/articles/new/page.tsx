'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Send, Image as ImageIcon } from 'lucide-react';
import TiptapEditor from '@/components/editor/TiptapEditor';

export default function NewArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState<Record<string, any>>({});
  const [sportId, setSportId] = useState('football'); // Mock default
  const [isSaving, setIsSaving] = useState(false);

  // Mock saving function
  const handleSave = async (status: 'DRAFT' | 'REVIEW') => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      router.push('/dashboard/articles');
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-warm-white z-20 py-4 border-b border-pearl-soft">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/articles" className="p-2 bg-white border border-pearl-soft rounded-md hover:bg-pearl-light text-muted-text transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-2xl font-bold text-dark-text tracking-tight">Create Article</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleSave('DRAFT')}
            disabled={isSaving}
            className="btn-outline bg-white flex items-center gap-2 py-2"
          >
            <Save size={16} />
            Save Draft
          </button>
          <button 
            onClick={() => handleSave('REVIEW')}
            disabled={isSaving || !title.trim()}
            className="btn-primary flex items-center gap-2 py-2"
          >
            <Send size={16} />
            Submit for Review
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Editor Area */}
        <div className="flex-1 space-y-6">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Article Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-3xl font-bold text-dark-text placeholder:text-pearl-soft bg-transparent border-none focus:outline-none focus:ring-0 px-0"
            />
            
            <textarea
              placeholder="Write a brief excerpt (max 300 characters)..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              maxLength={300}
              rows={3}
              className="w-full text-lg text-muted-text placeholder:text-pearl-soft bg-transparent border-none focus:outline-none focus:ring-0 px-0 resize-none"
            />
          </div>

          <div className="mt-8">
            <TiptapEditor content={content} onChange={setContent} />
          </div>
        </div>

        {/* Sidebar Metadata */}
        <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
          <div className="card p-6">
            <h3 className="font-bold text-dark-text mb-4">Publishing Info</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-muted-text uppercase tracking-wider mb-2">Category</label>
                <select 
                  value={sportId}
                  onChange={(e) => setSportId(e.target.value)}
                  className="w-full bg-warm-white border border-pearl-soft rounded-md px-3 py-2 text-sm focus:outline-none focus:border-pearl-red"
                >
                  <option value="football">Football</option>
                  <option value="athletics">Athletics</option>
                  <option value="basketball">Basketball</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-muted-text uppercase tracking-wider mb-2">Tags (Comma separated)</label>
                <input 
                  type="text"
                  placeholder="Lango League, Match Report..."
                  className="w-full bg-warm-white border border-pearl-soft rounded-md px-3 py-2 text-sm focus:outline-none focus:border-pearl-red"
                />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-dark-text mb-4">Cover Image</h3>
            
            <div className="w-full aspect-[16/9] bg-warm-white border-2 border-dashed border-pearl-soft rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-pearl-light hover:border-pearl-red transition-all">
              <ImageIcon className="text-muted-text mb-2" size={24} />
              <span className="text-sm font-bold text-pearl-red">Upload Image</span>
              <span className="text-xs text-muted-text mt-1">16:9 ratio recommended</span>
            </div>
          </div>
          
          <div className="card p-6">
            <h3 className="font-bold text-dark-text mb-4">SEO Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-muted-text uppercase tracking-wider mb-2">Meta Title</label>
                <input 
                  type="text"
                  placeholder="Leave empty to use article title"
                  className="w-full bg-warm-white border border-pearl-soft rounded-md px-3 py-2 text-sm focus:outline-none focus:border-pearl-red"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-muted-text uppercase tracking-wider mb-2">Meta Description</label>
                <textarea 
                  rows={3}
                  placeholder="Leave empty to use excerpt"
                  className="w-full bg-warm-white border border-pearl-soft rounded-md px-3 py-2 text-sm focus:outline-none focus:border-pearl-red resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
