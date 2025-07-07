from math import sqrt, tau

PHI = (1 + sqrt(5)) / 2  # 1.618...
DELTA = 86400 / 89  # 970.7859551 s
TAU = DELTA / 10  # 97.07859551 s
K = sqrt(5) / 10000  # 0.000707106
PSI = PHI**-3  # 0.236067978

TUNNEL_COUNT = 8
TUNNEL_ANGLES = [k * tau / TUNNEL_COUNT for k in range(TUNNEL_COUNT)]
