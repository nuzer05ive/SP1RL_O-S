import cv2, numpy as np, pathlib, json

def detect_points(img_path):
    img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
    if img is None: return []
    sift = cv2.SIFT_create()
    kps,_ = sift.detectAndCompute(img,None)
    return [(float(k.pt[0]), float(k.pt[1]), 1.0) for k in kps[:800]]

def save_pointcloud(img_paths, out="data/vision/points.json"):
    pts=[]
    for p in img_paths:
        pts += detect_points(p)
    pathlib.Path(out).parent.mkdir(parents=True, exist_ok=True)
    pathlib.Path(out).write_text(json.dumps({"points": pts}, indent=2))
    return out
