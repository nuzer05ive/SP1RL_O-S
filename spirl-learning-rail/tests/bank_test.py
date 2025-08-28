import math

def cycloid_xy(A, t):
    x = A * (t - math.sin(t))
    y = A * (1 - math.cos(t))
    return x, y

def test_cycloid_xy():
    x, y = cycloid_xy(1.0, math.pi/2)
    assert abs(x - (math.pi/2 - 1)) < 1e-3
    assert abs(y - 1.0) < 1e-3
