"""Download Notion attachments locally and produce optimized website copies."""
import concurrent.futures
import io
import json
import urllib.parse
import urllib.request
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
assets = json.loads((ROOT/'content/original/assets.json').read_text())
originals = ROOT/'content/original/images'
public = ROOT/'public/images'
originals.mkdir(parents=True, exist_ok=True)
public.mkdir(parents=True, exist_ok=True)
request = urllib.request.Request('https://www.notion.so/api/v3/getSignedFileUrls',
    data=json.dumps({'urls':[{'url':a['source'], 'permissionRecord':{'table':'block','id':a['id']}} for a in assets]}).encode(),
    headers={'Content-Type':'application/json'})
with urllib.request.urlopen(request,timeout=40) as response:
    urls = json.load(response)['signedUrls']

def download(pair):
    asset,url = pair
    original = originals/(asset['id']+'.png')
    if not original.exists():
        p = urllib.parse.urlsplit(url)
        url = urllib.parse.urlunsplit((p.scheme,p.netloc,urllib.parse.quote(urllib.parse.unquote(p.path)),p.query,p.fragment))
        with urllib.request.urlopen(url,timeout=60) as response:
            raw=response.read()
        Image.open(io.BytesIO(raw)).verify()
        original.write_bytes(raw)
    with Image.open(original) as image:
        image.thumbnail((1800,2400),Image.Resampling.LANCZOS)
        if image.mode not in ('RGB','RGBA'): image=image.convert('RGB')
        image.save(public/(asset['id']+'.webp'),'WEBP',quality=88,method=6)
        result={'path':'/images/'+asset['id']+'.webp','width':image.width,'height':image.height}
    print('Saved',asset['id'],asset['title'],flush=True)
    return asset['id'],result

results={}
failures=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
    futures={pool.submit(download,pair):pair[0] for pair in zip(assets,urls)}
    for future in concurrent.futures.as_completed(futures):
        try:
            key,value=future.result();results[key]=value
        except Exception as error:
            asset=futures[future];failures.append(asset['id']);print('FAILED',asset['id'],str(error),flush=True)
(ROOT/'content/assets.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
print('Downloaded',len(results),'failed',len(failures))
if failures: raise SystemExit(1)
