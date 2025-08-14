from apps.docbuilder.hyperbole_bounds import score_hyperbole

def test_bounds_penalize_unjustified_superlatives():
    s = score_hyperbole("This is the BEST and PERFECT solution for EVERYONE!", citations=[])
    assert s["score"] > 0.3

def test_citations_reduce_penalty():
    s = score_hyperbole("This may help some.", citations=["ref1","ref2","ref3"])
    assert s["score"] < 0.2
