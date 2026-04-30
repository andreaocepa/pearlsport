'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-8 bg-white shadow-card-hover">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-pearl-red mx-auto mb-4" />
          <h1 className="font-bold text-2xl text-dark-text tracking-tight">Pearlsport Admin</h1>
          <p className="text-muted-text text-sm">Sign in to manage content</p>
        </div>

        {error && (
          <div className="bg-red-50 text-pearl-red p-3 rounded-md text-sm mb-6 border border-pearl-soft">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-dark-text mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-warm-white border border-pearl-soft rounded-md px-4 py-2 text-dark-text focus:outline-none focus:border-pearl-red focus:ring-1 focus:ring-pearl-red transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-dark-text mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-warm-white border border-pearl-soft rounded-md px-4 py-2 text-dark-text focus:outline-none focus:border-pearl-red focus:ring-1 focus:ring-pearl-red transition-all"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full justify-center mt-6 py-3"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
