---
slug: web-lfi-file-read
title: Read hidden server files through the website
category: Web Application Security
source_ctf: Breach Response
skills: web, lfi, path-traversal
difficulty: medium
box_type: hosted
status: built
---

## Mechanic (theme-agnostic)
A file-serving endpoint (?file=) reads a user-supplied path with a weak filter that blocks literal '../' and absolute paths but misses percent-encoded traversal (%2e%2e%2f), letting the player read a runtime file outside the intended dir.

## Player solve path
1. Find the /view (or /download) endpoint and a doc that leaks the runtime file path.
2. Notice the naive filter; bypass it with an encoded traversal.
3. Read the target file.
