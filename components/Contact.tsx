import {site} from '@/lib/content';
export function Contact() {
  return <p className="contact-copy">{site.footer} <a href={`mailto:${site.email}`}>{site.email}</a> или в <a href={site.telegram} target="_blank" rel="noreferrer">Telegram</a>.</p>;
}
