import json
from pathlib import Path

from spirl_ghost import codex
from spirl_ghost.utils import readability_scores


FIXTURE = Path('fixtures/insert.sample.json')

def load_fixture():
    return codex.load(json.loads(FIXTURE.read_text()))


def test_determinism(tmp_path):
    parsed = load_fixture()
    rail1 = codex.lift_cube(parsed, 0.1, 0.2)
    rail2 = codex.lift_cube(parsed, 0.1, 0.2)
    assert rail1 == rail2


def test_triplet_cadence():
    parsed = load_fixture()
    chapter = codex.weave_chapter(parsed)
    diamonds = chapter['paragraph'].count('shines')
    assert diamonds == 1  # one extra sentence for third beat


def test_pov_flip():
    parsed = load_fixture()
    rail = codex.lift_cube(parsed, 0.1, 0.2)
    assert rail['pov'] == 'switcharoo'


def test_readability():
    parsed = load_fixture()
    paragraph = codex.weave_chapter(parsed)['paragraph']
    scores = readability_scores(paragraph)
    assert scores['RL2'] >= 0.70
    assert scores['Cohesion'] >= 0.65
    assert scores['Adequacy'] >= 0.70


def test_ui_grid():
    parsed = load_fixture()
    layout = codex.layout_ui(parsed)
    w, h = layout['grid']
    for atom in layout['atoms']:
        assert 0 <= atom['x'] < w
        assert 0 <= atom['y'] < h
        assert isinstance(atom['w'], int) and isinstance(atom['h'], int)
    assert layout['header']['rotation'] == 137.5

def test_align_pairs():
    parsed = load_fixture()
    victor, report = codex.align_pairs(parsed.pairs, seed=221, variants=88)
    assert len(report) == 88
    base = parsed.pairs[0]['weight']
    assert victor['score'] >= base + 0.05


def test_pov_flip_nodes():
    parsed = load_fixture()
    rail = codex.lift_cube(parsed, 0.1, 0.2)
    parsed2 = codex.load(json.loads(FIXTURE.read_text().replace('true', 'false')))
    rail2 = codex.lift_cube(parsed2, 0.1, 0.2)
    assert rail['nodes'][0]['corner'] != rail2['nodes'][0]['corner']
