import unittest
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT / 'SP1RL_O-S-core'))

from api._utils.narrative import compose
from api._utils.lexicon import get_assets_for_node


class TestNarrative(unittest.TestCase):
    def test_token_replacement(self):
        snap = {"moment_index": 1}
        node = 89
        text = compose(snap, node, eri_depth=2)
        bundle = get_assets_for_node(node)
        self.assertIn(bundle["yin_word"], text)
        self.assertIn(str(snap["moment_index"]), text)
        self.assertIn('.e.Ri2', text)
        self.assertIn('Episode Zero', text)


if __name__ == "__main__":
    unittest.main()
