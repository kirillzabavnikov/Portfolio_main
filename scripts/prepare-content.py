"""Preserve readable originals and an asset manifest from the imported records."""
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
assets = []
for file in (ROOT/'content/original').glob('*.json'):
    record = json.loads(file.read_text())
    if not isinstance(record, dict): continue
    blocks = record.get('recordMap', {}).get('block', {})
    if not blocks: continue
    def val(key):
        v = blocks.get(key, {}).get('value', {})
        return v.get('value', v)
    lines = []
    if file.stem == 'notion-home':
        home = val('3f0c40b3-b7d1-8028-83be-dec0ab47fdd8')
        icon = home.get('format', {}).get('page_icon', '')
        if icon.startswith('attachment:'):
            assets.append({'id':home['id'],'source':icon,'title':'Портрет Кирилла Забавникова','project':file.stem})
    def walk(key):
        v = val(key)
        typ = v.get('type')
        props = v.get('properties', {})
        text = ''.join(x[0] for x in props.get('title', []))
        if typ == 'image':
            source = ''.join(x[0] for x in props.get('source', []))
            assets.append({'id':key,'source':source,'title':text,'project':file.stem})
            lines.append(f'![{text}]({source})\n')
        elif text:
            prefix = '# ' if typ == 'page' else '## ' if typ in ('sub_header','sub_sub_header','header') else '- ' if typ=='bulleted_list' else ''
            lines.append(prefix+text+'\n')
        for child in v.get('content', []): walk(child)
    walk('3f0c40b3-b7d1-8028-83be-dec0ab47fdd8' if file.stem=='notion-home' else file.stem)
    file.with_suffix('.md').write_text('\n'.join(lines))
(ROOT/'content/original/assets.json').write_text(json.dumps(assets,ensure_ascii=False,indent=2))
print(f'Prepared {len(assets)} original image references.')
