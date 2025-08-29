#!/usr/bin/env python3
import sys,os,json,io,hashlib,math,re
from zcm import from_text, phi_jostle, AXES

ND   = sys.argv[1] if len(sys.argv)>=2 else "out/export.ndjson"
OUT  = sys.argv[2] if len(sys.argv)>=3 else "out"
PETW = int(os.environ.get("PETAL_W","1000"))

os.makedirs(OUT, exist_ok=True)
os.makedirs(os.path.join(OUT,"petals"), exist_ok=True)

idx = []
stickers_path = os.path.join(OUT, "stickers.jsonl")
ghost_path    = os.path.join(OUT, "ghost-starter.jsonl")
md_count=0; petal_count=0

def sha_tag(s): return int(hashlib.sha1(s.encode("utf-8")).hexdigest(),16)
def ring_step(h): return (h % 89, (h//89) % 89)

with io.open(ND,"r",encoding="utf-8") as f, \
     io.open(stickers_path,"w",encoding="utf-8") as st, \
     io.open(ghost_path,"w",encoding="utf-8") as gj:

    for line in f:
        conv=json.loads(line)
        title=conv.get("title","untitled")
        cid = conv.get("id","")
        created=str(conv.get("created",""))
        # assemble full text
        body = "\n".join([f'{t["role"]}: {t["text"].strip()}' for t in conv.get("turns",[]) if t.get("text")])
        # chunk to petals
        parts=[]
        i=0
        while i < len(body):
            j=min(len(body), i+PETW)
            # cut on last whitespace
            k=body.rfind(" ", i, j)
            if k==-1: k=j
            parts.append(body[i:k])
            i=k+1

        # filename
        safe="".join(c for c in title if c.isalnum() or c in "_-")[:60] or "untitled"
        fname=f"{created}_{safe}.md"
        path=os.path.join(OUT,"petals",fname)

        # write MD
        with io.open(path,"w",encoding="utf-8") as w:
            w.write(f"# {title}\n\n---\ncreated: {created}\nconvo_id: {cid}\n---\n")
            for pi,pet in enumerate(parts, start=1):
                z = from_text(pet)
                s = json.dumps(z, ensure_ascii=False)
                w.write(f"\n## Petal {pi}\n{pet}\n\nZCM: {s}\n")
                # sticker
                h=sha_tag(pet or title or cid)
                r,step=ring_step(h)
                st.write(json.dumps({"file":fname,"head":f"Petal {pi}","diamond":[r,step]})+"\n")
                # ghost line
                weight = 0.5*z["clarity"] + 0.4*z["sarcasm"] + 0.1
                gj.write(json.dumps({"text":pet[:400], "zcm":z, "diamond":[r,step], "weight":round(weight,3)}, ensure_ascii=False)+"\n")
                petal_count += 1
        # index heads
        heads=[{"head":f"Petal {i+1}"} for i in range(len(parts))]
        idx.append({"file":fname,"title":title,"heads":heads})
        md_count += 1

# write index
with io.open(os.path.join(OUT,"spirl_index.json"),"w",encoding="utf-8") as w:
    w.write(json.dumps({"files":idx}, ensure_ascii=False, indent=2))

print("petals:", md_count, "petal_count:", petal_count)
print("stickers:", stickers_path)
print("ghost-starter:", ghost_path)
