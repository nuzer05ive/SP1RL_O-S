import unittest
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT / 'scripts'))

import lore_weaver

LOG_FILE = ROOT / 'data' / 'lore_chapters.json'
LEDGER_FILE = ROOT / 'data' / 'pw_ledger.json'


class TestLoreWeaver(unittest.TestCase):
    def test_append_chapter_depth_and_bonus(self):
        with open(LOG_FILE, 'w') as f:
            json.dump({"chapters": []}, f)
        with open(LEDGER_FILE, 'w') as f:
            json.dump({}, f)
        title1, depth1 = lore_weaver.append_chapter(12, 'pair', 'alice')
        self.assertEqual(depth1, 1)
        title2, depth2 = lore_weaver.append_chapter(12, 'pair', 'alice')
        self.assertEqual(depth2, 2)
        self.assertIn('.e.Ri\u00b2', title2)
        with open(LEDGER_FILE) as f:
            ledger = json.load(f)
        self.assertEqual(ledger.get('alice'), 0.05)


if __name__ == '__main__':
    unittest.main()
