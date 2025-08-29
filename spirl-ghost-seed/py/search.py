#!/usr/bin/env python3
import sys, os, re, io, json

OUT = sys.argv[1] if len(sys.argv)>=2 else "out"
Q   = sys.argv[2] if len(sys.argv)>=3 else "Noether|goo theorem"
rx  = re.compile(Q, re.I)

petdir=os.path.join(OUT,"petals")
for name in sorted(os.listdir(petdir)):
    if not name.endswith(".md"): continue
    path=os.path.join(petdir,name)
    with io.open(path,"r",encoding="utf-8") as f:
        lines=f.readlines()
    # map petal headings line numbers
    heads=[(i,l.strip()) for i,l in enumerate(lines) if l.startswith("## Petal ")]
    for i,line in enumerate(lines):
        if rx.search(line):
            # find nearest head above
            head="Petal ?"
            for li,h in heads:
                if li<=i: head=h
            snippet=line.strip()
            print(f"{name} → {head} : {snippet[:160]}")
