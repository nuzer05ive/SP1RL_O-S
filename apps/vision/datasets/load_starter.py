import base64
import pathlib, urllib.request
from urllib.error import URLError

STARTER = {
  "egypt/tut_mask.jpg":"https://upload.wikimedia.org/wikipedia/commons/8/8c/Tutmask.jpg",
  "meso/zigg_ur.jpg":"https://upload.wikimedia.org/wikipedia/commons/1/14/Ziggurat_of_Ur_aerial.jpg",
}

_PLACEHOLDER = base64.b64decode(
  "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8Af//Z"
)

def fetch(base="data/raw"):
  base = pathlib.Path(base)
  opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
  urllib.request.install_opener(opener)
  for rel, url in STARTER.items():
    path = base/rel
    path.parent.mkdir(parents=True, exist_ok=True)
    if not path.exists():
      try:
        urllib.request.urlretrieve(url, path)
      except URLError:
        path.write_bytes(_PLACEHOLDER)
  return base
