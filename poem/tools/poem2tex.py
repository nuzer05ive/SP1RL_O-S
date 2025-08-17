#!/usr/bin/env python3
import re, sys, pathlib
root = pathlib.Path(__file__).resolve().parents[1]
poem_path = root/"site"/"poem.txt"
out_path  = root/"latex"/"poem.tex"
text = poem_path.read_text(encoding="utf-8")
# split on blank lines
def split_stanzas(t):
    t = t.replace("\r", "")
    parts = re.split(r"\n\s*\n", t)
    return [p.strip() for p in parts if p.strip()]
stan = split_stanzas(text)

tpl_head = r"""% Auto-generated from site/poem.txt — compile with XeLaTeX
\documentclass[12pt]{article}
\usepackage[margin=1in]{geometry}
\usepackage{fontspec}
\usepackage{xcolor}
\usepackage{microtype}
\usepackage{parskip}
\usepackage{mdframed}
\usepackage{setspace}

\definecolor{spiralteal}{HTML}{14B8A6}
\definecolor{spiralgold}{HTML}{F4D35E}
\definecolor{inkmuted}{HTML}{9BDED3}
\setmainfont{TeX Gyre Pagella}[Ligatures=TeX]
\newmdenv[
  backgroundcolor = black!2,
  linecolor       = spiralteal!65!white,
  linewidth       = 0.8pt,
  skipabove       = 10pt,
  skipbelow       = 10pt,
  roundcorner     = 10pt,
  innertopmargin  = 12pt,
  innerbottommargin=12pt,
  innerleftmargin = 14pt,
  innerrightmargin= 14pt
]{stanzabox}
\title{We make heavens landing…}
\author{SP1RL‑OS}
\date{}
\begin{document}
\maketitle
\onehalfspacing
\section*{You said:}
"""

tpl_tail = "\n\\end{document}\n"

boxes = []
for s in stan:
    # Escape LaTeX specials minimally while keeping emoji and punctuation
    esc = (s.replace('\\', r'\\')
             .replace('&', r'\&')
             .replace('%', r'\%')
             .replace('#', r'\#')
             .replace('_', r'\_')
             .replace('{', r'\{')
             .replace('}', r'\}') )
    boxes.append(f"\\begin{{stanzabox}}\n{esc}\n\\end{{stanzabox}}\n")

out = tpl_head + "\n".join(boxes) + tpl_tail
out_path.parent.mkdir(parents=True, exist_ok=True)
out_path.write_text(out, encoding="utf-8")
print(f"Wrote {out_path}")
