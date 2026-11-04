'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import site from '@/content/site.json';

export function Navigation() {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusFrame = requestAnimationFrame(() => menu.current?.querySelector<HTMLElement>('a')?.focus());
    const close = () => { setOpen(false); trigger.current?.focus(); };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key !== 'Tab') return;
      const items = menu.current?.querySelectorAll<HTMLElement>('a, button');
      if (!items?.length) return;
      const first = items[0], last = items[items.length-1];
      if (!menu.current?.contains(document.activeElement)) { e.preventDefault(); (e.shiftKey ? last : first).focus(); }
      else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    const media = window.matchMedia('(min-width: 1000px)');
    const onResize = () => { if (media.matches) close(); };
    media.addEventListener('change', onResize);
    document.addEventListener('keydown', onKey);
    return () => { cancelAnimationFrame(focusFrame); document.body.style.overflow = previous; document.removeEventListener('keydown', onKey); media.removeEventListener('change', onResize); };
  }, [open]);
  return <>
    <div className="navigation">
      <button ref={trigger} className="navigation-button" aria-label={open ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={open} aria-controls="portfolio-menu" onClick={() => setOpen(!open)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false"><path d="M4 6h16M4 12h16M4 18h16" /></svg></button>
      <nav id="portfolio-menu" ref={menu} className={`navigation-menu ${open ? 'is-open' : ''}`} aria-label="Основная навигация" onClick={e => { if ((e.target as HTMLElement).closest('a')) {setOpen(false);trigger.current?.focus();} }}>
        <div className="navigation-menu-container">
          <ul className="navigation-menu-primary"><li><Link href="/">{site.name}</Link></li></ul>
          <ul className="navigation-menu-secondary">
            <li><a href={site.notion} target="_blank" rel="noreferrer">Notion</a></li>
            <li><a href={`mailto:${site.email}`}>email</a></li>
            <li><a href={site.telegram} target="_blank" rel="noreferrer">telegram</a></li>
            <li><a href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
            <li><a href={site.instagram} target="_blank" rel="noreferrer">Instagram</a></li>
          </ul>
        </div>
        <button className="navigation-close display-heavy" onClick={() => {setOpen(false);trigger.current?.focus();}}>закрыть</button>
      </nav>
    </div>
  </>;
}
