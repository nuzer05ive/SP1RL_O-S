from apps.vision.photogrammetry_lite import save_pointcloud
def test_runs_no_images(tmp_path):
    out = save_pointcloud([], out=tmp_path/"pts.json")
    assert "pts.json" in str(out)
