#!/usr/bin/env python3
"""Regenerate index.md from recipe frontmatter, organised by category + difficulty."""
import glob, os, re
root=os.path.dirname(os.path.abspath(__file__))
rows=[]
for f in sorted(glob.glob(os.path.join(root,"recipes","*.md"))):
    m=re.match(r'^---\n(.*?)\n---',open(f).read(),re.S); fm={}
    if m:
        for line in m.group(1).splitlines():
            if ":" in line:
                k,_,v=line.partition(":"); fm[k.strip()]=v.strip()
    rows.append(fm)
order={"easy":0,"medium":1,"hard":2}
rows.sort(key=lambda r:(r.get("category",""), order.get(r.get("difficulty",""),9), r.get("title","")))
out=["# Catalog index","",
     f"{len(rows)} recipe(s), browsed by **category** and **difficulty**. Add one with "
     "RECIPE-TEMPLATE.md, then re-run `python3 gen-index.py`.","",
     "| category | difficulty | title |",
     "|----------|------------|-------|"]
for r in rows:
    out.append("| {} | {} | {} |".format(
        r.get("category",""), r.get("difficulty",""), r.get("title","")))
open(os.path.join(root,"index.md"),"w").write("\n".join(out)+"\n")
print("index.md:",len(rows),"recipes")
