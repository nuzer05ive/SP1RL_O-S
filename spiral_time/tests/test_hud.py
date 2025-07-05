import unittest
from spiral_time.solver import solve_spiral_time

class TestHUD(unittest.TestCase):
    def test_tau_multiple_rounding(self):
        res = solve_spiral_time(0)
        self.assertAlmostEqual(res['τ_multiple'], round(res['seconds'] /  (86400/89/10), 3))

if __name__ == '__main__':
    unittest.main()
