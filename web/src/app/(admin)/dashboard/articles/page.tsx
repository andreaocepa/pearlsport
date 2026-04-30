'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit2, Trash2, Eye } from 'lucide-react';
import { format, parseISO } from 'date-fns';

// Mock Data
const mockArticles = Array.from({ length: 8 }).map((_, i) => ({
  id: `a${i}`,
  title: `Sample Article Title ${i + 1} from Pearlsport Editor`,
  status: i === 0 ? 'DRAFT' : i === 1 ? 'REVIEW' : 'PUBLISHED',
  authorName: 'John Doe',
  sportName: i % 2 === 0 ? 'Football' : 'Athletics',
  createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
  publishedAt: i > 1 ? new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString() : null,
}));

export default function AdminArticlesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Published</span>;
      case 'REVIEW':
        return <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">In Review</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Draft</span>;
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark-text tracking-tight">Articles</h1>
          <p className="text-muted-text">Manage all content across the platform.</p>
        </div>
        
        <Link href="/dashboard/articles/new" className="btn-primary">
          <Plus size={18} />
          Create New Article
        </Link>
      </div>

      <div className="card">
        <div className="p-4 border-b border-pearl-soft bg-warm-white flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text" size={18} />
            <input 
              type="text" 
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-pearl-soft rounded-md bg-white text-sm focus:outline-none focus:border-pearl-red"
            />
          </div>
          
          <div className="flex gap-2">
            <select className="border border-pearl-soft rounded-md bg-white px-3 py-2 text-sm text-dark-text focus:outline-none focus:border-pearl-red">
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-warm-white border-b border-pearl-soft text-xs font-bold text-muted-text uppercase tracking-wider">
                <th className="p-4">Title</th>
                <th className="p-4">Sport</th>
                <th className="p-4">Status</th>
                <th className="p-4">Author</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pearl-soft">
              {mockArticles.map((article) => (
                <tr key={article.id} className="hover:bg-pearl-light transition-colors group">
                  <td className="p-4">
                    <p className="font-bold text-dark-text text-sm line-clamp-1">{article.title}</p>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-medium text-muted-text bg-warm-white px-2 py-1 rounded">
                      {article.sportName}
                    </span>
                  </td>
                  <td className="p-4">
                    {getStatusBadge(article.status)}
                  </td>
                  <td className="p-4 text-sm text-dark-text">
                    {article.authorName}
                  </td>
                  <td className="p-4 text-sm text-muted-text">
                    {format(parseISO(article.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-muted-text hover:text-pearl-red bg-white border border-pearl-soft rounded" title="View">
                        <Eye size={14} />
                      </button>
                      <Link href={`/dashboard/articles/${article.id}`} className="p-1.5 text-muted-text hover:text-pearl-red bg-white border border-pearl-soft rounded" title="Edit">
                        <Edit2 size={14} />
                      </Link>
                      <button className="p-1.5 text-muted-text hover:text-red-600 bg-white border border-pearl-soft rounded" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-pearl-soft flex items-center justify-between text-sm text-muted-text bg-warm-white">
          <span>Showing 1 to 8 of 42 articles</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white border border-pearl-soft rounded hover:bg-pearl-light" disabled>Prev</button>
            <button className="px-3 py-1 bg-white border border-pearl-soft rounded hover:bg-pearl-light">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
