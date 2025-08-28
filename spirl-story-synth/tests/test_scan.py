import pathlib, sys, unittest
root = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(root))
sys.path.insert(0, str(root.parent))  # allow vendored numpy
from workers.scan.mcpp import micro_cycloid_bank

class BankTest(unittest.TestCase):
    def test_bank_size(self):
        ks = micro_cycloid_bank()
        self.assertEqual(len(ks), 12)
        first = ks[0]
        if hasattr(first, "shape"):
            self.assertEqual(first.shape[0], 17)
            self.assertEqual(first.shape[1], 17)
        else:
            self.assertEqual(len(first), 17)
            self.assertEqual(len(first[0]), 17)

if __name__ == '__main__':
    unittest.main()
