import math, re
AXES = ["sarcasm","clarity","empathy","math","story","action","ambience","color","rhythm"]

LEX = [
    (re.compile(r"(lol|yeah right|sure|obviously|goo theorem|no-ether|!{2,}|\?{2,})", re.I), {"sarcasm":0.6}),
    (re.compile(r"( is | means | define | proof | therefore )", re.I), {"clarity":0.6}),
    (re.compile(r"(sorry|help|care|empathy|gentle)", re.I), {"empathy":0.6}),
    (re.compile(r"(phi|theta|omega|cycloid|venturi|ratio|euler)", re.I), {"math":0.7}),
    (re.compile(r"(story|quest|dialog|cutscene|lore)", re.I), {"story":0.6}),
    (re.compile(r"(attack|dash|jump|run|dodge)", re.I), {"action":0.6}),
    (re.compile(r"(rain|wind|fog|ambience|reverb)", re.I), {"ambience":0.6}),
    (re.compile(r"(violet|gold|blue|red|green|palette|hue)", re.I), {"color":0.6}),
    (re.compile(r"(beat|tempo|meter|rhythm|drum)", re.I), {"rhythm":0.6}),
]

def zeros(): return {k:0.0 for k in AXES}

def from_text(text:str)->dict:
    v=zeros()
    for rx,add in LEX:
        if rx.search(text or ""):
            for k,val in add.items(): v[k] = max(v[k], val)
    # small proxy nudges
    if "?" in text: v["clarity"] = max(v["clarity"], 0.3)
    return v

def phi_jostle(vec:dict, eps=0.02, t=0)->dict:
    PHI=(1+5**0.5)/2
    wob=eps*math.sin(PHI*t)
    out={k: min(1.0,max(0.0, val + wob*math.sin((i+1)*PHI))) for i,(k,val) in enumerate(vec.items())}
    return out

def sim(a:dict,b:dict)->float:
    dot=sum(a[k]*b[k] for k in AXES)
    na=sum(a[k]*a[k] for k in AXES)**0.5
    nb=sum(b[k]*b[k] for k in AXES)**0.5
    return dot/((na*nb)+1e-9)
