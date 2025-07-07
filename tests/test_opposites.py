import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT / "SP1RL_O-S-core"))

import json

import api.opposites as opp

QUEUE_FILE = ROOT / "data" / "opposites_queue.json"


class TestOpposites(unittest.TestCase):
    def test_vote_signoff(self):
        # reset file
        with open(QUEUE_FILE, "w") as f:
            json.dump(
                {"pair_id": "hash_hot_cold", "a": "hot", "b": "cold", "node_votes": {}},
                f,
            )
        node = 12
        for _ in range(3):
            res = opp.vote({"node": node, "vote": "yes"})
        self.assertEqual(res["signoffs"], 1)


if __name__ == "__main__":
    unittest.main()
