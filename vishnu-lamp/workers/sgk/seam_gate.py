import argparse
import json
import hmac
import hashlib
from orientation import orientation_tag
from depth_refine import refine

def depth_estimate(seed: str):
  h = hmac.new(seed.encode(), b'depth', hashlib.sha256).hexdigest()
  return [int(h[:2], 16) / 255.0]

def fabricate(inp: str, out: str, seed: str):
  depth = depth_estimate(seed)
  depth = refine(depth)
  ori = orientation_tag(inp, seed)
  mesh = {
    "meshes": [
      {
        "geom": {
          "positions": [0, 0, 0, 1, 0, 0, 0, 1, 0],
          "indices": [0, 1, 2],
        },
        "orientation": ori,
      }
    ]
  }
  with open(out, "w") as f:
    json.dump(mesh, f)
  return mesh

def main():
  p = argparse.ArgumentParser()
  p.add_argument('--in', dest='inp', required=True)
  p.add_argument('--out', dest='out', required=True)
  p.add_argument('--seed', required=True)
  args = p.parse_args()
  fabricate(args.inp, args.out, args.seed)

if __name__ == '__main__':
  main()
