// Vite supplies the same base to both the browser and the prerendered pages.
export const basePath = import.meta.env.BASE_URL;
export const routerBasename = basePath.replace(/\/$/, '') || '/';
export const assetPath = (path: string) => `${basePath}${path.replace(/^\//, '')}`;
export const appPath = (pathname: string) => {
  const prefix = basePath.replace(/\/$/, '');
  const relative =
    prefix && (pathname === prefix || pathname.startsWith(`${prefix}/`))
      ? pathname.slice(prefix.length)
      : pathname;
  return relative.replace(/\/$/, '') || '/';
};
