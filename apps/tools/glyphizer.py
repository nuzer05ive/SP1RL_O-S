"""
Glyphizer: Snaps SVG points to phi-grid and outputs JSON manifest.
"""
import svgpathtools as svg, math, json

PHI = (1+5**0.5)/2

def snap_phi(x, y, grid=20):
    return (round(x/grid)*grid, round(y/(grid*PHI))*grid*PHI)


def process_svg(svg_path):
    doc = svg.svg2paths(svg_path)[0]
    snapped = []
    for el in doc:
        pts = []
        for seg in el:
            pts.extend(seg.bpoints())
        pts = [snap_phi(x.real, x.imag) for x in pts]
        snapped.append(pts)
    with open(svg_path + ".json", "w") as f:
        json.dump(snapped, f)
    return snapped


if __name__ == "__main__":
    import sys
    process_svg(sys.argv[1])
