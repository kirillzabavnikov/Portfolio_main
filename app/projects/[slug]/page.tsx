import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {Contact} from '@/components/Contact';
import {ProjectVisual} from '@/components/ProjectVisual';
import {getProjects, getAsset, getProjectHtml, getProjectHref, site} from '@/lib/content';
import {withNonBreakingSpaces as nbsp} from '@/lib/typography';

export const dynamicParams = false;
export function generateStaticParams() { return getProjects().map(p => ({slug:p.slug})); }
export async function generateMetadata({params}: {params: Promise<{slug:string}>}): Promise<Metadata> {
  const {slug} = await params;
  const project = getProjects().find(p => p.slug===slug);
  if (!project) return {};
  return {title:project.title,description:project.description,alternates:{canonical:`/projects/${slug}/`},openGraph:{title:project.title,description:project.description,type:'article',url:`/projects/${slug}/`,images:[{url:getAsset(project.cover).path,alt:project.coverAlt}]}};
}
export default async function ProjectPage({params}: {params: Promise<{slug:string}>}) {
  const {slug} = await params;
  const projects = getProjects(), index=projects.findIndex(p => p.slug===slug);
  if (index<0) notFound();
  const project=projects[index], next=projects[(index+1)%projects.length];
  return <div className="case-page">
    <header className="case-header"><Link href="/" className="case-author">{site.name}</Link><nav aria-label="Навигация кейса"><Link href="/">{nbsp('обо мне')}</Link> · <Link href="/#projects">все проекты</Link></nav></header>
    <main id="main"><article>
      <div className="case-heading"><h1>{nbsp(project.title)}</h1><p>{nbsp(project.description)}</p></div>
      <div className="case-cover"><ProjectVisual project={project} priority large /></div>
      <div className="case-body" dangerouslySetInnerHTML={{__html:getProjectHtml(project)}} />
      <a className="source-link" href={`https://www.notion.so/${project.sourceId.replaceAll('-','')}`} target="_blank" rel="noreferrer">{nbsp('Полный кейс в Notion')}</a>
    </article>
    <nav className="case-next" aria-label="Следующий проект"><span>Далее</span><Link href={getProjectHref(next)} target={next.caseUrl ? '_blank' : undefined} rel={next.caseUrl ? 'noopener noreferrer' : undefined}>{nbsp(next.title)} →</Link><p>{nbsp(next.description)}</p></nav>
    </main>
    <footer className="case-footer"><Contact /><Link href="/#projects">← Все проекты</Link></footer>
  </div>;
}
