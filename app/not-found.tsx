import Link from 'next/link';
export default function NotFound() {
  return <main id="main" className="not-found"><p>404</p><h1>Страница не найдена</h1><Link href="/">Вернуться к проектам →</Link></main>;
}
