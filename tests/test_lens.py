import unittest
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT / 'SP1RL_O-S-core'))

from api import lens

class TestLensTranslator(unittest.TestCase):
    def test_translate(self):
        bundle = lens.translate({'node': 89})
        self.assertIn('yin_word', bundle)
        self.assertIn('yang_color', bundle)

if __name__ == '__main__':
    unittest.main()
