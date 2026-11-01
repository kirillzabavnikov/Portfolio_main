import Image from 'next/image';
import {getAsset, type Project} from '@/lib/content';

export function ProjectVisual({project, priority=false, large=false}: {project: Project; priority?: boolean; large?: boolean}) {
  const sizes=large ? '(min-width: 1300px) 360px, 27vw' : '(min-width: 1000px) 20vw, 30vw';
  if (project.coverScreens?.length) {
    return <div className="project-visual" aria-label={project.coverAlt}>
      {project.coverScreens.map((screen,index)=>{
        const asset=getAsset(screen.image);
        return <Image key={screen.image} src={asset.path} width={asset.width} height={asset.height} alt={screen.alt} priority={priority && index===0} loading={priority ? 'eager' : 'lazy'} sizes={sizes} />;
      })}
    </div>;
  }
  const cover=getAsset(project.cover);
  if (cover.trimLeft) {
    const visibleWidth=cover.width-cover.trimLeft;
    const fadeStart=100*(1-(cover.fadeBottom || 0)/cover.height);
    return <div className="project-cover-frame">
      <Image src={cover.path} width={cover.width} height={cover.height} alt={project.coverAlt} priority={priority} sizes={large ? '100vw' : '74vw'} style={{width:`${100*cover.width/visibleWidth}%`, maxWidth:'none', marginLeft:`${-100*cover.trimLeft/visibleWidth}%`, maskImage:`linear-gradient(to bottom, black ${fadeStart}%, transparent 100%)`}} />
    </div>;
  }
  return <Image src={cover.path} width={cover.width} height={cover.height} alt={project.coverAlt} priority={priority} sizes={large ? '94vw' : '64vw'} />;
}
