import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.append(str(ROOT / "SP1RL_O-S-core"))
from api.daily_report import handler


class TestDailyReport(unittest.TestCase):
    def test_snapshot_and_story(self):
        user = "tester"
        result = handler({"user": user})
        self.assertIn("math", result)
        math = result["math"]
        self.assertIsInstance(math["phi_fraction"], float)
        self.assertIn("story", result)
        self.assertGreaterEqual(len(result["story"].splitlines()), 2)


if __name__ == "__main__":
    unittest.main()
