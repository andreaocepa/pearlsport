'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit2, Trash2, Eye, Send, Star, Globe } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import toast, { Toaster } from 'react-hot-toast';

const initialMockArticles = [
  { id: 'a0', title: 'Lira FC Secures Last-Minute Derby Victory', slug: 'lira-fc-victory', status: 'PUBLISHED', isFeatured: true, authorName: 'John Doe', sportName: 'Football', createdAt: new Date(Date.now() - 0 * 86400000).toISOString(), publishedAt: new Date(Date.now() - 0 * 86400000).toISOString() },
  { id: 'a1', title: 'Athletics Championships: Lango Talent Shines', slug: 'athletics-lango', status: 'DRAFT', isFeatured: false, authorName: 'Jane Editor', sportName: 'Athletics', createdAt: new Date(Date.now() - 1 * 86400000).toISOString(), publishedAt: null },
  { id: 'a2', title: 'Basketball League Kicks Off This Weekend', slug: 'basketball-league', status: 'REVIEW', isFeatured: false, authorName: 'John Doe', sportName: 'Basketball', createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), publishedAt: null },
  { id: 'a3', title: 'Rugby Sevens: Northern Uganda Teams Battle', slug: 'rugby-sevens', status: 'PUBLISHED', isFeatured: false, authorName: 'Jane Editor', sportName: 'Rugby', createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), publishedAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 'a4', title: 'Boxing Gala Night Preview: Lira Edition', slug: 'boxing-gala', status: 'DRAFT', isFeatured: false, authorName: 'John Doe', sportName: 'Boxing', createdAt: new Date(Date.now() - 4 * 86400000).toISOString(), publishedAt: null },
  { id: 'a5', title: 'Gulu United vs Arua Hill: Match Preview', slug: 'gulu-arua-preview', status: 'REVIEW', isFeatured: false, authorName: 'Jane Editor', sportName: 'Football', createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), publishedAt: null },
  { id: 'a6', title: 'Interview: Otim Emmanuel on Lira FC Season', slug: 'otim-interview', status: 'PUBLISHED', isFeatured: false, authorName: 'John Doe', sportName: 'Football', createdAt: new Date(Date.now() - 6 * 86400000).toISOString(), publishedAt: new Date(Date.now() - 6 * 86400000).toISOString() },
  { id: 'a7', title: 'Athletics: Road to FUFA Qualifiers Analysis', slug: 'fufa-qualifiers', status: 'DRAFT', isFeatured: false, authorName: 'Jane Editor', sportName: 'Athletics', createdAt: new Date(Date.now() - 7 * 86400000).toISOString(), publishedAt: null },
];

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PUBLISHED: { label: 'Published', color: 'bg-green-100 text-green-700' },
  REVIEW: { label: 'In Review', color: 'bg-orange-100 text-orange-700' },
  DRAFT: { label: 'Draft', color: 'bg-gray-100 text-gray-600' },
};

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState(initialMockArticles);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const updateStatus = (id: string, status: string) => {
    setArticles(articles.map((a) => a.id === id
      ? { ...a, status, publishedAt: status === 'PUBLISHED' ? new Date().toISOString() : a.publishedAt }
      : a));
    const messages: Record<string, string> = {
      REVIEW: 'Article submitted for review',
      PUBLISHED: 'Article published successfully! 🎉',
      DRAFT: 'Article moved back to draft',
    };
    toast.success(messages[status] || 'Status updated');
  };

  const toggleFeatured = (id: string) => {
    const article = articles.find((a) => a.id === id);
    if (!article) return;
    if (article.status !== 'PUBLISHED') {
      toast.error('Only published articles can be featured');
      return;
    }
    // Unfeat all others first
    setArticles(articles.map((a) => ({ ...a, isFeatured: a.id === id ? !a.isFeatured : false })));
    toast.success(article.isFeatured ? 'Article unfeatured' : '⭐ Featured article updated for homepage!');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      setArticles(articles.filter((a) => a.id !== id));
      toast.success('Article deleted');
    }
  };

  const filteredArticles = articles.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || a.authorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const stats = {
    published: articles.filter((a) => a.status === 'PUBLISHED').length,
    draft: articles.filter((a) => a.status === 'DRAFT').length,
    review: articles.filter((a) => a.status === 'REVIEW').length,
    featured: articles.filter((a) => a.isFeatured).length,
  };

  return (
    <div>
      <Toaster position="bottom-right" />
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-dark-text tracking-tight">Articles</h1>
          <p className="text-muted-text">Manage all content across the platform.</p>
        </div>
        <Link href="/dashboard/articles/new" className="btn-primary flex-shrink-0">
          <Plus size={18} /> Create New Article
        </Link>
      </div>

      {/* Mini Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Published', value: stats.published, color: 'text-green-600', bg: 'bg-green-50', filter: 'published' },
          { label: 'In Review', value: stats.review, color: 'text-orange-600', bg: 'bg-orange-50', filter: 'review' },
          { label: 'Drafts', value: stats.draft, color: 'text-gray-600', bg: 'bg-gray-50', filter: 'draft' },
          { label: 'Featured', value: stats.featured, color: 'text-yellow-600', bg: 'bg-yellow-50', filter: 'all' },
        ].map((s) => (
          <button key={s.label} onClick={() => setStatusFilter(s.filter)}
            className={`card p-4 text-left transition-all hover:shadow-md ${statusFilter === s.filter && s.filter !== 'all' ? 'ring-2 ring-pearl-red' : ''}`}>
            <p className="text-xs font-bold text-muted-text uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
          </button>
        ))}
      </div>

      <div className="card">
        {/* Toolbar */}
        <div className="p-4 border-b border-pearl-soft bg-warm-white flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text" size={16} />
            <input type="text" placeholder="Search by title or author..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-pearl-soft rounded-md bg-white text-sm focus:outline-none focus:border-pearl-red" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto border border-pearl-soft rounded-md bg-white px-3 py-2 text-sm focus:outline-none focus:border-pearl-red">
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="review">In Review</option>
            <option value="draft">Draft</option>
          </select>
          <span className="text-xs text-muted-text ml-auto hidden md:block">{filteredArticles.length} article(s)</span>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-pearl-soft">
          {filteredArticles.map((article) => (
            <div key={article.id} className="p-4 bg-white">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-medium text-muted-text bg-warm-white px-2 py-0.5 rounded">{article.sportName}</span>
                <div className="flex items-center gap-1">
                  {article.isFeatured && <Star size={12} className="text-yellow-500 fill-yellow-400" />}
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${STATUS_CONFIG[article.status]?.color}`}>
                    {STATUS_CONFIG[article.status]?.label}
                  </span>
                </div>
              </div>
              <h3 className="font-bold text-dark-text text-sm mb-1 line-clamp-2">{article.title}</h3>
              <p className="text-xs text-muted-text mb-3">{article.authorName} · {format(parseISO(article.createdAt), 'MMM d, yyyy')}</p>
              <div className="flex flex-wrap gap-2">
                {article.status === 'DRAFT' && (
                  <button onClick={() => updateStatus(article.id, 'REVIEW')} className="flex-1 py-1.5 text-xs font-bold text-orange-600 border border-orange-200 bg-orange-50 rounded flex items-center justify-center gap-1">
                    <Send size={11} /> Submit
                  </button>
                )}
                {article.status === 'REVIEW' && (
                  <button onClick={() => updateStatus(article.id, 'PUBLISHED')} className="flex-1 py-1.5 text-xs font-bold text-green-600 border border-green-200 bg-green-50 rounded flex items-center justify-center gap-1">
                    <Globe size={11} /> Publish
                  </button>
                )}
                {article.status === 'PUBLISHED' && (
                  <button onClick={() => toggleFeatured(article.id)} className={`flex-1 py-1.5 text-xs font-bold rounded flex items-center justify-center gap-1 border ${article.isFeatured ? 'text-yellow-700 border-yellow-300 bg-yellow-50' : 'text-muted-text border-pearl-soft bg-warm-white'}`}>
                    <Star size={11} /> {article.isFeatured ? 'Unfeature' : 'Feature'}
                  </button>
                )}
                <Link href={`/dashboard/articles/${article.id}`} className="flex-1 py-1.5 text-xs font-bold text-muted-text border border-pearl-soft bg-warm-white rounded flex items-center justify-center gap-1">
                  <Edit2 size={11} /> Edit
                </Link>
                <button onClick={() => handleDelete(article.id)} className="py-1.5 px-3 text-xs font-bold text-red-600 border border-red-100 bg-red-50 rounded flex items-center justify-center">
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          ))}
          {filteredArticles.length === 0 && <div className="p-8 text-center text-muted-text">No articles found.</div>}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-warm-white border-b border-pearl-soft text-xs font-bold text-muted-text uppercase tracking-wider">
                <th className="p-4 w-2/5">Title</th>
                <th className="p-4">Sport</th>
                <th className="p-4">Status</th>
                <th className="p-4">Author</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pearl-soft">
              {filteredArticles.map((article) => (
                <tr key={article.id} className="hover:bg-pearl-light transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {article.isFeatured && <span title="Featured on homepage"><Star size={14} className="text-yellow-500 fill-yellow-400 flex-shrink-0" /></span>}
                      <p className="font-bold text-dark-text text-sm line-clamp-1">{article.title}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-medium text-muted-text bg-warm-white px-2 py-1 rounded">{article.sportName}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${STATUS_CONFIG[article.status]?.color}`}>
                      {STATUS_CONFIG[article.status]?.label}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-dark-text">{article.authorName}</td>
                  <td className="p-4 text-sm text-muted-text whitespace-nowrap">
                    {format(parseISO(article.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Workflow actions */}
                      {article.status === 'DRAFT' && (
                        <button onClick={() => updateStatus(article.id, 'REVIEW')} title="Submit for Review"
                          className="p-1.5 text-orange-600 hover:bg-orange-50 bg-white border border-pearl-soft rounded">
                          <Send size={13} />
                        </button>
                      )}
                      {article.status === 'REVIEW' && (
                        <button onClick={() => updateStatus(article.id, 'PUBLISHED')} title="Publish"
                          className="p-1.5 text-green-600 hover:bg-green-50 bg-white border border-pearl-soft rounded">
                          <Globe size={13} />
                        </button>
                      )}
                      {article.status === 'PUBLISHED' && (
                        <button onClick={() => toggleFeatured(article.id)} title={article.isFeatured ? 'Unfeature' : 'Feature on Homepage'}
                          className={`p-1.5 rounded border ${article.isFeatured ? 'text-yellow-600 bg-yellow-50 border-yellow-200' : 'text-muted-text bg-white border-pearl-soft hover:bg-yellow-50 hover:text-yellow-600'}`}>
                          <Star size={13} />
                        </button>
                      )}
                      {article.status === 'PUBLISHED' && (
                        <Link href={`/${article.sportName.toLowerCase()}/${article.slug}`} target="_blank"
                          className="p-1.5 text-muted-text hover:text-pearl-red bg-white border border-pearl-soft rounded" title="View Live">
                          <Eye size={13} />
                        </Link>
                      )}
                      <Link href={`/dashboard/articles/${article.id}`}
                        className="p-1.5 text-muted-text hover:text-pearl-red bg-white border border-pearl-soft rounded" title="Edit">
                        <Edit2 size={13} />
                      </Link>
                      <button onClick={() => handleDelete(article.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 bg-white border border-pearl-soft rounded" title="Delete">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredArticles.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-muted-text">No articles match your criteria.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="p-4 border-t border-pearl-soft flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted-text bg-warm-white">
          <span>Showing {filteredArticles.length} of {articles.length} articles</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white border border-pearl-soft rounded hover:bg-pearl-light disabled:opacity-40" disabled>Prev</button>
            <button className="px-3 py-1 bg-white border border-pearl-soft rounded hover:bg-pearl-light">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
