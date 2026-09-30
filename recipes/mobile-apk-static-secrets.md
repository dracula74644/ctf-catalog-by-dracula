---
slug: mobile-apk-static-secrets
title: Recover obfuscated credentials and a flag from an Android APK in a decompiler
category: Mobile Security
source_ctf: Digital Museum: The Archive of a Breach
difficulty: easy
skills: mobile, android, apk, static-analysis, jadx, deobfuscation
box_type: download
status: built
---

## Mechanic (theme-agnostic)
A shippable Android APK hides its real credentials and the flag in code, not in
plaintext. The secrets are lightly obfuscated (string reversal + Base64, split
across helper classes) so a naive `strings` scan misses them, but they fall out to
anyone who decompiles the app and reads the deobfuscation routine. A decoy
credential pair sits in an obvious config/test class to bait a shallow look.

## Player solve path
1. Decompile the APK (JADX / apktool) and browse the sources.
2. Spot the decoy creds in an obvious config class — note they don't unlock anything.
3. Find the credential/crypto helper classes; read how strings are transformed
   (reverse, Base64, XOR, etc.).
4. Reverse the transform on the stored blobs to recover the real credentials and the
   flag.

## What to plant
- FLAG: as an obfuscated blob in code, decoded at runtime (never plaintext).
- ACCESS KEY: a bit alongside — in a *different* class/resource than the flag blob
  (e.g. a manifest meta-data value or a separate helper), never the same string.

## Skin points (change per CTF)
Change: package name, app story, the obfuscation recipe, the decoy account.
Keep: no plaintext secret; a decode routine in the app; a decoy to punish shallow
analysis; solvable by static analysis alone.

## Blueprint mapping
- box_type: download; portal serves the `.apk`.
- build.py obfuscates `__FLAG_<ID>__` into the app's credential store and plants
  `__ACCESS_KEY_<ID>__` in a separate class/resource; app builds offline (framework
  only) so it decompiles cleanly.
