import unittest

from apps.api.fold import fold


class TestFold(unittest.TestCase):
    def test_fold_stub(self):
        result = fold(color="red")
        self.assertIsInstance(result, dict)


if __name__ == "__main__":
    unittest.main()
