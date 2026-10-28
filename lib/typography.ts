// Keep Russian prepositions and short conjunctions with the following word.
// Plain source text remains easy to edit; apply only to displayed text, not URLs.
const shortWords = [
  'а', 'без', 'близ', 'в', 'во', 'вдоль', 'вместо', 'вне', 'внутри', 'вокруг',
  'вопреки', 'да', 'для', 'до', 'за', 'и', 'из', 'из-за', 'из-под', 'или',
  'к', 'ко', 'кроме', 'между', 'на', 'над', 'надо', 'насчет', 'насчёт', 'но',
  'о', 'об', 'обо', 'около', 'от', 'ото', 'перед', 'передо', 'по', 'под',
  'подо', 'после', 'при', 'про', 'ради', 'с', 'со', 'сверх', 'сквозь', 'среди',
  'у', 'через',
];
const hangingWord = new RegExp(
  `(?<![\\p{L}\\p{N}_@/.-])(${shortWords.join('|')})[ \\t\\r\\n]+(?=\\S|$)`,
  'giu',
);

export function withNonBreakingSpaces(text: string): string {
  return text.replace(hangingWord, '$1\u00a0');
}
