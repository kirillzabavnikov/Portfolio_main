const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function assetUrl(url: string): string {
  return url.startsWith('/') && !url.startsWith('//') ? `${basePath}${url}` : url;
}
