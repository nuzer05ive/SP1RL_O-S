import unittest
from spiral_time.solver import (
    get_julian_day,
    lap,
    wobble,
    overlap,
    solve_spiral_time,
    solve_sss,
    mu,
)

class TestSolver(unittest.TestCase):
    def test_julian_day(self):
        self.assertEqual(get_julian_day('1970-01-02'), 1)

    def test_lap(self):
        self.assertEqual(lap(90), 1)

    def test_wobble_overlap(self):
        w = wobble(2)
        o = overlap(2)
        self.assertTrue(w > 0)
        self.assertAlmostEqual(o, 2 * ((1 + 5 ** 0.5) / 2) ** -3, places=6)

    def test_solver(self):
        res = solve_spiral_time(0)
        self.assertIn('seconds', res)
        self.assertIn('clock', res)
        self.assertIn('\u03c4_multiple', res)

    def test_anchor_seconds(self):
        res = solve_spiral_time(0)
        self.assertAlmostEqual(res['seconds'], 0.217074464, places=3)

    def test_solve_sss(self):
        res = solve_sss('1970-01-01T00:00:00Z')
        self.assertIn('seconds', res)

if __name__ == '__main__':
    unittest.main()
