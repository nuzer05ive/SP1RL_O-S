import unittest
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT / 'SP1RL_O-S-core'))

from api import pedaling

class TestPedaling(unittest.TestCase):
    def test_draft_creation(self):
        res = pedaling.handler({"strokes": 12, "user": "alice"})
        draft = Path(res["draft"])
        self.assertTrue(draft.exists())
        sync_dir = Path('backend/sync') / res['branch'].split('/', 1)[1]
        self.assertTrue(sync_dir.exists())
        self.assertIn("branch", res)
        self.assertGreater(res.get("total", 0), 0)
        # cleanup
        draft.unlink()
        for p in sync_dir.glob('*'):
            p.unlink()
        sync_dir.rmdir()

if __name__ == '__main__':
    unittest.main()
