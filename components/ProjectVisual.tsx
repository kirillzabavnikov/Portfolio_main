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
    const visibleWidth=cover.width-cover.trimLeft-(cover.trimRight || 0);
    const imageStyle={width:`${100*cover.width/visibleWidth}%`, maxWidth:'none', marginLeft:`${-100*cover.trimLeft/visibleWidth}%`};
    return <div className="project-cover-frame">
      {cover.shadowFootprints?.map((shadow,index)=><span key={index} className="project-phone-shadow" aria-hidden="true" style={{left:`${100*(shadow.center-cover.trimLeft!)/visibleWidth}%`,width:`${100*shadow.width/visibleWidth}%`}} />)}
      <div className="project-cover-crop">
        <Image src={cover.path} width={cover.width} height={cover.height} alt={project.coverAlt} priority={priority} sizes={large ? '100vw' : '84vw'} style={{...imageStyle,maskImage:'linear-gradient(to bottom, black 99.3%, transparent 100%)'}} />
      </div>
    </div>;
  }
  return <Image src={cover.path} width={cover.width} height={cover.height} alt={project.coverAlt} priority={priority} sizes={large ? '94vw' : '64vw'} style={cover.displayWidth ? {width:`${cover.displayWidth}%`} : undefined} />;
}
