import numpy as np
from apps.audio.foldgen import build

def test_loop_integrity():
    f = build()
    assert np.abs(np.mean(f[:1000])) < 0.01
    assert len(f) > 100000
