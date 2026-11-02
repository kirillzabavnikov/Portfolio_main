import Link from 'next/link';
import {getProjectHref, getProjectPreviewHtml, type Project} from '@/lib/content';
import {ProjectVisual} from '@/components/ProjectVisual';
import {withNonBreakingSpaces as nbsp} from '@/lib/typography';
export function ProjectCard({project, priority}: {project: Project; priority: boolean}) {
  const href = getProjectHref(project);
  const linkProps = project.caseUrl ? {target: '_blank', rel: 'noopener noreferrer'} : {};
  return <article className="project-card">
    <Link href={href} {...linkProps} className="project-cover" aria-label={project.title}>
      <ProjectVisual project={project} priority={priority} />
    </Link>
    <div className="project-caption">
      {project.preview
        ? <p dangerouslySetInnerHTML={{__html:getProjectPreviewHtml(project)}} />
        : <p><Link href={href} {...linkProps}>{nbsp(project.title)}</Link> · {nbsp(project.description)}</p>}
      <p className="project-category">{nbsp(project.category)}</p>
      {project.year && <time dateTime={String(project.year)}>{project.year}</time>}
    </div>
  </article>;
}
