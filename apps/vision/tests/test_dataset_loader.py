from apps.vision.datasets.load_starter import fetch

def test_fetch():
  p = fetch("data/raw_test")
  assert (p/"egypt/tut_mask.jpg").exists()
