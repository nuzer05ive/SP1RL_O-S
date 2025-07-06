import unittest
from datetime import datetime
from spiral_time.constants import PHI
from spiral_time.solver import mu, get_julian_day
from apps.api.daily_report import set_intention, zcm_snapshot, generate_story


class TestDailyReport(unittest.TestCase):
    def test_snapshot_and_story(self):
        user = "tester"
        intention = "focus"
        set_intention(user, intention)
        snap = zcm_snapshot(user)
        self.assertIn("math", snap)
        math = snap["math"]
        today = datetime.utcnow().strftime("%Y-%m-%d")
        S = get_julian_day(today)
        self.assertAlmostEqual(math["phi_fraction"], mu(S) / PHI, places=3)
        self.assertIn("story", snap)
        self.assertIn(intention, snap["story"])
        poem = generate_story(math, intention, [])
        self.assertGreaterEqual(len(poem.splitlines()), 12)


if __name__ == "__main__":
    unittest.main()
