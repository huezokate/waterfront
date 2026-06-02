// Resolve public assets against Vite's base (e.g. '/waterfront/' on Pages, '/' in dev)
export const asset = (p: string) => import.meta.env.BASE_URL + p.replace(/^\//, '');
