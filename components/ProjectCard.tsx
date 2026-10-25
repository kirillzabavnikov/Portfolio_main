import Link from 'next/link';
import {type Project} from '@/lib/content';
import {ProjectVisual} from '@/components/ProjectVisual';
export function ProjectCard({project, priority}: {project: Project; priority: boolean}) {
  return <article className="project-card">
    <Link href={`/projects/${project.slug}/`} className="project-cover" aria-label={project.title}>
      <ProjectVisual project={project} priority={priority} />
    </Link>
    <div className="project-caption">
      <p><Link href={`/projects/${project.slug}/`}>{project.title}</Link> · {project.description}</p>
      <p className="project-category">{project.category}</p>
      {project.year && <time dateTime={String(project.year)}>{project.year}</time>}
    </div>
  </article>;
}
