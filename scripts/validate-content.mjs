import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
const root = process.cwd();
const assets = JSON.parse(fs.readFileSync('content/assets.json', 'utf8'));
const slugs = new Set();
let count = 0;
for (const name of fs.readdirSync('content/projects').filter(f=>f.endsWith('.md'))) {
  const {data,content} = matter(fs.readFileSync(path.join('content/projects',name),'utf8'));
  if (!data.published) continue;
  if (slugs.has(data.slug)) throw new Error('Duplicate slug: '+data.slug);
  slugs.add(data.slug);
  if (!assets[data.cover]) throw new Error('Missing cover metadata: '+name);
  const screenPaths=(data.coverScreens||[]).map(s=>{
    if(!s.alt || !assets[s.image]) throw new Error('Invalid cover screen: '+name);
    return assets[s.image].path;
  });
  const imagePaths = [assets[data.cover].path, ...screenPaths, ...[...content.matchAll(/!\[[^\]]+\]\(([^)]+)\)/g)].map(m=>m[1])];
  for (const imagePath of imagePaths) {
    if (!fs.existsSync(path.join(root,'public',imagePath))) throw new Error('Missing image: '+imagePath);
    const id = path.basename(imagePath,'.webp');
    if (!assets[id]?.width || !assets[id]?.height) throw new Error('Missing dimensions: '+id);
  }
  if (!fs.existsSync('content/original/'+data.sourceId+'.md')) throw new Error('Missing original: '+name);
  count++;
}
console.log(`${count} published projects: unique slugs, covers, illustrations, dimensions and originals verified.`);
