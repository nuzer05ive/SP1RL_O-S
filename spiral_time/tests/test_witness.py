import unittest

from apps.api.witness import can_mint


class TestWitness(unittest.TestCase):
    def test_can_mint(self):
        user = {"assigned_node": 5, "wings_earned": False}
        self.assertTrue(can_mint(user, 5))
        self.assertFalse(can_mint(user, 6))
        user["wings_earned"] = True
        self.assertTrue(can_mint(user, 6))


if __name__ == "__main__":
    unittest.main()
