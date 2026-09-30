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
A live app's own source is the download. An import feature deserializes an uploaded
file with an unsafe deserializer (e.g. Python `pickle.load`) and the upload handler
validates only the file extension — no type or content safety. The player reviews the
source, crafts a malicious object whose deserialization hook (`__reduce__`) executes a
command, and uploads it. On import the payload runs, reading a server-only secret file
whose contents the app then *displays* (it renders the imported object), surfacing the
recovered phrase → which unlocks the flag.

## Player solve path
1. Read the shipped source; find `pickle.load` (or similar) on uploaded data with only
   an extension check.
2. Craft an object whose `__reduce__` runs a command to read the server secret.
3. Upload it with the accepted extension → RCE on import.
4. The app displays the imported result, revealing the phrase → submit → flag.
