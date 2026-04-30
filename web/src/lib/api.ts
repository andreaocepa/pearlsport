import { createClient } from '@/utils/supabase/client';
import { v4 as uuid } from 'uuid';

const supabase = createClient();

async function handleResponse(req: PromiseLike<any>) {
  const { data, error } = await req;
  if (error) throw new Error(error.message);
  return { data };
}

export const articlesApi = {
  list: async (params?: Record<string, string | number>) => {
    let query = supabase.from('articles').select('*, author:profiles(*), sport:sports(*), tags(*)').eq('status', 'PUBLISHED').order('published_at', { ascending: false });
    if (params?.sport) query = query.eq('sport.slug', params.sport);
    if (params?.tag) query = query.eq('tags.slug', params.tag);
    if (params?.limit) query = query.limit(Number(params.limit));
    return handleResponse(query);
  },
  featured: () => handleResponse(supabase.from('articles').select('*, author:profiles(*), sport:sports(*), tags(*)').eq('status', 'PUBLISHED').eq('is_featured', true).order('published_at', { ascending: false }).limit(1).single()),
  bySlug: (slug: string) => handleResponse(supabase.from('articles').select('*, author:profiles(*), sport:sports(*), tags(*), fixture:fixtures(*)').eq('slug', slug).single()),
  create: (data: any) => handleResponse(supabase.from('articles').insert([data]).select().single()),
  update: (id: string, data: any) => handleResponse(supabase.from('articles').update(data).eq('id', id).select().single()),
  submit: (id: string) => handleResponse(supabase.from('articles').update({ status: 'REVIEW' }).eq('id', id)),
  publish: (id: string) => handleResponse(supabase.from('articles').update({ status: 'PUBLISHED', published_at: new Date().toISOString() }).eq('id', id)),
  feature: (id: string, isFeatured: boolean) => handleResponse(supabase.from('articles').update({ is_featured: isFeatured }).eq('id', id)),
  delete: (id: string) => handleResponse(supabase.from('articles').delete().eq('id', id)),
};

export const fixturesApi = {
  list: (params?: any) => {
    let q = supabase.from('fixtures').select('*, homeTeam:teams!home_team_id(*), awayTeam:teams!away_team_id(*), competition:competitions(*)');
    if (params?.sport) q = q.eq('sport.slug', params.sport);
    return handleResponse(q);
  },
  results: (params?: any) => handleResponse(supabase.from('fixtures').select('*, homeTeam:teams!home_team_id(*), awayTeam:teams!away_team_id(*), competition:competitions(*)').eq('status', 'COMPLETED')),
  byId: (id: string) => handleResponse(supabase.from('fixtures').select('*, homeTeam:teams!home_team_id(*), awayTeam:teams!away_team_id(*)').eq('id', id).single()),
  create: (data: any) => handleResponse(supabase.from('fixtures').insert([data])),
  update: (id: string, data: any) => handleResponse(supabase.from('fixtures').update(data).eq('id', id)),
  delete: (id: string) => handleResponse(supabase.from('fixtures').delete().eq('id', id)),
};

export const sportsApi = {
  list: () => handleResponse(supabase.from('sports').select('*').order('order', { ascending: true })),
};

export const teamsApi = {
  list: (sport?: string) => {
    let q = supabase.from('teams').select('*');
    if (sport) q = q.eq('sport.slug', sport);
    return handleResponse(q);
  },
  bySlug: (slug: string) => handleResponse(supabase.from('teams').select('*').eq('slug', slug).single()),
  create: (data: any) => handleResponse(supabase.from('teams').insert([data])),
  update: (id: string, data: any) => handleResponse(supabase.from('teams').update(data).eq('id', id)),
};

export const competitionsApi = {
  list: (params?: Record<string, string>) => handleResponse(supabase.from('competitions').select('*')),
  create: (data: any) => handleResponse(supabase.from('competitions').insert([data])),
  update: (id: string, data: any) => handleResponse(supabase.from('competitions').update(data).eq('id', id)),
};

export const mediaApi = {
  upload: async (formData: FormData) => {
    const file = formData.get('image') as File;
    if (!file) throw new Error('No image provided');
    const id = uuid();
    const storagePath = `uploads/${id}/${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage.from('media').upload(storagePath, file);
    if (uploadError) throw new Error(uploadError.message);
    const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(storagePath);
    
    // Save metadata
    const { data: mediaRecord, error: dbError } = await supabase.from('media').insert([{
      url: publicUrlData.publicUrl,
      storage_path: storagePath,
      size_bytes: file.size,
    }]).select().single();
    if (dbError) throw new Error(dbError.message);
    
    return { data: { url: publicUrlData.publicUrl, storagePath } };
  },
  list: () => handleResponse(supabase.from('media').select('*').order('created_at', { ascending: false })),
  delete: async (storagePath: string) => {
    await supabase.storage.from('media').remove([storagePath]);
    return handleResponse(supabase.from('media').delete().eq('storage_path', storagePath));
  },
};

export const searchApi = {
  search: (q: string, sport?: string, page?: number) => {
    let query = supabase.from('articles').select('*, author:profiles(*)').textSearch('title_body', q);
    return handleResponse(query);
  },
};

export const authApi = {
  // Auth logic is now handled directly in useAuth hook using Supabase client
};

export const usersApi = {
  list: () => handleResponse(supabase.from('profiles').select('*')),
  create: (data: any) => handleResponse(supabase.from('profiles').insert([data])),
  update: (id: string, data: any) => handleResponse(supabase.from('profiles').update(data).eq('id', id)),
  setRole: (id: string, role: string) => handleResponse(supabase.from('profiles').update({ role }).eq('id', id)),
  deactivate: (id: string) => handleResponse(supabase.from('profiles').update({ is_active: false }).eq('id', id)),
};
