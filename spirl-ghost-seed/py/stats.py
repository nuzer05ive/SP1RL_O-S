#!/usr/bin/env python3
import sys, os, json, io, re

OUT = sys.argv[1] if len(sys.argv)>=2 else "out"
nd = os.path.join(OUT,"export.ndjson")
pets = os.path.join(OUT,"petals")
gst = os.path.join(OUT,"ghost-starter.jsonl")

def count_lines(p):
    try:
        with io.open(p,"r",encoding="utf-8") as f:
            return sum(1 for _ in f)
    except FileNotFoundError: return 0

print("conversations:", count_lines(nd))
print("petal files:  ", len([x for x in os.listdir(pets) if x.endswith(".md")]) if os.path.isdir(pets) else 0)
print("ghost lines:  ", count_lines(gst))
