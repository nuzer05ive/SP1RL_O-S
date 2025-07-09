import apps.tools.glyphizer as g

def test_snap_phi_grid():
    x, y = g.snap_phi(102, 85)
    assert abs(x - 100) < 1e-6 and abs(y - 81.9) < 1
