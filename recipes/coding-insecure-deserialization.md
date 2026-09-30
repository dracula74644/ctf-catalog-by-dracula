---
slug: coding-insecure-deserialization
title: Get RCE by uploading a malicious serialized object the app deserializes
category: Secure Coding
source_ctf: Digital Museum: The Archive of a Breach
difficulty: medium
skills: secure-coding, code-review, insecure-deserialization, pickle, rce
box_type: hosted
status: built
---

## Mechanic (theme-agnostic)
A live app ships its own source as the download. An import feature deserializes an
uploaded file with Python `pickle.load` on fully untrusted input, and the upload
handler validates only the file extension (an `endswith` check on the custom
extension) — no type, signature, or content safety. A server-only secret file holds a
phrase the app writes at startup. The player reviews the source, crafts an object whose
deserialization hook `__reduce__` returns a callable + args (e.g. `eval(...)` or
`subprocess.check_output([...])`) that reads that secret file; on import, unpickling
executes it. The app's post-import routine surfaces the imported object when it is a
`str`/`bytes` (renders it as a recovered "phrase"), so the exploit only has to RETURN
the secret's text. That phrase is then submitted to a second gate (case-insensitive
compare) to release the flag. A benign sample file is shipped, confirming the custom
extension is just plain pickle.

## Player solve path
1. Read the shipped source; find `pickle.load` on the uploaded file guarded only by an
   extension check, plus the server-secret file path and that the import routine
   displays `str`/`bytes` results.
2. Craft an object whose `__reduce__` runs a command to read the secret file (an `eval`
   or `subprocess` variant); pickle it into a file with the accepted extension.
3. Upload it → unpickling runs the payload (RCE) on import; the response displays the
   returned secret phrase.
4. Submit the recovered phrase to the second gate (case-insensitive) → flag.
