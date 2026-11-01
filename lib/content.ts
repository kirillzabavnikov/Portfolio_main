import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import site from '@/content/site.json';
import {withNonBreakingSpaces} from '@/lib/typography';

export { site };
export type Project = {
  title: string; slug: string; description: string; cover: string; coverAlt: string;
  order: number; published: boolean; category: string; sourceId: string; year?: number;
  coverScreens?: {image: string; alt: string}[];
  caseUrl?: string;
  preview?: string;
  markdown: string;
};
export type Asset = { width: number; height: number; path: string; trimLeft?: number; fadeBottom?: number };
export function getAsset(id: string): Asset {
  const file = path.join(process.cwd(), 'content/assets.json');
  const assets: Record<string, Asset> = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
  return assets[id] || { path: `/images/${id}.webp`, width: 1600, height: 900 };
}
export function getProjects(): Project[] {
  const folder = path.join(process.cwd(), 'content/projects');
  const projects = fs.readdirSync(folder).filter(f => f.endsWith('.md')).map(file => {
    const {data, content} = matter(fs.readFileSync(path.join(folder, file), 'utf8'));
    for (const key of ['title','slug','description','cover','coverAlt','category','sourceId']) {
      if (typeof data[key] !== 'string' || !data[key]) throw new Error(`${file}: missing ${key}`);
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) throw new Error(`${file}: invalid slug`);
    if (typeof data.published !== 'boolean' || !Number.isFinite(data.order)) throw new Error(`${file}: invalid published/order`);
    if (data.caseUrl !== undefined && (typeof data.caseUrl !== 'string' || !URL.canParse(data.caseUrl) || new URL(data.caseUrl).protocol !== 'https:')) throw new Error(`${file}: invalid caseUrl`);
    if (data.preview !== undefined && typeof data.preview !== 'string') throw new Error(`${file}: invalid preview`);
    return {...data, markdown: content} as Project;
  }).filter(project => project.published).sort((a,b) => a.order - b.order);
  if (new Set(projects.map(p => p.slug)).size !== projects.length) throw new Error('Duplicate project slug');
  return projects;
}
export function getProjectHref(project: Project): string {
  return project.caseUrl || `/projects/${project.slug}/`;
}

function createContentRenderer() {
  // Markdown is authored locally, never accepted from visitors.
  const renderer = new marked.Renderer();
  const renderText = renderer.text.bind(renderer);
  renderer.text = token => {
    const rendered = renderText(token);
    // Nested tokens are handled recursively; never transform link/image attributes
    // or code. A trailing space also binds to the word in a following inline tag.
    return 'tokens' in token && token.tokens ? rendered : withNonBreakingSpaces(rendered);
  };
  renderer.image = ({href, text}) => {
    const escape = (s: string) => s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
    const id = path.basename(href, '.webp');
    const asset = getAsset(id);
    return `<img src="${escape(href)}" alt="${escape(text)}" width="${asset.width}" height="${asset.height}" loading="lazy" decoding="async" />`;
  };
  return renderer;
}

export function getProjectHtml(project: Project): string {
  return marked.parse(project.markdown, {renderer: createContentRenderer(), async: false}) as string;
}

export function getProjectPreviewHtml(project: Project): string {
  return marked.parseInline(project.preview || '', {renderer: createContentRenderer(), async: false}) as string;
}
