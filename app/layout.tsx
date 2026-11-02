import type { Metadata } from 'next';
import '@fontsource-variable/inter';
import './tokens.css';
import './globals.css';
import { site } from '@/lib/content';
import {assetUrl} from '@/lib/paths';

export const metadata: Metadata = {
  metadataBase: new URL(new URL(site.siteUrl).origin),
  title: {default: `${site.name} — Product Designer`, template: `%s — ${site.name}`},
  description: site.intro,
  openGraph: {title: `${site.name} — Product Designer`, description: site.intro, url:site.siteUrl, locale:'ru_RU', type:'website', images:[{url:assetUrl('/images/237c40b3-b7d1-838e-b55e-0123ac466540.webp'),alt:'Задания и подарки в Супермаркетах Т-Банка'}]},
  twitter: {card:'summary_large_image'},
};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="ru"><body><a className="skip-link" href="#main">К содержанию</a>{children}</body></html>;
}
