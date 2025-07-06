import os
import json
import unittest
from tools.the_one_real_monday_generator import generate_assets


class TestTheOneRealMonday(unittest.TestCase):
    def test_generate_assets(self):
        summary = generate_assets('test-seed')
        self.assertIn('asset_types', summary)
        manifest_path = os.path.join('assets', 'assets_map.json')
        self.assertTrue(os.path.exists(manifest_path))
        with open(manifest_path) as f:
            manifest = json.load(f)
        for files in manifest.values():
            for path in files:
                full = os.path.join('assets', path)
                self.assertTrue(os.path.getsize(full) > 0)


if __name__ == '__main__':
    unittest.main()
