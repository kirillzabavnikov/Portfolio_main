import {Navigation} from '@/components/Navigation';
import {ProjectCard} from '@/components/ProjectCard';
import {Contact} from '@/components/Contact';
import {getProjects, site} from '@/lib/content';
import {withNonBreakingSpaces as nbsp} from '@/lib/typography';

export default function Home() {
  const projects = getProjects();
  return <div className="portfolio-layout">
    <header className="header">
      <div className="header-group"><h1 className="header-title display-heavy">{site.name}</h1><p className="header-description">{nbsp(site.role)}</p></div>
      <Navigation />
    </header>
    <main id="main" className="home-main">
      <section className="main-header" aria-label="Обо мне"><h2 className="main-header-title display-heavy">{nbsp(`${site.introAccent} ${site.introTitle}`)}</h2><p>{nbsp(site.intro)}</p></section>
      <section id="projects" aria-label="Проекты"><p className="main-content-prepend">{nbsp(site.projectsLabel)}</p>{projects.map((project, index) => <ProjectCard key={project.slug} project={project} priority={index===0} />)}</section>
      <footer><Contact /></footer>
    </main>
  </div>;
}
