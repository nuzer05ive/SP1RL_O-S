def orientation_tag(path: str, seed: str) -> str:
  import hashlib
  h = hashlib.sha256((path + seed).encode()).hexdigest()
  return 'north' if int(h, 16) % 2 == 0 else 'south'
