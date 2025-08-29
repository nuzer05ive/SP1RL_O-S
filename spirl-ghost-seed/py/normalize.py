#!/usr/bin/env python3
import sys, json, io

IN  = sys.argv[1] if len(sys.argv)>=2 else "conversations.json"
OUT = sys.argv[2] if len(sys.argv)>=3 else "out/export.ndjson"

def gen_conversations(js):
    if isinstance(js, list):
        for x in js: yield x
    elif isinstance(js, dict) and "conversations" in js:
        for x in js["conversations"]: yield x
    else:
        yield js

def flatten_text(parts):
    if parts is None: return ""
    if isinstance(parts, list): return " ".join([flatten_text(p) for p in parts])
    if isinstance(parts, dict) and "content" in parts: return flatten_text(parts["content"])
    if isinstance(parts, str): return parts
    return ""

def extract_turns(obj):
    turns=[]
    if isinstance(obj, dict) and "mapping" in obj:
        for k,v in obj["mapping"].items():
            msg=v.get("message") or {}
            role = (msg.get("author") or {}).get("role","user")
            cont = msg.get("content")
            text = ""
            if isinstance(cont, dict):
                text = flatten_text(cont.get("parts"))
            elif isinstance(cont, list):
                text = " ".join([flatten_text(c) for c in cont])
            else:
                text = str(cont or "")
            if text.strip():
                turns.append({"role":role, "text":text})
    elif isinstance(obj, dict) and "messages" in obj:
        for m in obj["messages"]:
            role=(m.get("author") or {}).get("role", m.get("role","user"))
            cont=m.get("content")
            text=""
            if isinstance(cont, dict):
                text=flatten_text(cont.get("parts"))
            elif isinstance(cont, list):
                text=" ".join([flatten_text(c) for c in cont])
            else:
                text=str(cont or "")
            if text.strip():
                turns.append({"role":role, "text":text})
    return turns

with io.open(IN, "r", encoding="utf-8") as f, io.open(OUT, "w", encoding="utf-8") as w:
    js=json.load(f)
    for conv in gen_conversations(js):
        out = {
            "id": conv.get("id") or conv.get("conversation_id") or conv.get("_id") or "",
            "title": conv.get("title") or "untitled",
            "created": conv.get("create_time") or conv.get("create_time??") or "",
            "turns": extract_turns(conv)
        }
        w.write(json.dumps(out, ensure_ascii=False) + "\n")
print("wrote", OUT)
