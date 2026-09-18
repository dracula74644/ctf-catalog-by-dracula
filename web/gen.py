#!/usr/bin/env python3
"""Read every recipe and write web/recipes.json (frontmatter + body) for the viewer."""
import glob, json, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = []
for f in sorted(glob.glob(os.path.join(ROOT, "recipes", "*.md"))):
    raw = open(f).read()
    m = re.match(r'^---\n(.*?)\n---\n(.*)$', raw, re.S)
    fm, body = ({}, raw)
    if m:
        body = m.group(2).strip()
        for line in m.group(1).splitlines():
            if ":" in line:
                k, _, v = line.partition(":")
                fm[k.strip()] = v.strip()
    skills = [s.strip() for s in fm.get("skills", "").split(",") if s.strip()]
    out.append({
        "slug": fm.get("slug", os.path.basename(f)[:-3]),
        "title": fm.get("title", ""),
        "skills": skills,
        "box_type": fm.get("box_type", ""),
        "difficulty": fm.get("difficulty", ""),
        "category": fm.get("category", ""),
        "status": fm.get("status", ""),
        "body": body,
    })
dest = os.path.join(ROOT, "web", "recipes.json")
open(dest, "w").write(json.dumps(out, indent=2) + "\n")
print(f"web/recipes.json: {len(out)} recipes")
