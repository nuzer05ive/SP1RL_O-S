import argparse, os
try:
    import cv2
    import numpy as np
except Exception:
    cv2 = None
    np = None

def generate(out_path: str = "sample.mp4"):
    """Generate a tiny sample mp4 for demos.
    Requires cv2 and numpy but keeps repository binary-free."""
    if cv2 is None or np is None:
        raise RuntimeError("cv2 and numpy required to generate sample video")
    os.makedirs(os.path.dirname(out_path) or ".", exist_ok=True)
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    writer = cv2.VideoWriter(out_path, fourcc, 30, (32, 32))
    for i in range(10):
        frame = np.full((32, 32, 3), i * 25, dtype=np.uint8)
        writer.write(frame)
    writer.release()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="generate sample mp4")
    parser.add_argument("output", nargs="?", default="sample.mp4")
    args = parser.parse_args()
    generate(args.output)
