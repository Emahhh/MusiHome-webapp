"""Check local links/assets and the protected legacy bookmark surface."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import hashlib, json
ROOT=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
 def __init__(self, source):
  super().__init__(); self.links=[];self.ids=set();self.duplicate_ids=[];self.feed(source)
 def handle_starttag(self, tag, attrs):
  attrs=dict(attrs)
  if 'id' in attrs:
   if attrs['id'] in self.ids:self.duplicate_ids.append(attrs['id'])
   self.ids.add(attrs['id'])
  for key in ['src','href','poster']:
   if attrs.get(key):self.links.append(attrs[key])
pages={p:Page(p.read_text()) for p in ROOT.rglob('*.html')}
errors=[]
for path,page in pages.items():
 if page.duplicate_ids:errors.append(f'{path}: duplicate IDs {page.duplicate_ids}')
 for link in page.links:
  url=urlsplit(link)
  if url.scheme or url.netloc:continue
  target=ROOT/unquote(url.path).lstrip('/') if url.path.startswith('/') else path.parent/unquote(url.path) if url.path else path
  target=target.resolve()
  if target.is_dir():target=target/'index.html'
  if not target.exists():errors.append(f'{path.relative_to(ROOT)}: missing {link}')
  elif url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:
   errors.append(f'{path.relative_to(ROOT)}: missing anchor {link}')
for relative,digest in json.loads((ROOT/'scripts/bookmark-baseline.json').read_text()).items():
 path=ROOT/relative
 if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest()!=digest:
  errors.append('Protected bookmark file changed: '+relative)
assert not errors,'\n'.join(errors)
print(f'PASS: {len(pages)} pages; local links, images, anchors, and protected bookmark files verified.')
