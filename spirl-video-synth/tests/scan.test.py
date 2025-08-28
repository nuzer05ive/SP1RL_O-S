import json, subprocess, os

ROOT = os.path.join(os.path.dirname(__file__), '..')

subprocess.run(['python', 'workers/scan/spirl_scan.py', 'fixtures/sample.mp4'], cwd=ROOT, check=True)
with open(os.path.join(ROOT, 'fixtures', 'scan.json')) as f:
    data = json.load(f)

assert len(data['rails']) >= 3
assert len(data['apex_times']) > 0
assert len(data['alphas']) == 3

print('ok')
