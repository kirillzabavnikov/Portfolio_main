"""Import supplied, extracted case images. Does not need network access."""
import json
import shutil
from pathlib import Path
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
FILES={
 'Лента порфтолио/Лента_новая.png':'745c40b3-b7d1-8349-baff-01428c9fd4f0',
 'Лента порфтолио/Оставить_новый_отзыв_1.png':'3f3c40b3-b7d1-80e9-bd1b-c7d92b534afa',
 'Лента порфтолио/Оставить_новый_отзыв_5.png':'3f3c40b3-b7d1-8056-a79a-fb84ce2971b1',
 'Лента порфтолио/Полноэкранный пост.png':'298c40b3-b7d1-82bb-ad0e-8195844d2663',
 'Лента порфтолио/Пульс_инвест_лента.png':'401c40b3-b7d1-8010-b312-d6c816d05e8b',
 'Лента порфтолио/Пульс_инвест_пост.png':'401c40b3-b7d1-80ae-be94-d7a775baa7e4',
 'Лента порфтолио/Пульс_профиль.png':'401c40b3-b7d1-8028-af54-ce6e74ce14fa',
 'Лента порфтолио/путешествие.png':'3f3c40b3-b7d1-8004-9f95-c0c6715b224b',
 'Лента порфтолио/Свой_профиль.png':'401c40b3-b7d1-80e5-b6a1-fa9d7b42bc16',
 'Лента порфтолио/Страница_поста_(Картинка).png':'486c40b3-b7d1-826c-bb1e-01aeb6b27126',
 'Лента порфтолио/Уведомления.png':'1fac40b3-b7d1-8356-90fd-816911e90876',
 'Редактор Пульс/Редактор новый.png':'3f9c40b3-b7d1-8069-bab2-c187b2c72575',
 'Редактор Пульс/Редактор новый 2.png':'3f9c40b3-b7d1-80c3-b206-dc385bcf1e22',
 'Редактор Пульс/Редактор старый.png':'8eec40b3-b7d1-83f4-8f0f-01b11e1e8d4f',
 'Редактор Пульс/Шторка___Выбор_несколльких_фото.png':'3f9c40b3-b7d1-8013-b67a-eea688aada4d',
 'Комментарии/Комментарии.png':'873c40b3-b7d1-838a-bf98-81f79b6a225c',
 'Комментарии/Комментарии (2).png':'3fac40b3-b7d1-80ab-bf70-e7fba4ee12f3',
 'Комментарии/Скелетон.png':'3fac40b3-b7d1-8089-b652-c2084c51731b',
 'Комментарии/Старые_комменты.png':'dfdc40b3-b7d1-839e-9bf4-01c1d3a9b5e5',
 'Задания/Задания_и_подарки.png':'237c40b3-b7d1-838e-b55e-0123ac466540',
 'Задания/Задания_разводящая.png':'e01c40b3-b7d1-82ac-b001-8173a60423d9',
 'Задания/Шторка_с_наградой.png':'1b2c40b3-b7d1-82bf-a9dc-818bf24be7f9',
 'Промокоды/Промокоды_разводящая.png':'95ac40b3-b7d1-8319-a05c-01eb37f0d5f5',
 'Промокоды/Промокоды_шторка.png':'124c40b3-b7d1-8224-a3d2-817af28f7177',
 'Промокоды/Промокоды_кб_и_скидки.png':'871c40b3-b7d1-83f3-9106-81e508395b05',
 'Промокоды/Промокоды_чекаут.png':'9e9c40b3-b7d1-82fd-8e02-81bf5d2422ef',
}
originals=ROOT/'content/original/images';originals.mkdir(parents=True,exist_ok=True)
public=ROOT/'public/images';public.mkdir(parents=True,exist_ok=True)
assets={}
mapping={}
for filename,id in FILES.items():
 source=ROOT/'content/export'/filename
 shutil.copyfile(source,originals/(id+'.png'))
 with Image.open(source) as image:
  image.thumbnail((1800,2400),Image.Resampling.LANCZOS)
  if image.mode not in ('RGB','RGBA'):image=image.convert('RGB')
  image.save(public/(id+'.webp'),'WEBP',quality=90,method=6)
  assets[id]={'path':'/images/'+id+'.webp','width':image.width,'height':image.height}
 mapping[id]=filename
(ROOT/'content/assets.json').write_text(json.dumps(assets,ensure_ascii=False,indent=2))
(ROOT/'content/original/export-map.json').write_text(json.dumps(mapping,ensure_ascii=False,indent=2))
expected=json.loads((ROOT/'content/original/assets.json').read_text())
missing=[a for a in expected if a['id'] not in assets]
(ROOT/'content/original/import-status.json').write_text(json.dumps({'imported':len(assets),'missing':missing},ensure_ascii=False,indent=2))
print('Imported',len(assets),'real screenshots; originals preserved, WebP copies created.')
