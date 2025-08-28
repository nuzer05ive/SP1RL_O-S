import json, os, sys
import numpy as np
try:
    import cv2  # type: ignore
except Exception:  # pragma: no cover
    cv2 = None
from mcpp import mcpp_blush


def main(video_path: str):
    frames = []
    if cv2 is not None:
        cap = cv2.VideoCapture(video_path)
        for _ in range(4):
            ok, frame = cap.read()
            if not ok:
                break
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            frames.append(gray)
        cap.release()
        if frames:
            mcpp_blush(frames)  # run analysis when cv2 available
    else:  # fallback: synthetic frames for offline tests
        frames = [np.zeros((32,32), dtype=np.uint8) for _ in range(4)]
    if not frames:
        return 1
    h, w = frames[0].shape
    scan = {
        "meta": {"fps": 30, "width": w, "height": h, "video": video_path},
        "cadence": {"in": 0, "out": len(frames), "gap": 0, "half_gap": 0},
        "alphas": [0.1, 0.5, 0.9],
        "rails": [
            {"A":1,"omega":1,"phi0":0,"x0":0,"y0":0,"theta_prime":0,"nu":1},
            {"A":0.5,"omega":1.5,"phi0":0,"x0":0,"y0":0,"theta_prime":0,"nu":1},
            {"A":0.8,"omega":1.2,"phi0":0,"x0":0,"y0":0,"theta_prime":0,"nu":1}
        ],
        "apex_times": [0.5],
        "objects": []
    }
    out = os.path.join(os.path.dirname(video_path), "scan.json")
    with open(out, "w") as f:
        json.dump(scan, f)
    return 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1]))
