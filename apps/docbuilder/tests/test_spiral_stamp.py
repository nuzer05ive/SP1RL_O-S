from apps.docbuilder.spiral_stamp import mint

def test_stamp_shape():
    s = mint("Lab")
    assert "(" in s.minute_slot and s.hundred_slot in range(0,100)
    assert s.st.startswith("[ST-") and s.place=="Lab"
