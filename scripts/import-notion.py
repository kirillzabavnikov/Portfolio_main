"""One-time import of public portfolio pages. No authentication required."""
import concurrent.futures
import json
import pathlib
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / 'content' / 'original'
def unwrap(entry):
    value = entry.get('value', {})
    return value.get('value', value)

def fetch(page_id):
    target = OUT / (page_id + '.json')
    if target.exists():
        return json.loads(target.read_text())
    records = {}
    cursor = {'stack': []}
    for chunk in range(100):
        body = {'pageId': page_id, 'limit': 100, 'cursor': cursor,
                'chunkNumber': chunk, 'verticalColumns': False}
        req = urllib.request.Request('https://www.notion.so/api/v3/loadPageChunk',
            data=json.dumps(body).encode(), headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req, timeout=45) as response:
            data = json.load(response)
        for table, entries in data.get('recordMap', {}).items():
            if isinstance(entries, dict): records.setdefault(table, {}).update(entries)
        cursor = data.get('cursor', {})
        if not cursor.get('stack'): break
    result = {'recordMap': records}
    target.write_text(json.dumps(result, ensure_ascii=False, indent=2))
    return result

if __name__ == '__main__':
    home = json.loads((OUT / 'notion-home.json').read_text())
    views = home['recordMap']['collection_view']
    ids = unwrap(next(iter(views.values())))['page_sort']
    def run(page_id):
        try:
            data = fetch(page_id)
            blocks = data['recordMap'].get('block', {})
            page = unwrap(blocks.get(page_id, {}))
            title = ''.join(x[0] for x in page.get('properties', {}).get('title', []))
            print(page_id, len(blocks), title, flush=True)
        except Exception as e: print(page_id, 'ERROR', str(e), flush=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        list(executor.map(run, ids))
