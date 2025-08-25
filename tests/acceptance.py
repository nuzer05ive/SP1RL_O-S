import json
import subprocess
from pathlib import Path

OUT = Path('out')


def run_cli():
    subprocess.check_call(['python', 'cli/spirl_ghost.py', 'init'])
    subprocess.check_call([
        'python', 'cli/spirl_ghost.py', 'codex', 'ingest',
        '--in', 'fixtures/insert.sample.json',
        '--seed', '221', '--variants', '88',
        '--alpha', '0.618033', '--theta', '0.1416', '--switcharoo'
    ])


def test_acceptance_run(tmp_path):
    run_cli()
    assert (OUT / 'rail_map.json').exists()
    data = json.loads((OUT / 'rail_map.json').read_text().splitlines()[0])
    assert data['order'] == '1D-Ra//L'
    assert data['victor89']['index'] >= 1
    # footer lines
    footer = (OUT / 'rail_map.json').read_text().splitlines()[-2:]
    assert footer[0].startswith('Prime-Address:')
    assert footer[1].startswith('Build-Hash:')
