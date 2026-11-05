import type { Metadata } from 'next';
import '@fontsource-variable/inter';
import './tokens.css';
import './globals.css';
import { site } from '@/lib/content';
import {assetUrl} from '@/lib/paths';

const shareImage = {
  url: assetUrl('/images/portfolio-share-cover-v2.jpg'),
  width: 1200,
  height: 933,
  type: 'image/jpeg',
  alt: 'Портфолио Кирилла Забавникова — Product Designer',
};

export const metadata: Metadata = {
  metadataBase: new URL(new URL(site.siteUrl).origin),
  title: {default: `${site.name} — Product Designer`, template: `%s — ${site.name}`},
  description: site.intro,
  openGraph: {title: `${site.name} — Product Designer`, description: site.intro, url:site.siteUrl, locale:'ru_RU', type:'website', images:[shareImage]},
  twitter: {card:'summary_large_image', images:[{url:shareImage.url,alt:shareImage.alt}]},
};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="ru"><body><a className="skip-link" href="#main">К содержанию</a>{children}</body></html>;
}
