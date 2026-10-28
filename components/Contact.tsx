import {site} from '@/lib/content';
import {withNonBreakingSpaces as nbsp} from '@/lib/typography';
export function Contact() {
  return <p className="contact-copy">{nbsp(`${site.footer} `)}<a href={`mailto:${site.email}`}>{site.email}</a>{nbsp(' или в ')}<a href={site.telegram} target="_blank" rel="noreferrer">Telegram</a>.</p>;
}
