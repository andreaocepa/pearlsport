export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function paginate(page: number, limit: number) {
  const take = Math.min(limit, 50);
  const skip = (page - 1) * take;
  return { take, skip };
}
